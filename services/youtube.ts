import axios from 'axios';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

type YouTubeSearchItem = {
    id: { videoId: string };
    snippet: {
        title: string;
        description: string;
        thumbnails: { medium: { url: string } };
        channelTitle: string;
        publishedAt: string;
    };
};

type YouTubeVideoStatsItem = {
    id: string;
    statistics: Record<string, unknown>;
};

export async function searchYouTube(keyword: string) {
    try {
        const response = await axios.get(
            'https://www.googleapis.com/youtube/v3/search',
            {
                params: {
                    part: 'snippet',
                    maxResults: 20,
                    q: keyword,
                    type: 'video',
                    key: YOUTUBE_API_KEY
                }
            }
        )

        const videoIds = response.data.items.map((item: YouTubeSearchItem) => item.id.videoId).join(',')

        const statsResponse = await axios.get(
            'https://www.googleapis.com/youtube/v3/videos',
            {
                params: {
                    part: 'statistics',
                    id: videoIds,
                    key: YOUTUBE_API_KEY
                }
            }
        )

        const statsMap = new Map(
            statsResponse.data.items.map((item: YouTubeVideoStatsItem) => [item.id, item.statistics])
        )

        return response.data.items.map((item: YouTubeSearchItem) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            statistics: statsMap.get(item.id.videoId) || {},
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }))
    } catch (error) {
        console.error('YouTube API error:', error)
        return []
    }
}

export async function getPopularityTrends(keyword: string) {
    const dates = []
    const youtubeData = []
    const trendName = keyword ? `YouTube (${keyword})` : 'YouTube'

    const today = new Date()
    for (let i = 30; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        dates.push(date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }))

        const baseValue = 50 + Math.sin(i / 5) * 20 + (30 - i) * 2
        youtubeData.push(Math.max(15, baseValue + Math.random() * 30))
    }

    return {
        dates,
        datasets: [
            { name: trendName, data: youtubeData, color: '#FF0000' }
        ]
    }
}

export async function getVideoDetails(videoId: string) {
    if (!videoId) throw new Error("videoId is required");
    try {
        const res = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: { part: "snippet,statistics", id: videoId, key: YOUTUBE_API_KEY },
        });
        if (!res.data.items || res.data.items.length === 0) {
            throw new Error("Video not found");
        }
        return res.data.items[0];
    } catch (error) {
        console.error('YouTube API error:', error);
        throw error;
    }
}