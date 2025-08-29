import axios from 'axios';

function MinifigureDetailModal({ minifigure, onClose, onRefresh, onEdit }) {
  if (!minifigure) return null;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${minifigure.name}? This cannot be undone.`)) {
      axios.delete(`http://localhost:8080/api/minifigures/${minifigure.id}`)
        .then(() => {
          onRefresh();
          onClose();
        })
        .catch(error => console.error("There was an error deleting the minifigure!", error));
    }
  };

  const renderDetail = (label, value, isCurrency = false) => (
    <div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="text-lg text-slate-800">
        {value ? (isCurrency ? `$${value}` : value) : <span className="text-slate-400">N/A</span>}
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold text-slate-800">{minifigure.name}</h2>
          <button onClick={onClose} className="text-2xl font-bold text-slate-500 hover:text-slate-800">&times;</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-gray-200 h-64 w-full rounded-lg flex items-center justify-center">
              {minifigure.photoFilename ? (
                <img src={`http://localhost:8080/uploads/${minifigure.photoFilename}`} alt={minifigure.name} className="h-full w-full object-contain" />
              ) : ( <span className="text-gray-400">No Image</span> )}
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-x-8 gap-y-4">
            {renderDetail("Personal Number", minifigure.personalNumber)}
            {renderDetail("Theme", minifigure.theme?.name)}
            
            {/* --- NEW QUANTITY FIELD --- */}
            {renderDetail("Quantity", minifigure.quantity)}
            
            {renderDetail("BrickLink Number", minifigure.bricklinkNumber)}
            {renderDetail("Release Date", minifigure.releaseDate)}
            {renderDetail("Estimated Value", minifigure.estimatedValue, true)}
            {renderDetail("Purchase Price", minifigure.purchasePrice, true)}
            {renderDetail("Shipping Cost", minifigure.shippingCost, true)}
            {renderDetail("Purchase Date", minifigure.purchaseDate)}
          </div>
        </div>
        
        <div className="mt-6">
           <p className="text-sm font-semibold text-slate-500">Notes</p>
           <p className="text-md text-slate-700 mt-1 p-3 bg-slate-50 rounded-md min-h-[50px]">
             {minifigure.notes || <span className="text-slate-400">No notes provided.</span>}
           </p>
        </div>
        
        <div className="mt-8 flex justify-end gap-4 border-t pt-6">
            <button onClick={() => onEdit(minifigure)} className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg">Edit</button>
            <button onClick={handleDelete} className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg">Delete</button>
            <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-slate-800 font-bold py-2 px-4 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
}

export default MinifigureDetailModal;