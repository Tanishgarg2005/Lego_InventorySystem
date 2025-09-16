function MinifigureCard({ minifigure, onSelect }) {
  return (
    <div
      onClick={() => onSelect(minifigure)}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-xl cursor-pointer"
    >
      <div className="bg-gray-200 h-32 w-full flex items-center justify-center">
        {minifigure.photoFilename ? (
          <img
            src={`http://localhost:8080/uploads/${minifigure.photoFilename}`}
            alt={minifigure.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>
      <div className="p-4">
        <h3
          className="font-bold text-base text-slate-800 truncate"
          title={minifigure.name}
        >
          {minifigure.name}
        </h3>
        <p className="text-sm text-gray-600 truncate">
          {minifigure.theme.name}
        </p>
        <p className="mt-2 font-semibold text-base text-slate-700">
          ${minifigure.estimatedValue || "0.00"}
        </p>
      </div>
    </div>
  );
}

export default MinifigureCard;
