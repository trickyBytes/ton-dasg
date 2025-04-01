"use client";
import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.config"; // or "@/firebase.config" if you moved the file

export default function GoogleSignInButton() {
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        setError(null);
        const provider = new GoogleAuthProvider();

        try {
            await signInWithPopup(auth, provider);
            // User signed in with Google!
            console.log("User signed in with Google!");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
            console.error("Error signing in with Google:", err);
        }
    };

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>
        </div>
    );
}