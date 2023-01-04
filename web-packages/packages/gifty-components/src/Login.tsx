import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export default function Login({
  supabaseClient,
}: {
  supabaseClient: SupabaseClient<any, "public", any>;
}) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isMagicLinkSent, setMagicLink] = useState(false);
  const [_error, setError] = useState("");
  const [_, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function setupSession() {
      if (!supabaseClient) return;
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) {
        return;
      }

      setSession(data.session);
      supabaseClient.auth.onAuthStateChange((_event, session) => {
        console.log(session);
        setSession(session);
      });
    }

    setupSession();
  }, []);

  const magicLinkAuthentication = async (email: string) => {
    try {
      if (!validateEmail(email)) {
        setError("Email is invalid");
      }

      setLoading(true);
      const { error } = await supabaseClient.auth.signInWithOtp({ email });

      if (error) throw error;
      setMagicLink(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      {/*
      This example requires updating your template:

      ```
      <html class="h-full bg-gray-50">
      <body class="h-full">
      ```
    */}
      <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="w-auto h-12 mx-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=emerald&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
            Sign in to your <span className="font-bold text-emerald-800"> Gifty</span> account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
            <div className="w-full max-w-md px-8 mx-auto">
              {isMagicLinkSent ? (
                <div>
                  Magic link sent check your email! You can close this tab at
                  anytime
                </div>
              ) : (
                <form method="post" className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Enter your email to sign in via magic link
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        required
                        autoFocus={true}
                        name="email"
                        type="email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        aria-describedby="email-error"
                        className="w-full px-2 py-1 text-lg border border-gray-500 rounded"
                      />
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      magicLinkAuthentication(email);
                    }}
                    disabled={loading}
                    className="w-full px-4 py-2 text-white rounded bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-400"
                  >
                    {loading ? (
                      <span>Loading</span>
                    ) : (
                      <span>Send my magic link</span>
                    )}
                  </button>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="w-4 h-4 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <label
                        htmlFor="remember"
                        className="block ml-2 text-sm text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm text-center text-gray-500">
                      Don't have an account?{" "}
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
