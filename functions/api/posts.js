/**
 * Cloudflare Pages Function — List Posts
 * GET /api/posts?limit=N
 *
 * Proxies Supabase REST API with edge caching.
 * Env vars required: SUPABASE_URL, SUPABASE_KEY
 */

export async function onRequestGet(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');

    // Build cache key
    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;

    // Check edge cache first
    let response = await cache.match(cacheKey);
    if (response) {
        return response;
    }

    // Build Supabase REST URL
    const supabaseUrl = env.SUPABASE_URL || 'https://dkbbwokogdyulhfxqovs.supabase.co';
    const supabaseKey = env.SUPABASE_KEY || 'sb_publishable__Am_y-u011lJ5lxBc9VPnQ_wKLPINLk';

    let restUrl = `${supabaseUrl}/rest/v1/posts?select=id,title,slug,excerpt,category,published_at,thumbnail_url&order=published_at.desc`;

    if (limit) {
        restUrl += `&limit=${parseInt(limit, 10)}`;
    }

    try {
        const supabaseResponse = await fetch(restUrl, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
            },
        });

        if (!supabaseResponse.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
                status: supabaseResponse.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const posts = await supabaseResponse.json();

        // Build cacheable response
        response = new Response(JSON.stringify(posts), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
                'Access-Control-Allow-Origin': '*',
            },
        });

        // Store in edge cache (non-blocking)
        context.waitUntil(cache.put(cacheKey, response.clone()));

        return response;
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
