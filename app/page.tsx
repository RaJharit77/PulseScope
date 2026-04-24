import Link from 'next/link';
import ThreeBackground from '@/components/ui/ThreeBackground';
import { auth } from '@/lib/auth';

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
      <ThreeBackground />
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          PulseScope
          <span className="block text-2xl md:text-3xl text-gray-400 mt-2">
            Explorez les tendances audio‑visuelles en temps réel
          </span>
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          YouTube, Spotify, podcasts… PulseScope agrège les données de popularité pour vous offrir une vue
          complète des sujets qui vous passionnent.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {!session ? (
            <>
              <Link
                href="/demo"
                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/80 transition"
              >
                Voir la démo
              </Link>
              <Link
                href="/test"
                className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition"
              >
                Tester les APIs
              </Link>
              <Link
                href="/auth/signin"
                className="px-8 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/80 transition"
              >
                Se connecter
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/80 transition"
            >
              Accéder à mon dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}