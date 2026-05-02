export default function StatsCards({ youtubeCount, taddyCount, hackerNewsCount }: { youtubeCount: number; taddyCount: number; hackerNewsCount?: number; }) {
    return (
        <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-gray-400 text-sm">Vidéos tendance</p>
                <p className="text-2xl font-bold text-red-400">{youtubeCount}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-gray-400 text-sm">Podcasts populaires</p>
                <p className="text-2xl font-bold text-purple-400">{taddyCount}</p>
            </div>
            {hackerNewsCount !== undefined && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-sm">Articles Hacker News</p>
                    <p className="text-2xl font-bold text-orange-400">{hackerNewsCount}</p>
                </div>
            )}
        </div>
    );
}