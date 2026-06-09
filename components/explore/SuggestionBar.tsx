export default function SuggestionBar({
    suggestions,
    onSelect,
}: {
    suggestions: string[];
    onSelect: (s: string) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {suggestions.map(s => (
                <button
                    key={s}
                    onClick={() => onSelect(s)}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-sm border border-white/10 transition"
                >
                    {s}
                </button>
            ))}
        </div>
    );
}