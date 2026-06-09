import { searchYouTube } from "@/services/youtube";
import Link from "next/link";
import Image from "next/image";

export default async function VideoSuggestions() {
    const videos = await searchYouTube("trending");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.slice(0, 8).map((video: { id: string; thumbnail: string; title: string; channelTitle: string }) => (
                <Link href={`/watch/${video.id}`} key={video.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition">
                    <div className="relative w-full aspect-video mb-2">
                        <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg"
                        />
                    </div>
                    <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-400">{video.channelTitle}</p>
                </Link>
            ))}
        </div>
    );
}