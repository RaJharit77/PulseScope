const TADDY_API_URL = 'https://api.taddy.org/graphql';

export async function searchTaddyPodcasts(keyword: string) {
    try {
        const response = await fetch(TADDY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': process.env.TADDY_API_KEY!,
                'X-USER-ID': process.env.TADDY_USER_ID!,
            },
            body: JSON.stringify({
                query: `
          query SearchPodcasts($term: String!) {
            search(term: $term, first: 20) {
              podcastSeries {
                uuid
                name
                description
                imageUrl
                episodes(first: 5) {
                  edges {
                    node {
                      uuid
                      name
                      description
                      audioUrl
                      duration
                    }
                  }
                }
              }
            }
          }
        `,
                variables: { term: keyword },
            }),
        });

        const data = await response.json();
        const series = data.data?.search?.podcastSeries || [];

        return series.flatMap((show: any) =>
            show.episodes.edges.map((edge: any) => ({
                id: edge.node.uuid,
                title: edge.node.name,
                description: edge.node.description,
                podcastTitle: show.name,
                audioUrl: edge.node.audioUrl,
                thumbnail: show.imageUrl,
                duration: edge.node.duration,
            }))
        );
    } catch (error) {
        console.error('Taddy API error:', error);
        return [];
    }
}