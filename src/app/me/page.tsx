"use client";

import { useState } from "react";
import { createJWTToken } from "../actions/auth";

export const dynamic = "force-dynamic";

export default function MePage() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const handleApplyDeepLink = async () => {
    try {
      setLoading(true);
      setError("");
      setStatus("আপনার অ্যাক্সেস যাচাই করা হচ্ছে...");

      const jwt = await createJWTToken();

      setStatus("অ্যাপ চালু করা হচ্ছে...");

      window.location.href = `noorfilter://auth?token=${encodeURIComponent(
        jwt
      )}`;
    } catch (err) {
      console.error(err);
      setError("দুঃখিত! অ্যাপে প্রবেশ করা যায়নি। আবার চেষ্টা করুন।");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          আপনার সদস্যপদ
        </h1>

        <div className="my-6 rounded-xl bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            বর্তমান পরিকল্পনা: <strong>Premium</strong>
          </p>

          <p className="mt-2 text-sm text-blue-800">
            অ্যাক্সেস মেয়াদ: <strong>৩১ ডিসেম্বর, ২০২৬</strong>
          </p>
        </div>

        <p className="mb-6 text-center text-sm text-gray-600">
          আপনার পেমেন্ট বা সাবস্ক্রিপশন আপডেট হয়ে থাকলে নিচের বাটনে ক্লিক
          করে অ্যাক্সেস যাচাই করুন।
        </p>

        {status && (
          <div className="mb-4 rounded-lg bg-blue-100 p-3 text-sm text-blue-700">
            {status}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={handleApplyDeepLink}
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <svg
                className="mr-2 h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-20"
                />
                <path
                  fill="currentColor"
                  d="M22 12a10 10 0 00-10-10v4a6 6 0 016 6h4z"
                />
              </svg>

              যাচাই করা হচ্ছে...
            </>
          ) : (
            "অ্যাক্সেস যাচাই করে অ্যাপে ফিরুন"
          )}
        </button>
      </div>
    </div>
  );
}