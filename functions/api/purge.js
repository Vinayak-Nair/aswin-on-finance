/**
 * Cloudflare Pages Function — Cache Purge
 * POST /api/purge
 * Body: { "slug": "post-slug" }
 * Header: Authorization: Bearer <PURGE_SECRET>
 *
 * Purges edge-cached responses for blog list + specific post.
 * Env vars required: PURGE_SECRET
 * Optional env vars: CF_ZONE_ID, CF_API_TOKEN (for global Cloudflare cache purge)
 */

export async function onRequestPost(context) {
    const { env, request } = context;

    // Validate secret
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const purgeSecret = env.PURGE_SECRET;

    if (!purgeSecret || token !== purgeSecret) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let slug = null;
    try {
        const body = await request.json();
        slug = body.slug;
    } catch (e) {
        // No body or invalid JSON is fine — we'll just purge the list
    }

    const origin = new URL(request.url).origin;
    const cache = caches.default;
    const purgedUrls = [];

    // Purge the posts list endpoint (all variants)
    const listUrls = [
        `${origin}/api/posts`,
        `${origin}/api/posts?limit=3`,
    ];

    for (const url of listUrls) {
        const deleted = await cache.delete(new Request(url));
        if (deleted) purgedUrls.push(url);
    }

    // Purge the specific post endpoint
    if (slug) {
        const postUrl = `${origin}/api/post?slug=${encodeURIComponent(slug)}`;
        const deleted = await cache.delete(new Request(postUrl));
        if (deleted) purgedUrls.push(postUrl);
    }

    // Optional: Global Cloudflare cache purge via API
    if (env.CF_ZONE_ID && env.CF_API_TOKEN) {
        try {
            const purgeFiles = [
                `${origin}/`,
                `${origin}/blog/`,
                `${origin}/blog/index.html`,
            ];
            if (slug) {
                purgeFiles.push(`${origin}/blog/post.html?slug=${slug}`);
            }

            await fetch(`https://api.cloudflare.com/client/v4/zones/${env.CF_ZONE_ID}/purge_cache`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.CF_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ files: purgeFiles }),
            });
        } catch (e) {
            // Non-fatal — local cache was already purged
            console.error('Cloudflare zone purge failed:', e);
        }
    }

    return new Response(JSON.stringify({
        success: true,
        purged: purgedUrls,
        slug: slug || null,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
