type PodcastSeries = {
    name: string;
    imageUrl: string;
    episodes: {
        edges: EpisodeEdge[];
    };
};

type EpisodeEdge = {
    node: {
        uuid: string;
        name: string;
        description: string;
        audioUrl: string;
        duration: number;
    };
};

type TaddySearchResponse = {
    data?: {
        search?: {
            podcastSeries?: PodcastSeries[];
        };
    };
};

export async function searchTaddyPodcasts(keyword: string) {
    const res = await fetch(`/api/taddy?q=${encodeURIComponent(keyword)}`);
    const data: TaddySearchResponse = await res.json();
    const series = data.data?.search?.podcastSeries || [];
    return series.flatMap((show: PodcastSeries) =>
        show.episodes.edges.map((edge: EpisodeEdge) => ({
            id: edge.node.uuid,
            title: edge.node.name,
            description: edge.node.description,
            podcastTitle: show.name,
            audioUrl: edge.node.audioUrl,
            thumbnail: show.imageUrl,
            duration: edge.node.duration,
        }))
    );
}