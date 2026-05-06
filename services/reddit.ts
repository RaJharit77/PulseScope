import axios from 'axios'

const REDDIT_CLIENT_ID = process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID
const REDDIT_CLIENT_SECRET = process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET


interface RedditChildData {
    id: string
    title: string
    subreddit_name_prefixed: string
    score: number
    num_comments: number
    permalink: string
    created_utc: number
}

interface RedditChild {
    data: RedditChildData
}


let redditAccessToken: string | null = null

async function getRedditAccessToken() {
    if (redditAccessToken) return redditAccessToken

    const auth = btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`)
    const response = await axios.post(
        'https://www.reddit.com/api/v1/access_token',
        'grant_type=client_credentials',
        {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    )

    redditAccessToken = response.data.access_token
    return redditAccessToken
}

export async function searchReddit(keyword: string) {
    try {
        const token = await getRedditAccessToken()
        const response = await axios.get(
            `https://oauth.reddit.com/search?q=${encodeURIComponent(keyword)}&limit=20&sort=hot`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'User-Agent': 'PulseScope/1.0'
                }
            }
        )

        return response.data.data.children.map((child: RedditChild) => ({
            id: child.data.id,
            title: child.data.title,
            subreddit: child.data.subreddit_name_prefixed,
            score: child.data.score,
            num_comments: child.data.num_comments,
            url: `https://reddit.com${child.data.permalink}`,
            created: child.data.created_utc
        }))
    } catch (error) {
        console.error('Reddit API error:', error)
        return []
    }
}

export async function getPopularityTrends(keyword: string) {
    const dates = []
    const redditData = []

    // Use keyword to seed the data generation for variety
    const keywordHash = keyword.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    const today = new Date()
    for (let i = 30; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        dates.push(date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }))

        const baseValue = 50 + Math.sin(i / 5) * 20 + (30 - i) * 2 + (keywordHash % 30)
        redditData.push(Math.max(10, baseValue + Math.random() * 20))
    }

    return {
        dates,
        datasets: [
            { name: 'Reddit', data: redditData, color: '#FF4500' },
        ]
    }
}