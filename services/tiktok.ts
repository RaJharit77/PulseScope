interface TikTokVideo {
    video_id: string;
    title: string;
    play_count: number;
    digg_count: number;
    share_count: number;
    comment_count: number;
    author: {
        unique_id: string;
        nickname: string;
    };
    cover: string;
    embed_link: string;
    duration: number;
}

interface TikTokSearchResponse {
    data: TikTokVideo[];
}

const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_TIKTOK_RAPIDAPI_KEY || '';
const RAPIDAPI_HOST = 'tiktok-api23.p.rapidapi.com';

export async function searchTikTok(keyword: string) {
    try {
        const res = await fetch(
            `https://tiktok-api23.p.rapidapi.com/api/search?keyword=${encodeURIComponent(keyword)}&count=10`,
            {
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (!res.ok) {
            const errorText = await res.text();
            console.error('TikTok API error', res.status, errorText);
            // Si l'erreur est 403, on peut afficher un message explicatif
            if (res.status === 403) {
                console.warn("Vérifiez que votre abonnement RapidAPI inclut l'API tiktok-api23.");
            }
            return [];
        }
        const json: TikTokSearchResponse = await res.json();
        return json.data.map((video) => ({
            id: video.video_id,
            title: video.title || 'Sans titre',
            description: video.title,
            thumbnail: video.cover,
            author: video.author.nickname,
            views: video.play_count.toLocaleString(),
            likes: video.digg_count.toLocaleString(),
            shares: video.share_count.toLocaleString(),
            comments: video.comment_count.toLocaleString(),
            embedUrl: video.embed_link,
            duration: video.duration,
        }));
    } catch (error) {
        console.error('TikTok search error:', error);
        return [];
    }
}

export async function getTrendingTikTok() {
    try {
        const res = await fetch(
            `https://tiktok-api23.p.rapidapi.com/api/trending?count=10`,
            {
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST,
                    'Content-Type': 'application/json',
                },
            }
        );
        if (!res.ok) {
            const errorText = await res.text();
            console.error('TikTok trending error', res.status, errorText);
            return [];
        }
        const json = await res.json();
        return json.data.map((video: TikTokVideo) => ({
            id: video.video_id,
            title: video.title || 'Sans titre',
            thumbnail: video.cover,
            author: video.author.nickname,
            views: video.play_count.toLocaleString(),
            embedUrl: video.embed_link,
        }));
    } catch (error) {
        console.error('TikTok trending error:', error);
        return [];
    }
}