const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dkbbwokogdyulhfxqovs.supabase.co';
const supabaseKey = 'sb_publishable__Am_y-u011lJ5lxBc9VPnQ_wKLPINLk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
    console.log('Checking for duplicate posts...');

    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, slug, created_at');

    if (error) {
        console.error('Error fetching posts:', error);
        return;
    }

    console.log(`Found ${posts.length} posts.`);

    const slugCounts = {};
    posts.forEach(post => {
        slugCounts[post.slug] = (slugCounts[post.slug] || 0) + 1;
    });

    const duplicates = Object.entries(slugCounts).filter(([slug, count]) => count > 1);

    if (duplicates.length === 0) {
        console.log('No duplicates found.');
    } else {
        console.log('Duplicates found:');
        duplicates.forEach(([slug, count]) => {
            console.log(`- Slug "${slug}" appears ${count} times.`);
            const duplicatePosts = posts.filter(p => p.slug === slug);
            duplicatePosts.forEach(p => console.log(`  ID: ${p.id}, Created At: ${p.created_at}`));
        });
    }
}

checkDuplicates();
