"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import toast from "react-hot-toast";
import Image from "next/image";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const success = await login(email, password);

    if (success) {
      toast.success("Login successful!");
    } else {
      toast.error("Invalid credentials");
    }
  };

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
          <h1 className="text-4xl text-black font-bold mb-2">Welcome</h1>
          <p className="text-gray-400 mb-8">Please login here</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#DFCDC1] focus:border-[#DFCDC1] sm:text-sm text-gray-700 placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="mathew.west@ienetworksolutions.com"
                autoComplete="email"
              />
            </div>
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
                disabled={isLoading}
                placeholder="• • • • • • • • • • • • "
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#DFCDC1] focus:ring-[#DFCDC1] border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember Me
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#DFCDC1] hover:bg-[#C9B7A7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DFCDC1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
