import { createClient, type Session } from "@supabase/supabase-js";

import { Login } from "gifty-components";

export default function LoginPage() {
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  if (!supabaseUrl || !supabaseKey) {
    console.log("Missing supabase env vars");
  }

  return <Login supabaseClient={supabase} />;
}
