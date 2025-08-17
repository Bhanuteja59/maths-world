"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function useAuth({ requireLogin = true } = {}) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const newToken = searchParams?.get("token");

    // If token comes from Google OAuth redirect
    if (newToken) {
      localStorage.setItem("jwt", newToken);
      setToken(newToken);
      router.replace("/home");
      return;
    }

    // Check for existing token
    const existingToken = localStorage.getItem("jwt");

    if (!existingToken && requireLogin) {
      router.replace("/registration");
      return;
    }

    setToken(existingToken);
    setLoading(false);
  }, [router, searchParams, requireLogin]);

  return { token, loading };
}
