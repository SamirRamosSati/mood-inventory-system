"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import Card from "@/components/Card";
import { getAvatarInitials } from "@/lib/avatarUtils";
import toast from "react-hot-toast";

const AVATAR_COLORS = [
  {
    name: "Blue & Purple",
    class: "bg-gradient-to-br from-blue-500 to-purple-600",
  },
  { name: "Pink & Rose", class: "bg-gradient-to-br from-pink-500 to-rose-600" },
  {
    name: "Green & Emerald",
    class: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
  {
    name: "Yellow & Orange",
    class: "bg-gradient-to-br from-yellow-500 to-orange-600",
  },
  {
    name: "Indigo & Blue",
    class: "bg-gradient-to-br from-indigo-500 to-blue-600",
  },
  {
    name: "Purple & Pink",
    class: "bg-gradient-to-br from-purple-500 to-pink-600",
  },
  { name: "Teal & Cyan", class: "bg-gradient-to-br from-teal-500 to-cyan-600" },
  { name: "Red & Pink", class: "bg-gradient-to-br from-red-500 to-pink-600" },
];

export default function AccountPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setSelectedColor(user.avatar_color || AVATAR_COLORS[0].class);
    }
  }, [user]);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          avatarColor: selectedColor,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Profile updated successfully!");
        await refreshUser();
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 space-y-6 flex flex-col h-full overflow-hidden">
      <Card>
        <div className="p-6 space-y-6 overflow-y-auto max-h-full">
          {/* Header */}
          <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
            <div
              className={`w-24 h-24 rounded-full ${selectedColor} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}
            >
              {getAvatarInitials(name || user.name || "")}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                {user.role?.toString().toLowerCase() === "admin"
                  ? "Administrator"
                  : "Staff Member"}
              </p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border text-gray-500 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent outline-none transition"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-500 focus:ring-2 focus:ring-[#DFCDC1] focus:border-transparent outline-none transition"
                placeholder="Enter your email"
              />
            </div>

            {/* Avatar Color Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Color
              </label>
              <div className="grid grid-cols-4 gap-3">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color.class}
                    type="button"
                    onClick={() => setSelectedColor(color.class)}
                    className={`relative h-16 rounded-xl ${
                      color.class
                    } transition-all hover:scale-105 ${
                      selectedColor === color.class
                        ? "ring-4 ring-offset-2 ring-gray-400"
                        : "ring-2 ring-gray-200"
                    }`}
                    title={color.name}
                  >
                    {selectedColor === color.class && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white drop-shadow-lg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Select a color gradient for your profile avatar
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setName(user.name || "");
                setEmail(user.email || "");
                setSelectedColor(user.avatar_color || AVATAR_COLORS[0].class);
              }}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium text-white bg-[#DFCDC1] rounded-xl hover:bg-[#C8A893] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
