function Header({ onAddNew }) {
  return (
    <header className="bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">
          LEGO Minifigure Collection
        </h1>
        <button
          onClick={onAddNew}
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-800 font-bold py-2 px-4 rounded-lg shadow-md transition-transform hover:scale-105"
        >
          + Add Minifigure
        </button>
      </div>
    </header>
  );
}

export default Header;
