export default function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-white/10 rounded"></div>
                        <div className="h-4 bg-white/10 rounded w-5/6"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}