function FilterControls({ sortBy, setSortBy, themeFilter, setThemeFilter }) {
  return (
    <div className="bg-white p-3 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-grow w-full">
        <input
          type="text"
          placeholder="Filter by Theme (e.g., Star Wars)"
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex-shrink-0">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Sort by Name</option>
          <option value="valueDesc">Sort by Value (High to Low)</option>
          <option value="valueAsc">Sort by Value (Low to High)</option>
          <option value="dateDesc">Sort by Release Date (Newest First)</option>
          <option value="dateAsc">Sort by Release Date (Oldest First)</option>
        </select>
      </div>
    </div>
  );
}

export default FilterControls;
