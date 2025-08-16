"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdEmail, MdStar, MdLeaderboard, MdCheckCircle } from "react-icons/md";
import { IoMdLogOut, IoMdTrophy } from "react-icons/io";

/**
 * Hook: Animate numbers smoothly
 */
function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(duration / (target || 1));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/**
 * Profile Card UI
 */
const ProfileCard = ({ username, email, score, stats, onEdit, onLogout }) => {
  const animatedScore = useCountUp(score ?? 0, 1200);
  const animatedAchievements = useCountUp(stats.achievements ?? 0, 1200);
  const animatedRank = useCountUp(parseInt(stats.rank) || 0, 1200);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-2xl mx-auto transform transition-all hover:scale-[1.01] 
      animate-fade-slide"
    >
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-center">
        <h1 className="text-4xl font-bold text-white animate-fade-in-delay-1">{username}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center animate-fade-in-delay-3">
          <IoMdTrophy className="mx-auto text-yellow-500 w-8 h-8 mb-1" />
          <p className="text-xl font-bold">{animatedAchievements}</p>
          <p className="text-sm text-gray-500">Achievements</p>
        </div>
        <div className="text-center animate-fade-in-delay-4">
          <MdLeaderboard className="mx-auto text-blue-500 w-8 h-8 mb-1" />
          <p className="text-xl font-bold">#{animatedRank}</p>
          <p className="text-sm text-gray-500">Rank</p>
        </div>
        <div className="hidden sm:block text-center animate-fade-in-delay-5">
          <MdCheckCircle className="mx-auto text-green-500 w-8 h-8 mb-1" />
          <p className="text-xl font-bold">Active</p>
          <p className="text-sm text-gray-500">Status</p>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-3 text-gray-700 dark:text-gray-300 animate-fade-in-delay-6">
          <MdEmail className="w-6 h-6 text-indigo-500" />
          <span className="text-lg break-words">{email}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onEdit}
            className="flex-1 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition animate-fade-in-delay-7"
          >
            Edit Profile
          </button>
          <button
            onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition animate-fade-in-delay-8"
          >
            <IoMdLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Profile Page
 */
export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const didInit = useRef(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("jwt", tokenFromUrl);
      router.replace("/profile");
      return;
    }

    const token = localStorage.getItem("jwt");
    if (!token) {
      router.replace("/registration");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem("jwt");
          router.replace("/registration");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        localStorage.removeItem("jwt");
        router.replace("/registration");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    router.push("/");
  };

  const handleEdit = () => {
    alert("The WebPage under working ............. ")
    // router.push("/edit-profile");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <ProfileCard
        username={user.username}
        email={user.email}
        score={user.score}
        stats={{
          achievements: user.achievements ?? 0,
          rank: user.rank ?? 0,
        }}
        onEdit={handleEdit}
        onLogout={handleLogout}
      />
    </div>
  );
}