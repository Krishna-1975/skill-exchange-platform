"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b bg-white/70">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-wide">
          SkillVibe ✨
        </Link>

        <nav className="hidden md:flex gap-17 font-medium">
          <Link href="/skills">Skills</Link>
          <Link href="/sessions">My Sessions</Link>
          <Link href="/profile">Profile</Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md border hover:bg-gray-100"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login">
                <button className="px-4 py-2 rounded-md border hover:bg-gray-100">
                  Log In
                </button>
              </Link>

              <Link href="/register">
                <button className="px-4 py-2 rounded-md bg-black text-white hover:opacity-90">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
