type TaddyEpisode = {
    uuid: string;
    name: string;
    description: string;
    audioUrl: string;
    duration: number;
    podcastTitle: string;
    thumbnail: string;
};

type TaddySearchResponse = {
    episodes?: TaddyEpisode[];
    error?: string;
};

export async function searchTaddyPodcasts(keyword: string) {
    try {
        const res = await fetch(`/api/taddy?q=${encodeURIComponent(keyword)}`);
        if (!res.ok) {
            const errorBody = await res.text();
            console.error('Taddy fetch failed', res.status, errorBody);
            return [];
        }
        const json: TaddySearchResponse = await res.json();

        console.log('Taddy processed episodes:', json.episodes?.length || 0);

        return (json.episodes || []).map((ep) => ({
            id: ep.uuid,
            title: ep.name,
            description: ep.description,
            podcastTitle: ep.podcastTitle,
            audioUrl: ep.audioUrl,
            thumbnail: ep.thumbnail,
            duration: ep.duration,
        }));
    } catch (error) {
        console.error('Taddy service error:', error);
        return [];
    }
}