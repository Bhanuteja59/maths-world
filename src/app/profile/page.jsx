"use client";

// frontend/src/app/profile/page.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Loading from "../loading";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProfilePage() {
  const router = useRouter();
  const { token, loading } = useAuth({ requireLogin: true });
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

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
  }, [token, router]);

  if (loading || !user) return <Loading message="Loading Profile..." />;

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
