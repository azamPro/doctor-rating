import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;

const supabaseUrl = 'https://aztfnfqnqxmvwfjmrmol.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6dGZuZnFucXhtdndmam1ybW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4MDQ5NzcsImV4cCI6MjAzMzM4MDk3N30.dnkZjZ5YsQ1b031kuwTqKLeykTxASL90Jg8jvPBhAyo'
const supabase = createClient(supabaseUrl, supabaseKey)


export default supabase;
