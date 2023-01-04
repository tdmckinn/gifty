import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Login } from "gifty-components";
import { getUserId } from "~/session.server";
import { createClient, type Session } from "@supabase/supabase-js";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({
    ENV: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_API_KEY: process.env.SUPABASE_API_KEY,
    },
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const data = useLoaderData();
  const supabaseUrl = data.ENV.SUPABASE_URL;
  const supabaseKey = data.ENV.SUPABASE_API_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  if (!supabaseUrl || !supabaseKey) {
    console.log("Missing supabase env vars");
  }

  return <Login supabaseClient={supabase} />;
}
