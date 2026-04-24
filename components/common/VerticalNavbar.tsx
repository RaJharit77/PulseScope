'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Info, PlayCircle, FlaskConical, LayoutDashboard, LogOut, User, ChevronDown } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

const navItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/about', label: 'À propos', icon: Info },
    { href: '/demo', label: 'Démo', icon: PlayCircle },
    { href: '/test', label: 'Test API', icon: FlaskConical },
];

export default function VerticalNavbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <motion.nav
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-dark/80 backdrop-blur-lg rounded-2xl p-3 border border-white/10 shadow-xl flex flex-col"
        >
            <ul className="flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all group ${isActive ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <item.icon className="w-6 h-6" />
                                <span className="absolute left-full ml-2 px-2 py-1 bg-dark/90 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                                    {item.label}
                                </span>
                            </Link>
                        </li>
                    );
                })}

                {session ? (
                    <>
                        <li>
                            <Link
                                href="/dashboard"
                                className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all group ${pathname === '/dashboard' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <LayoutDashboard className="w-6 h-6" />
                                <span className="absolute left-full ml-2 px-2 py-1 bg-dark/90 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                    Dashboard
                                </span>
                            </Link>
                        </li>
                        <li className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="relative flex items-center justify-center w-12 h-12 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
                            >
                                {session.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt="Avatar"
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <User className="w-6 h-6" />
                                )}
                                <ChevronDown className="w-4 h-4 absolute -bottom-1 -right-1 bg-dark rounded-full p-0.5" />
                                <span className="absolute left-full ml-2 px-2 py-1 bg-dark/90 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                    {session.user?.name || 'Mon compte'}
                                </span>
                            </button>
                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                        className="absolute left-full ml-2 top-0 w-56 bg-dark/95 backdrop-blur-xl rounded-xl border border-white/10 p-3 shadow-xl"
                                    >
                                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                                            {session.user?.image ? (
                                                <Image src={session.user.image} alt="" width={40} height={40} className="rounded-full" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{session.user?.name || 'Utilisateur'}</p>
                                                <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Déconnexion
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link
                            href="/auth/signin"
                            className="relative flex items-center justify-center w-12 h-12 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
                        >
                            <User className="w-6 h-6" />
                            <span className="absolute left-full ml-2 px-2 py-1 bg-dark/90 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                Connexion
                            </span>
                        </Link>
                    </li>
                )}
            </ul>
        </motion.nav>
    );
}