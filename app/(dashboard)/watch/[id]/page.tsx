import { getVideoDetails, searchYouTube } from "@/services/youtube";
import VideoPlayer from "@/components/videos/VideoPlayer";
import VideoSuggestions from "@/components/videos/VideoSuggestions";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface VideoItem {
    id: string;
    thumbnail: string;
    title: string;
    channelTitle: string;
}

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const video = await getVideoDetails(id);
    const relatedVideos = await searchYouTube(video.snippet.title);

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-7xl mx-auto mb-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Retour à l&apos;accueil</span>
                </Link>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <VideoPlayer videoId={id} />
                    <h1 className="text-2xl font-bold mt-4">{video.snippet.title}</h1>
                    <p className="text-gray-400">{video.snippet.channelTitle}</p>
                    <p className="mt-4">{video.snippet.description}</p>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Suggestions</h2>
                    <div className="space-y-4">
                        {relatedVideos.map((v: VideoItem) => (
                            <Link href={`/watch/${v.id}`} key={v.id} className="flex gap-2">
                                <Image
                                    src={v.thumbnail}
                                    alt={v.title || "Video thumbnail"}
                                    width={160}
                                    height={96}
                                    style={{ objectFit: 'cover' }}
                                    className="rounded"
                                />
                                <div>
                                    <h3 className="font-medium line-clamp-2">{v.title}</h3>
                                    <p className="text-sm text-gray-400">{v.channelTitle}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Tendances générales</h2>
                        <VideoSuggestions />
                    </div>
                </div>
            </div>
        </div>
    );
}