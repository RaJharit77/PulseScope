interface HackerNewsPost {
    objectID: string;
    title: string;
    url?: string;
    points: number;
    num_comments: number;
    author: string;
    created_at: string;
    story_url?: string;
    _tags: string[];
}

interface HackerNewsSearchResponse {
    hits: HackerNewsPost[];
}

export async function searchHackerNews(keyword: string) {
    try {
        const res = await fetch(
            `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(keyword)}&hitsPerPage=10`
        );
        if (!res.ok) {
            console.error('Hacker News API error', res.status, await res.text());
            return [];
        }
        const json: HackerNewsSearchResponse = await res.json();
        return json.hits.map((post) => ({
            id: post.objectID,
            title: post.title,
            url: post.url || post.story_url || `https://news.ycombinator.com/item?id=${post.objectID}`,
            author: post.author,
            points: post.points,
            comments: post.num_comments,
            createdAt: post.created_at,
        }));
    } catch (error) {
        console.error('Hacker News search error:', error);
        return [];
    }
}

export async function getTrendingHackerNews() {
    try {
        const res = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=10');
        if (!res.ok) {
            console.error('Hacker News trending error', res.status, await res.text());
            return [];
        }
        const json: HackerNewsSearchResponse = await res.json();
        return json.hits.map((post) => ({
            id: post.objectID,
            title: post.title,
            url: post.url || post.story_url || `https://news.ycombinator.com/item?id=${post.objectID}`,
            author: post.author,
            points: post.points,
            comments: post.num_comments,
            createdAt: post.created_at,
        }));
    } catch (error) {
        console.error('Hacker News trending error:', error);
        return [];
    }
}