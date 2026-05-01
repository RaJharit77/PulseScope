import Link from "next/link";
import { auth } from "@/lib/auth";
import SignOutButton from "../auth/SignOutButton";

export default async function Header() {
    const session = await auth();

    return (
        <header className="sticky top-0 z-20 bg-black/50 backdrop-blur p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">PulseScope</Link>
                <nav className="flex gap-6">
                    <Link href="/about">À propos</Link>
                    <Link href="/test">Essai</Link>
                    {session ? (
                        <>
                            <Link href="/dashboard">Dashboard</Link>
                            <SignOutButton />
                        </>
                    ) : (
                        <Link href="/auth/signin">Connexion</Link>
                    )}
                </nav>
            </div>
        </header>
    );
}