"use client";

import { useAuth } from "../components/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-24 text-center">
      <h1 className="text-4xl font-bold mb-4">A Great App</h1>
      {user ? <p>You are now signed in and can see this amazing content.</p> : <p>Please sign in to see the amazing content.</p>}
    </div>
  );
}
