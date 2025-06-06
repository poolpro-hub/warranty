// js/supabaseClient.js
const SUPABASE_URL = 'https://rofpxxoivlaytjyntunm.supabase.co'; // Replace with your actual Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZnB4eG9pdmxheXRqeW50dW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NTY3MTQsImV4cCI6MjA2NDEzMjcxNH0.zTQPegTBkNhQNCYJ5Cl_67GdJSRwqO_KKIRNyk7YT3M'; // Replace with your actual anon key

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
