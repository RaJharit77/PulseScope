import { auth } from '@/lib/auth';
import Link from 'next/link';
import ThreeBackground from '@/components/ui/ThreeBackground';
import VideoSuggestions from '@/components/videos/VideoSuggestions';

export default async function HomePage() {
    const session = await auth();

    return (
        <div className="relative min-h-[calc(100vh-12rem)]">
            <ThreeBackground />
            <div className="relative z-10 text-center py-12">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                    PulseScope
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                    Explorez les tendances audio-visuelles en temps réel. YouTube, Spotify, podcasts et bien plus.
                </p>
                {!session && (
                    <Link
                        href="/auth/signin"
                        className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-full transition"
                    >
                        Commencer gratuitement
                    </Link>
                )}
                <div className="mt-16">
                    <h2 className="text-2xl font-semibold mb-6">Tendances du moment</h2>
                    <VideoSuggestions />
                </div>
            </div>
        </div>
    );
}