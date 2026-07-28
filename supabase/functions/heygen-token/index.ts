const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const HEYGEN_API_BASE = 'https://api.heygen.com'

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const summarizeProviderResponse = (text: string) => {
  const trimmed = text.trim()
  if (!trimmed) return 'No response body returned from HeyGen.'
  if (trimmed.startsWith('<')) {
    return 'HeyGen returned an HTML error page instead of JSON.'
  }
  return trimmed.slice(0, 500)
}

interface AvatarLook {
  id: string
  name?: string
  avatar_type?: string
  default_voice_id?: string | null
  tags?: string[]
}

async function fetchDefaultAvatar(apiKey: string): Promise<{ avatar_id: string; voice_id: string } | null> {
  try {
    const res = await fetch(
      `${HEYGEN_API_BASE}/v3/avatars/looks?avatar_type=studio_avatar&ownership=public&limit=30`,
      {
        method: 'GET',
        headers: {
          'X-Api-Key': apiKey,
          'Accept': 'application/json',
        },
      }
    )
    const text = await res.text()
    let json: any = null
    try { json = JSON.parse(text) } catch { json = null }
    if (!json?.data || !Array.isArray(json.data) || json.data.length === 0) return null

    const looks: AvatarLook[] = json.data
    const preferred = looks.find((look) =>
      look.tags?.some((tag) => /business|professional|formal/i.test(tag))
    ) ?? looks[0]

    if (!preferred?.id) return null

    const voiceId = preferred.default_voice_id || '1bd001e7e50f421d8919866c76f3f27f'
    return { avatar_id: preferred.id, voice_id: voiceId }
  } catch (e) {
    console.warn('[heygen-token] Failed to fetch default avatar:', e)
    return null
  }
}

async function createAvatarRealtimeSession(
  apiKey: string,
  avatar_id: string,
  voice_id: string,
  greeting: string
): Promise<{ stream_id: string } | null> {
  const res = await fetch(`${HEYGEN_API_BASE}/v3/avatar-realtime`, {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'tts',
      avatar_id,
      voice_id,
      text: greeting,
    }),
  })

  const responseText = await res.text()
  let json: any = null
  try { json = JSON.parse(responseText) } catch { json = null }

  if (!res.ok || !json?.data?.stream_id) {
    console.info('[heygen-token] Create session failed', {
      status: res.status,
      body: summarizeProviderResponse(responseText),
    })
    return null
  }

  return { stream_id: json.data.stream_id }
}

async function pollForHlsUrl(
  apiKey: string,
  stream_id: string,
  maxAttempts = 30
): Promise<string | null> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(1500)

    const res = await fetch(`${HEYGEN_API_BASE}/v3/avatar-realtime/${stream_id}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json',
      },
    })

    const text = await res.text()
    let json: any = null
    try { json = JSON.parse(text) } catch { json = null }

    const status = json?.data?.status
    const hls_url = json?.data?.hls_url

    console.info('[heygen-token] Poll session', {
      attempt,
      status,
      hasHls: !!hls_url,
      httpStatus: res.status,
    })

    if (hls_url) return hls_url
    if (status === 'error' || status === 'completed') {
      console.info('[heygen-token] Session ended without HLS', {
        status,
        error: json?.data?.error_message,
      })
      return null
    }
  }

  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const apiKey = Deno.env.get('HEYGEN_API_KEY')
    if (!apiKey) {
      return jsonResponse({ hls_url: null, mode: 'fallback', error: 'HEYGEN_API_KEY not configured' })
    }

    let body: { greeting?: string; avatar_id?: string; voice_id?: string; message?: string } = {}
    try {
      body = await req.json()
    } catch {
      body = {}
    }

    const greeting = body.greeting?.trim() || 'Welcome to RE Pro Business Credit.'

    let avatar_id = body.avatar_id?.trim()
    let voice_id = body.voice_id?.trim()

    if (!avatar_id || !voice_id) {
      const defaults = await fetchDefaultAvatar(apiKey)
      if (defaults) {
        avatar_id = avatar_id || defaults.avatar_id
        voice_id = voice_id || defaults.voice_id
      }
    }

    if (!avatar_id || !voice_id) {
      return jsonResponse({
        hls_url: null,
        mode: 'fallback',
        error: 'No avatar or voice configured and no public default available.',
      })
    }

    const session = await createAvatarRealtimeSession(apiKey, avatar_id, voice_id, greeting)
    if (!session) {
      return jsonResponse({
        hls_url: null,
        mode: 'fallback',
        error: 'HeyGen realtime session could not be created.',
      })
    }

    const hls_url = await pollForHlsUrl(apiKey, session.stream_id)
    if (!hls_url) {
      return jsonResponse({
        hls_url: null,
        mode: 'fallback',
        error: 'HeyGen realtime session did not produce a playable video URL.',
      })
    }

    return jsonResponse({ hls_url, mode: 'live', avatar_id, voice_id })
  } catch (e) {
    console.error('[heygen-token] Function failed; using fallback', e)
    return jsonResponse({ hls_url: null, mode: 'fallback', error: 'HeyGen request failed' })
  }
})
