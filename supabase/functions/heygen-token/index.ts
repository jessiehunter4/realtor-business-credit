const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const HEYGEN_TOKEN_ENDPOINTS = [
  'https://api.heygen.com/v1/streaming.create_token',
  'https://api.heygen.com/v1/streaming/create_token',
]

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const summarizeProviderResponse = (text: string) => {
  const trimmed = text.trim()
  if (!trimmed) return 'No response body returned from HeyGen.'
  if (trimmed.startsWith('<')) {
    return 'HeyGen returned an HTML error page instead of JSON. The streaming-token endpoint may be unavailable for this API key or account.'
  }
  return trimmed.slice(0, 500)
}

const getHeyGenToken = (json: any) =>
  json?.data?.token ?? json?.token ?? json?.access_token ?? json?.data?.access_token

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const apiKey = Deno.env.get('HEYGEN_API_KEY')
    if (!apiKey) {
      return jsonResponse({ token: null, mode: 'fallback', error: 'HEYGEN_API_KEY not configured' })
    }

    let lastStatus = 0
    let lastBody = ''
    let json: any = null
    for (const endpoint of HEYGEN_TOKEN_ENDPOINTS) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      lastStatus = res.status
      lastBody = await res.text()
      console.info('HeyGen token attempt', { endpoint, status: res.status })
      try { json = JSON.parse(lastBody) } catch { json = null }
      if (res.ok && json) break
      json = null
    }

    if (!json) {
      console.info('HeyGen token unavailable; using greeting fallback', {
        status: lastStatus,
        body: summarizeProviderResponse(lastBody),
      })
      return jsonResponse({
        token: null,
        mode: 'fallback',
        error: 'HeyGen token unavailable',
        status: lastStatus,
        details: summarizeProviderResponse(lastBody),
      })
    }

    const token = getHeyGenToken(json)
    if (!token) {
      return jsonResponse({
        token: null,
        mode: 'fallback',
        error: 'HeyGen did not return a streaming token',
      })
    }

    return jsonResponse({ token, mode: 'live' })
  } catch (e) {
    console.error('HeyGen token function failed; using greeting fallback', e)
    return jsonResponse({ token: null, mode: 'fallback', error: 'HeyGen token request failed' })
  }
})