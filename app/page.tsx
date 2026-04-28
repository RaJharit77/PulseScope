import Link from 'next/link';
import ThreeBackground from '@/components/ui/ThreeBackground';
import { auth } from '@/lib/auth';

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <ThreeBackground />
      <div className="relative z-10 max-w-4xl animate-fade-in-up">
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-4">
          <span className="inline-block bg-gradient-to-r from-primary via-purple-400 to-secondary text-6xl md:text-8xl bg-clip-text text-transparent animate-gradient-x">
            PulseScope
          </span>
        </h1>

        <p className="text-xl md:text-3xl text-gray-300 font-light mb-6 tracking-wide">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Explorez les tendances audio‑visuelles en temps réel
          </span>
        </p>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          YouTube, podcasts et bien plus. PulseScope analyse les données de popularité pour vous offrir une vision claire des sujets qui captivent le monde.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          {!session ? (
            <>
              <Link
                href="/demo"
                className="group relative px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/20 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(255,51,102,0.3)]"
              >
                <span className="relative z-10">Voir la démo</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="/test"
                className="group relative px-8 py-3.5 bg-primary text-white font-semibold rounded-xl transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(255,51,102,0.5)]"
              >
                Tester les APIs
              </Link>
              <Link
                href="/auth/signin"
                className="group relative px-8 py-3.5 bg-secondary text-white font-semibold rounded-xl transition-all duration-300 hover:bg-secondary/90 hover:shadow-[0_0_25px_rgba(108,99,255,0.5)]"
              >
                Se connecter
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="group relative px-8 py-3.5 bg-primary text-white font-semibold rounded-xl transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(255,51,102,0.5)]"
            >
              Accéder à mon dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="absolute inset-0 -z-5 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float-delayed" />
      </div>
    </div>
  );
}