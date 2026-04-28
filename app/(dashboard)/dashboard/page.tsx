import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getYouTubeTrending, getTaddyTrendingPodcasts } from '@/services/trending';
import StatsCards from '@/components/dashboard/StatsCards';
import TrendingSection from '@/components/dashboard/TrendingSection';

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect('/auth/signin');

    const [youtubeVideos, taddyPodcasts] = await Promise.all([
        getYouTubeTrending(5),
        getTaddyTrendingPodcasts(),
    ]);

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
            <StatsCards
                youtubeCount={youtubeVideos.length}
                taddyCount={taddyPodcasts.length}
            />
            <div className="mt-10">
                <TrendingSection
                    youtubeVideos={youtubeVideos}
                    taddyPodcasts={taddyPodcasts}
                />
            </div>
        </div>
    );
}