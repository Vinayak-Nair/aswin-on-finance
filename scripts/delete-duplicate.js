const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dkbbwokogdyulhfxqovs.supabase.co';
const supabaseKey = 'sb_publishable__Am_y-u011lJ5lxBc9VPnQ_wKLPINLk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteDuplicate() {
    console.log('Deleting duplicate post with ID 18...');

    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', 18);

    if (error) {
        console.error('Error deleting post:', error);
    } else {
        console.log('Successfully deleted post with ID 18.');
    }
}

deleteDuplicate();
