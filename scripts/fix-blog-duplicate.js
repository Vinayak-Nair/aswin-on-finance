const supabaseUrl = 'https://dkbbwokogdyulhfxqovs.supabase.co';
const supabaseKey = 'sb_publishable__Am_y-u011lJ5lxBc9VPnQ_wKLPINLk';

async function fixBlogAndRemoveDuplicate() {
    console.log('1. Updating blog title for ID 19...');

    // Update the title for the newer entry (ID 19)
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/posts?id=eq.19`, {
        method: 'PATCH',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
            title: 'Budget 2026: What Actually Changed for NRIs'
        })
    });

    if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('Failed to update title:', errorText);
        return;
    }
    console.log('✓ Title updated successfully!');

    console.log('2. Deleting duplicate entry ID 18...');

    // Delete the older duplicate (ID 18)
    const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/posts?id=eq.18`, {
        method: 'DELETE',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });

    if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text();
        console.error('Failed to delete duplicate:', errorText);
        console.log('Note: RLS policies may prevent deletion. The frontend will still handle it gracefully.');
        return;
    }
    console.log('✓ Duplicate entry deleted successfully!');

    console.log('\nAll done! Refresh your site to see the changes.');
}

fixBlogAndRemoveDuplicate();
