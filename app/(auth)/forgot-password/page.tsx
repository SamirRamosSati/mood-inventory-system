"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to send reset email");
        return;
      }

      setSubmitted(true);
      toast.success("Check your email for the reset link!");
      setEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-row h-screen w-screen bg-white p-0 md:p-7">
        <div className="hidden w-[50vw] h-full bg-[#DFCDC1] md:flex justify-center items-center rounded-none md:rounded-2xl">
          <Image
            src="/images/logo.png"
            width={350}
            height={350}
            alt="Mood Home Interiors Logo"
            priority
          />
        </div>

        <div className="w-full md:w-[50vw] h-full flex flex-col items-center justify-center">
          <div className="w-full px-8 md:w-3/5 md:px-0">
            <h1 className="text-4xl text-black font-bold mb-2">
              Check your email
            </h1>
            <p className="text-gray-400 mb-8">
              We have sent a password reset link to <strong>{email}</strong>
            </p>

            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 mb-8">
              <p className="text-sm text-blue-800">
                The reset link will expire in 24 hours. If you don't see the
                email, check your spam folder.
              </p>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                setEmail("");
              }}
              className="w-full py-3 px-4 bg-[#DFCDC1] text-white font-semibold rounded-xl hover:bg-[#C8A893] transition mb-4"
            >
              Try another email
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-gray-400 hover:text-gray-600 transition"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-screen w-screen bg-white p-0 md:p-7">
      <div className="hidden w-[50vw] h-full bg-[#DFCDC1] md:flex justify-center items-center rounded-none md:rounded-2xl">
        <Image
          src="/images/logo.png"
          width={350}
          height={350}
          alt="Mood Home Interiors Logo"
          priority
        />
      </div>

      <div className="w-full md:w-[50vw] h-full flex flex-col items-center justify-center">
        <div className="w-full px-8 md:w-3/5 md:px-0">
          <h1 className="text-4xl text-black font-bold mb-2">
            Reset your password
          </h1>
          <p className="text-gray-400 mb-8">
            Enter your email address and we will send you a link to reset your
            password.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="relative">
              <input
                type="email"
                id="email"
                className="peer block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent text-gray-900 placeholder-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="Email Address"
                autoComplete="email"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:left-4 peer-focus:text-sm peer-focus:text-[#DFCDC1]"
              >
                Email Address
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#DFCDC1] text-white font-semibold rounded-xl hover:bg-[#C8A893] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-gray-600 transition"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
