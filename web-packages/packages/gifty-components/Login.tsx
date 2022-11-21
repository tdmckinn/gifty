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
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              start your 14-day free trial
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="mx-auto w-full max-w-md px-8">
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
                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                      />
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      magicLinkAuthentication(email);
                    }}
                    disabled={loading}
                    className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
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
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="remember"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="text-center text-sm text-gray-500">
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
