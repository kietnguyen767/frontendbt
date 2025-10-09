"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuth({ redirectToLogin = false } = {}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      if (redirectToLogin) router.push("/login");
    }
  }, [redirectToLogin, router]);

  return { isAuthenticated };
}
