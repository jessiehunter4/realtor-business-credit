const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const HEYGEN_TOKEN_ENDPOINT = 'https://api.heygen.com/v1/streaming.create_token'

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

    const res = await fetch(HEYGEN_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const text = await res.text()
    let json: any = null
    try { json = JSON.parse(text) } catch { /* non-JSON */ }

    if (!res.ok || !json) {
      console.info('HeyGen token unavailable; using greeting fallback', {
        status: res.status,
        contentType: res.headers.get('content-type'),
        body: summarizeProviderResponse(text),
      })

      return jsonResponse({
        token: null,
        mode: 'fallback',
        error: 'HeyGen token unavailable',
        status: res.status,
        details: summarizeProviderResponse(text),
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