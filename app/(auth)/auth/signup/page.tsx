'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        if (res.ok) router.push("/auth/signin");
        else setError("Erreur lors de l'inscription");
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white/5 p-8 rounded-xl w-96">
                <h1 className="text-2xl font-bold mb-6">Inscription</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 mb-4 bg-dark/80 rounded" required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-dark/80 rounded" required />
                <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-6 bg-dark/80 rounded" required />
                <button type="submit" className="w-full bg-primary p-3 rounded font-semibold">S&apos;inscrire</button>
                <p className="mt-4 text-center">Déjà un compte ? <Link href="/auth/signin" className="text-primary">Se connecter</Link></p>
            </form>
        </div>
    );
}