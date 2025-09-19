"use client";

import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth } from "../components/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {user ? <p>Welcome, {user.displayName}!</p> : <p>Please sign in.</p>}
      <div className="mt-4" />
      <GoogleSignInButton />
    </main>
  );
}
