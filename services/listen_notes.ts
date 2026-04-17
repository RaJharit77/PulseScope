import axios from 'axios'

const LISTEN_NOTES_API_KEY = process.env.NEXT_PUBLIC_LISTEN_NOTES_API_KEY

interface ListenNotesResult {
    id: string
    title_original: string
    description_original: string
    podcast: { title_original: string }
    audio: string
    thumbnail: string
    audio_length_sec: number
    pub_date_ms: number
}

export async function searchPodcasts(keyword: string) {
    try {
        const response = await axios.get(
            'https://listen-api.listennotes.com/api/v2/search',
            {
                headers: {
                    'X-ListenAPI-Key': LISTEN_NOTES_API_KEY
                },
                params: {
                    q: keyword,
                    type: 'episode',
                    language: 'English',
                    len_min: 5,
                    len_max: 120,
                    safe_mode: 0
                }
            }
        )

        return response.data.results.map((item: ListenNotesResult) => ({
            id: item.id,
            title: item.title_original,
            description: item.description_original,
            podcastTitle: item.podcast.title_original,
            audioUrl: item.audio,
            thumbnail: item.thumbnail,
            duration: item.audio_length_sec,
            publishedAt: item.pub_date_ms
        }))
    } catch (error) {
        console.error('Listen Notes API error:', error)
        return []
    }
}

export async function getPopularityTrends() {
    const dates = []
    const podcastData = []

    const today = new Date()
    for (let i = 30; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        dates.push(date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }))

        const baseValue = 50 + Math.sin(i / 5) * 20 + (30 - i) * 2
        podcastData.push(Math.max(5, baseValue + Math.random() * 15))
    }

    return {
        dates,
        datasets: [
            { name: 'Podcasts', data: podcastData, color: '#6C63FF' }
        ]
    }
}