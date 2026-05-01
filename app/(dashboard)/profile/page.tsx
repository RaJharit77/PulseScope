import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { CalendarDays, Mail, ShieldCheck, ShieldAlert, User } from 'lucide-react';

export default async function ProfilePage() {
    const session = await auth();
    if (!session || !session.user?.email) {
        redirect('/auth/signin');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            name: true,
            email: true,
            image: true,
            createdAt: true,
            emailVerified: true,
        },
    });

    if (!user) {
        redirect('/auth/signin');
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">Mon profil</h1>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    <div className="relative">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name || 'Avatar'}
                                width={96}
                                height={96}
                                className="rounded-full ring-2 ring-primary"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="w-12 h-12 text-primary" />
                            </div>
                        )}
                    </div>

                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-semibold">{user.name || 'Utilisateur PulseScope'}</h2>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <InfoRow
                        icon={<Mail className="w-5 h-5" />}
                        label="Email"
                        value={user.email}
                    />
                    <InfoRow
                        icon={<CalendarDays className="w-5 h-5" />}
                        label="Membre depuis"
                        value={new Date(user.createdAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    />
                    <InfoRow
                        icon={
                            user.emailVerified ? (
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            ) : (
                                <ShieldAlert className="w-5 h-5 text-yellow-400" />
                            )
                        }
                        label="Statut de l'email"
                        value={
                            user.emailVerified
                                ? 'Vérifié'
                                : 'Non vérifié'
                        }
                    />
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-sm text-gray-500">
                        Les informations de votre compte sont gérées via votre fournisseur d’authentification.
                        La modification du profil n’est pas encore disponible.
                    </p>
                </div>
            </div>
        </div>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
            <div className="mt-0.5 text-gray-400">{icon}</div>
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}