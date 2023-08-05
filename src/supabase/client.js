
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = '';
const algo = '';

const supabase = createClient(SUPABASE_URL, algo);

export { supabase };