import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qgriwpjsslovkkmnlntg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZnEVeUYjF7ZII5An9ku5rw_1CrNo3Gl';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
