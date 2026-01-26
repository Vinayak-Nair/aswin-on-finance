
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://dkbbwokogdyulhfxqovs.supabase.co';
const supabaseKey = 'sb_publishable__Am_y-u011lJ5lxBc9VPnQ_wKLPINLk';

export const supabase = createClient(supabaseUrl, supabaseKey);
