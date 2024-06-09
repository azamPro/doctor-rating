import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// const supabaseUrl = 'https://aztfnfqnqxmvwfjmrmol.supabase.co'
// const supabaseKey = ''
const supabase = createClient(supabaseUrl, supabaseKey)


export default supabase;
