"use client";

import { useAuth } from "../components/AuthContext";

export default function GoogleSignInButton() {
    const { user, signInWithGoogle, signOutUser } = useAuth();

    if (user) {
        return (
            <button onClick={signOutUser} className="p-2 border rounded">
                Sign Out
            </button>
        );
    }

    return (
        <button onClick={signInWithGoogle} className="p-2 border rounded">
            Sign in with Google
        </button>
    );
}