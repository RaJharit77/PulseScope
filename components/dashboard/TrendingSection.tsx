import YouTubeFeed from '@/components/feeds/YouTubeFeed';
import TaddyPodcastFeed from '@/components/feeds/TaddyPodcastFeed';

interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    url: string;
    channelTitle: string;
    publishedAt: string;
    statistics: {
        viewCount: string;
        likeCount: string;
        commentCount: string;
    };
}

interface TaddyPodcastEpisode {
    id: string;
    title: string;
    description: string;
    url: string;
    podcastTitle: string;
    audioUrl: string;
    thumbnail: string;
    duration: number;
}

export default function TrendingSection({
    youtubeVideos,
    taddyPodcasts,
}: {
    youtubeVideos: YouTubeVideo[];
    taddyPodcasts: TaddyPodcastEpisode[];
}) {
    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-semibold mb-4 text-red-400">YouTube</h2>
                <YouTubeFeed videos={youtubeVideos} />
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Podcasts</h2>
                <TaddyPodcastFeed episodes={taddyPodcasts} />
            </div>
        </div>
    );
}