export const FilterList = ({ className }: { className?: string }) => {
  const filters = [
    { name: 'None', id: 'none' },
    { name: 'Vintage', id: 'vintage' },
    { name: 'Blue Tone', id: 'blue' },
    { name: 'Sepia', id: 'sepia' }
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          className="px-4 py-2 bg-gold text-cream rounded-lg hover:bg-gold/80 
                     transition-colors font-body text-sm md:text-base"
        >
          {filter.name}
        </button>
      ))}
    </div>
  );
};
