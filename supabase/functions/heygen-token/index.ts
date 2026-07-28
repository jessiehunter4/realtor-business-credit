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
  supported_api_engines?: string[]
}

async function fetchDefaultAvatar(apiKey: string): Promise<{ avatar_id: string; voice_id: string; engine?: string } | null> {
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
    if (!json?.data || !Array.isArray(json.data) || json.data.length === 0) {
      console.info('[heygen-token] No public avatar looks returned', { status: res.status, body: summarizeProviderResponse(text) })
      return null
    }

    const looks: AvatarLook[] = json.data
    const preferred = looks.find((look) =>
      look.tags?.some((tag) => /business|professional|formal/i.test(tag))
    ) ?? looks[0]

    if (!preferred?.id) return null

    const voiceId = preferred.default_voice_id || '1bd001e7e50f421d8919866c76f3f27f'
    const engine = preferred.supported_api_engines?.includes('avatar_v')
      ? 'avatar_v'
      : preferred.supported_api_engines?.[0]

    return { avatar_id: preferred.id, voice_id: voiceId, engine }
  } catch (e) {
    console.warn('[heygen-token] Failed to fetch default avatar:', e)
    return null
  }
}

async function createAvatarVideo(
  apiKey: string,
  avatar_id: string,
  voice_id: string,
  script: string,
  engine?: string
): Promise<{ video_id: string } | null> {
  const payload: Record<string, any> = {
    type: 'avatar',
    avatar_id,
    voice_id,
    script,
    aspect_ratio: '16:9',
    output_format: 'mp4',
    title: 'RE Pro Business Credit personalized greeting',
  }

  if (engine) {
    payload.engine = { type: engine }
  }

  const res = await fetch(`${HEYGEN_API_BASE}/v3/videos`, {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const responseText = await res.text()
  let json: any = null
  try { json = JSON.parse(responseText) } catch { json = null }

  if (!res.ok || !json?.data?.video_id) {
    console.info('[heygen-token] Create video failed', {
      status: res.status,
      body: summarizeProviderResponse(responseText),
    })
    return null
  }

  return { video_id: json.data.video_id }
}

async function pollForVideoUrl(
  apiKey: string,
  video_id: string,
  maxAttempts = 40
): Promise<string | null> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(2000)

    const res = await fetch(`${HEYGEN_API_BASE}/v3/videos/${video_id}`, {
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
    const video_url = json?.data?.video_url

    console.info('[heygen-token] Poll video', {
      attempt,
      status,
      hasUrl: !!video_url,
      httpStatus: res.status,
    })

    if (video_url) return video_url
    if (status === 'failed' || json?.data?.failure_code) {
      console.info('[heygen-token] Video render failed', {
        failure_code: json?.data?.failure_code,
        failure_message: json?.data?.failure_message,
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
      return jsonResponse({ video_url: null, mode: 'fallback', error: 'HEYGEN_API_KEY not configured' })
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
    let engine: string | undefined

    if (!avatar_id || !voice_id) {
      const defaults = await fetchDefaultAvatar(apiKey)
      if (defaults) {
        avatar_id = avatar_id || defaults.avatar_id
        voice_id = voice_id || defaults.voice_id
        engine = defaults.engine
      }
    }

    if (!avatar_id || !voice_id) {
      return jsonResponse({
        video_url: null,
        mode: 'fallback',
        error: 'No avatar or voice configured and no public default available.',
      })
    }

    const session = await createAvatarVideo(apiKey, avatar_id, voice_id, greeting, engine)
    if (!session) {
      return jsonResponse({
        video_url: null,
        mode: 'fallback',
        error: 'HeyGen video could not be created.',
      })
    }

    const video_url = await pollForVideoUrl(apiKey, session.video_id)
    if (!video_url) {
      return jsonResponse({
        video_url: null,
        mode: 'fallback',
        error: 'HeyGen video did not finish rendering in time.',
      })
    }

    return jsonResponse({ video_url, mode: 'live', avatar_id, voice_id })
  } catch (e) {
    console.error('[heygen-token] Function failed; using fallback', e)
    return jsonResponse({ video_url: null, mode: 'fallback', error: 'HeyGen request failed' })
  }
})
