const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const apiKey = Deno.env.get('HEYGEN_API_KEY')
    if (!apiKey) {
      return jsonResponse({ token: null, error: 'HEYGEN_API_KEY not configured' })
    }

    const res = await fetch('https://api.heygen.com/v1/streaming.create_token', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'Accept': 'application/json' },
    })
    const text = await res.text()
    let json: any = null
    try { json = JSON.parse(text) } catch { /* non-JSON */ }

    if (!res.ok || !json) {
      console.warn('HeyGen token request failed', {
        status: res.status,
        contentType: res.headers.get('content-type'),
        body: summarizeProviderResponse(text),
      })

      return jsonResponse({
        token: null,
        error: 'HeyGen token unavailable',
        status: res.status,
        details: summarizeProviderResponse(text),
      })
    }

    const token = json?.data?.token ?? json?.token
    if (!token) {
      return jsonResponse({ token: null, error: 'HeyGen did not return a streaming token' })
    }

    return jsonResponse({ token })
  } catch (e) {
    console.error('HeyGen token function failed', e)
    return jsonResponse({ token: null, error: 'HeyGen token request failed' })
  }
})