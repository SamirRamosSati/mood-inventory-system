"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

export default function SetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [valid, setValid] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(
          `/api/staff/validate-token?token=${token}`
        );
        const data = await response.json();

        if (data.valid) {
          setValid(true);
          setUserName(data.name);
          setUserEmail(data.email);
        } else {
          setError(data.error || "Invalid or expired invite link");
        }
      } catch {
        setError("Failed to validate invite");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setError("Invalid invite link");
      setLoading(false);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/staff/complete-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Account created successfully!");
        router.push("/login");
      } else {
        toast.error(data.error || "Failed to create account");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p className="text-gray-500">Validating invite...</p>
      </div>
    );
  }

  if (error || !valid) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="text-[#DFCDC1] hover:text-[#C8A893] font-medium"
          >
            Go to login
          </button>
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
            Set Your Password
          </h1>
          <p className="text-gray-400 mb-2">Welcome, {userName}!</p>
          <p className="text-gray-400 mb-8 text-sm">{userEmail}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#DFCDC1] focus:border-[#DFCDC1] sm:text-sm text-gray-700 placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                placeholder="Enter your password"
                minLength={8}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#DFCDC1] focus:border-[#DFCDC1] sm:text-sm text-gray-700 placeholder-gray-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
                placeholder="Confirm your password"
                minLength={8}
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 mt-2 text-white bg-[#DFCDC1] hover:bg-[#C8A893] rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-[#DFCDC1] hover:text-[#C8A893] font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
