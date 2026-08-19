export default function SortBar({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3">
      <p className="text-sm text-ink/60">
        Showing 1-{count} of {count} products
      </p>
      <label className="flex items-center gap-2 text-sm text-ink/60">
        Sort By
        <select className="rounded-card border border-border bg-white px-2 py-1.5 text-sm text-ink outline-none">
          <option>Popularity</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest</option>
        </select>
      </label>
    </div>
  );
}
