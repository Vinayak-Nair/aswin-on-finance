const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configure Supabase (using keys from your client file)
const supabaseUrl = 'https://dkbbwokogdyulhfxqovs.supabase.co';
const supabaseKey = 'sb_publishable__Am_y-u011lJ5lxBc9VPnQ_wKLPINLk'; // This should ideally be a service role key for full access, but let's try with this one first if RLS allows public inserts (likely not, might need to update RLS or ask for service key).
// Wait, the client key might not have permission to insert if RLS is strict. 
// However, the user said they updated RLS?
// Let's assume the user set up RLS for authenticated users, which means I might need to sign in first.
// But looking at the implementation plan, the user was asked to create policies.
// "Admins can insert posts" on posts for insert with check (auth.role() = 'authenticated');
// This means I need to be authenticated.
// For simplicity in a script, usually we use the SERVICE_ROLE_KEY which bypasses RLS.
// But I don't have that.
// I will try to sign in as the admin user created earlier!
// Wait, I don't know the admin password.
// Or maybe I can use the anon key if I didn't enable strict RLS yet?
// Actually, let's look at the `supabase-client.js`. It uses the anon key.
// If the table has RLS enabled and only allows authenticated users to insert, this script will fail with the anon key unless I authenticate.
// BUT, the user MIGHT NOT have enabled RLS or might have set a policy allowing anon inserts for testing?
// Given the instructions, the user was asked to enable RLS.
// Let's try to proceed. If it fails, I will ask the user for the SERVICE_ROLE_KEY or to temporarily disable RLS.
// OR, I can use the admin login.
// I don't have the admin password.
// Let's try to see if I can sign in with a hardcoded credential or just try the insert.
// Actually, for migration scripts, usually we use the service role key.
// I'll check if the environment variables have it? Unlikely.
// I will attempt the insert. If it fails, I'll prompt the user.

const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Define the posts metadata (from blog/script.js)
const blogPosts = [
    {
        id: 1,
        title: "I'm an NRI and totally confused about how to invest in Indian stocks. How are people doing this?",
        category: "Investing",
        date: "2026-01-20", // Standardized to ISO
        thumbnail: "images/1.webp",
        url: "posts/1.html"
    },
    {
        id: 2,
        title: "Do I need to pay tax in India on money I send from abroad to my family?",
        category: "Tax",
        date: "2026-01-20",
        thumbnail: "images/2.webp",
        url: "posts/2.html"
    },
    {
        id: 3,
        title: "Can someone explain NRE vs NRO accounts in very simple terms?",
        category: "Banking",
        date: "2026-01-20",
        thumbnail: "images/3.webp",
        url: "posts/3.html"
    },
    {
        id: 4,
        title: "Is it mandatory to convert my Indian savings account to NRO after becoming NRI?",
        category: "Banking",
        date: "2026-01-20",
        thumbnail: "images/4.webp",
        url: "posts/4.html"
    },
    {
        id: 5,
        title: "Is interest on NRE FD really tax-free in India? Do I still need to report it abroad?",
        category: "Tax",
        date: "2026-01-20",
        thumbnail: "images/5.webp",
        url: "posts/5.html"
    },
    {
        id: 6,
        title: "How many days can I stay in India without losing my NRI status for tax purposes?",
        category: "Tax",
        date: "2026-01-20",
        thumbnail: "images/6.webp",
        url: "posts/6.html"
    },
    {
        id: 7,
        title: "If I stay in India for 5-6 months in a year, what happens to my tax status?",
        category: "Tax",
        date: "2026-01-20",
        thumbnail: "images/7.webp",
        url: "posts/7.html"
    },
    {
        id: 8,
        title: "Do I need to file an Income Tax Return (ITR) in India if I only have small interest/rent income?",
        category: "Tax",
        date: "2026-01-20",
        thumbnail: "images/8.webp",
        url: "posts/8.html"
    },
    {
        id: 9,
        title: "I have rental income from India – how is it taxed and what about TDS?",
        category: "Tax",
        date: "2026-01-20",
        thumbnail: "images/9.webp",
        url: "posts/9.html"
    },
    {
        id: 10,
        title: "If I sell a property in India, why is TDS so high for NRIs?",
        category: "Property",
        date: "2026-01-20",
        thumbnail: "images/10.webp",
        url: "posts/10.html"
    },
    {
        id: 11,
        title: "After selling property, how do I take the money abroad?",
        category: "Property",
        date: "2026-01-20",
        thumbnail: "images/11.webp",
        url: "posts/11.html"
    },
    {
        id: 12,
        title: "Can I invest in Indian Mutual Funds as an NRI?",
        category: "Investing",
        date: "2026-01-20",
        thumbnail: "images/12.webp",
        url: "posts/12.html"
    },
    {
        id: 13,
        title: "Why do some mutual funds block US/Canada NRIs because of FATCA?",
        category: "Investing",
        date: "2026-01-20",
        thumbnail: "images/13.webp",
        url: "posts/13.html"
    },
    {
        id: 14,
        title: "My SIPs got stopped after I became NRI – why and how to fix it?",
        category: "Investing",
        date: "2026-01-20",
        thumbnail: "images/14.webp",
        url: "posts/14.html"
    },
    {
        id: 15,
        title: "What exactly is FATCA and why does every bank ask for it?",
        category: "Banking",
        date: "2026-01-20",
        thumbnail: "images/15.webp",
        url: "posts/15.html"
    },
    {
        id: 16,
        title: "Can I still claim 80C deductions in India as an NRI?",
        category: "Tax",
        date: "2026-01-20",
        thumbnail: "images/16.webp",
        url: "posts/16.html"
    },
    {
        id: 17,
        title: "Can I continue investing in PPF after becoming NRI?",
        category: "Investing",
        date: "2026-01-20",
        thumbnail: "images/17.webp",
        url: "posts/17.html"
    }
];

// 2. Function to read HTML and extract content
const extractContent = (htmlContent) => {
    // A simple regex to extract content within <div class="article-content">...</div>
    // Note: This is brittle but sufficient for this static migration.
    const match = htmlContent.match(/<div class="article-content">([\s\S]*?)<\/div>\s*<nav/i);
    if (match && match[1]) {
        return match[1].trim();
    }
    return '';
};

// 3. Migrate function
const migrate = async () => {
    console.log(`Starting migration of ${blogPosts.length} posts...`);

    // Authenticate if needed (skipping for now, hoping for public/anon insert or user to provide key if failed)

    for (const post of blogPosts) {
        const filePath = path.join(__dirname, '../blog', post.url);

        try {
            const html = fs.readFileSync(filePath, 'utf8');
            const content = extractContent(html);

            // Create a slug from the title
            const slug = post.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            const payload = {
                title: post.title,
                slug: slug,
                excerpt: '', // Could extract first paragraph
                content: content,
                thumbnail_url: post.thumbnail, // We'll keep the relative path or update if uploaded to storage
                category: post.category,
                published_at: new Date(post.date).toISOString()
            };

            const { data, error } = await supabase
                .from('posts')
                .insert([payload]) // Changed from upsert to insert to avoid unique constraint error
                .select();

            if (error) {
                console.error(`Error migrating "${post.title}":`, error.message);
            } else {
                console.log(`Successfully migrated: "${post.title}"`);
            }

        } catch (err) {
            console.error(`Failed to process file for "${post.title}":`, err.message);
        }
    }

    console.log('Migration complete.');
};

migrate();
