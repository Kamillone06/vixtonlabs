/* ============================================================
   PASTE YOUR SUPABASE KEYS HERE.
   You get these from your Supabase project:
   Project Settings -> API -> "Project URL" and "anon public" key.
   This "anon" key is SAFE to put in public front-end code —
   it only allows what your database rules (RLS policies) allow.
   ============================================================ */
const SUPABASE_URL = "https://YOUR-PROJECT-ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

// Creates the shared client used by content.js on the public site
// and by admin.js in the admin panel.
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
