import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

import { getUserId, createUserSession } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  // check it user is already logged in
  // const userId = await getUserId(request);
  // if (userId) return redirect("/sigin-redirect");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  console.log(request.url);
  const redirectTo = formData.get("redirectTo") as string;

  // console.log("redirectTo => ", redirectTo);
  // console.log("access_token => ", formData.get("access_token"));

  request.headers.set("Authorization", `Bearer ${formData.get("access_token")}`);
  if (redirectTo)
    return redirect(redirectTo, {
      headers: new Headers({
        Authorization: `Bearer ${formData.get("access_token")}`,
      }),
    });
}

export default function SiginRedirect() {
  const [params, setParams] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const formRef = useRef(null);

  useEffect(() => {
    var hash = location.hash.replace("#", "");
    var params = new URLSearchParams(hash);

    for (const p of params) {
      const [key, value] = p;
      localStorage.setItem(key, value);
    }
    setAccessToken(params.get("access_token"));
    setParams(`?${hash}`);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("access_token") && params) {
      formRef?.current?.submit();
    }
  }, [params]);

  return (
    <>
      <form
        ref={formRef}
        method="POST"
        className="min-h-full px-4 py-16 bg-white sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8"
      >
        <input type="hidden" name="redirectTo" value={`/${params}`} />
        <input type="hidden" name="access_token" value={accessToken} />
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <p className="text-4xl font-bold tracking-tight text-emerald-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
            </p>
            <div className="flex items-center sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  Wait one moment, redirecting to your dashboard...
                </h1>
                {/* <p className="mt-1 text-base text-gray-500">
                  Please check
                </p> */}
              </div>
            </div>
          </main>
        </div>
      </form>
    </>
  );
}
