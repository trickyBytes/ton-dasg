"use client";

import GoogleSignInButton from "./GoogleSignInButton";
import { useAuth } from "./AuthContext";
import Link from "next/link";

export default function Navbar() {
    const { user, loading } = useAuth();

    return (
        <header className="mx-auto max-w-[400px]">
            <nav className="flex items-center justify-between p-4">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5 text-xl font-bold text-gray-800">
                        My App
                    </Link>
                </div>
                <div className="flex items-center gap-x-4">
                    {loading ? (
                        <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200" />
                    ) : user ? (
                        <>
                            <GoogleSignInButton />
                        </>
                    ) : (
                        <GoogleSignInButton />
                    )}
                </div>
            </nav>
        </header>
    );
}