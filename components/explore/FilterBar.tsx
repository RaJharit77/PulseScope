interface FilterBarProps {
    availableFilters: string[];
    activeFilters: string[];
    onFilterChange: (filters: string[]) => void;
}

export default function FilterBar({ availableFilters, activeFilters, onFilterChange }: FilterBarProps) {
    const toggle = (filter: string) => {
        const newList = activeFilters.includes(filter)
            ? activeFilters.filter(f => f !== filter)
            : [...activeFilters, filter];
        onFilterChange(newList);
    };

    return (
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {availableFilters.map(f => (
                <button
                    key={f}
                    onClick={() => toggle(f)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition ${activeFilters.includes(f)
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-500 text-gray-300 hover:border-white'
                        }`}
                >
                    {f === 'youtube' ? 'YouTube' : f === 'taddy' ? 'Podcasts (Taddy)' : f}
                </button>
            ))}
        </div>
    );
}