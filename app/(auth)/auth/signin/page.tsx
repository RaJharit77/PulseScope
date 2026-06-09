'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, LogIn } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", { email, password, redirect: false });
        if (res?.error) setError("Email ou mot de passe incorrect");
        else window.location.href = "/dashboard";
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative">
            <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 text-gray-400 hover:text-white transition">
                <ArrowLeft className="w-5 h-5" />
                <span>Retour à l&apos;accueil</span>
            </Link>

            <form onSubmit={handleSubmit} className="bg-white/5 p-8 rounded-xl w-96">
                <h1 className="text-2xl font-bold mb-6">Connexion</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="relative mb-4">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 p-3 bg-dark/80 rounded"
                        required
                    />
                </div>

                <div className="relative mb-6">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 p-3 bg-dark/80 rounded"
                        required
                    />
                </div>

                <button type="submit" className="w-full bg-primary p-3 rounded font-semibold flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Se connecter
                </button>

                <button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full mt-4 bg-white text-black p-3 rounded flex items-center justify-center gap-2"
                >
                    <FcGoogle className="w-5 h-5" />
                    Google
                </button>

                <p className="mt-4 text-center">
                    Pas de compte ? <Link href="/auth/signup" className="text-primary">S&apos;inscrire</Link>
                </p>
            </form>
        </div>
    );
}