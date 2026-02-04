"use client";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function Navbar() {
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


    <nav className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <h1 className="text-2xl font-bold tracking-wide">SkillVibe ✨</h1>
      <div className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg text-white">
 
  <Link href="/skills">Skills</Link>
  <Link href="/sessions">Sessions</Link>
  <Link href="/profile">Profile</Link>
</div>

<div className="flex items-center gap-4">
  {user ? (
    <button
      onClick={handleLogout}
      className="bg-white text-black px-3 py-1 rounded-md hover:opacity-80"
    >
      Logout
    </button>
  ) : (
    <>
      <Link href="/login">
        <button className="bg-white text-black px-3 py-1 rounded-md hover:opacity-80">
          Login
        </button>
      </Link>

      <Link href="/register">
        <button className="bg-black text-white px-3 py-1 rounded-md hover:opacity-80">
          Sign Up
        </button>
      </Link>
    </>
  )}
</div>

    </nav>
  );
}
