'use client';

export default function VideoPlayer({ videoId }: { videoId: string }) {
    return (
        <div className="relative pt-[56.25%]">
            <iframe
                title="YouTube video player"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                className="absolute inset-0 w-full h-full rounded-xl"
                allowFullScreen
            />
        </div>
    );
}