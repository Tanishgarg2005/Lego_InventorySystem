// frontend/src/components/DashboardStats.jsx

function DashboardStats({ minifigures }) {
  const totalFigures = minifigures.length;
  const totalValue = minifigures.reduce((sum, fig) => sum + (fig.estimatedValue || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-slate-500 text-base font-semibold">Total Minifigures</h2>
        <p className="text-slate-900 text-3xl font-bold">{totalFigures}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-slate-500 text-base font-semibold">Total Collection Value</h2>
        <p className="text-slate-900 text-3xl font-bold">${totalValue.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default DashboardStats;