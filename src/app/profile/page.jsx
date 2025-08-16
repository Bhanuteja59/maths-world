"use client";

// frontend/src/app/profile/page.jsx
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProfilePage() {
  const router = useRouter();
  const params = useSearchParams();
  const [user, setUser] = useState(null);

  // If redirected from Google, capture token from query and persist it
  useEffect(() => {
    const tokenFromQuery = params.get("token");
    if (tokenFromQuery) {
      localStorage.setItem("jwt", tokenFromQuery);
      // Clean URL
      router.replace("/profile");
    }
  }, [params, router]);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

    if (!token) {
      router.push("/registration");
      return;
    }

    let cancelled = false;

    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!cancelled) {
          if (data?.success && data?.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem("jwt");
            router.push("/registration");
          }
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem("jwt");
          router.push("/registration");
        }
      }
    }

    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!user) return null; // show /profile/loading.jsx

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Your Profile</h1>

        <div className="space-y-4">
          <div>
            <p className="text-gray-500 text-sm">Username</p>
            <p className="text-lg font-medium">{user.username}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Score</p>
            <p className="text-lg font-medium">{user.score ?? 0}</p>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("jwt");
            router.push("/registration");
          }}
          className="w-full mt-6 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
