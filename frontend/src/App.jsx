import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import MinifigureCard from './components/MinifigureCard';
import AddMinifigureForm from './components/AddMinifigureForm';
import MinifigureDetailModal from './components/MinifigureDetailModal';
import DashboardStats from './components/DashboardStats';
import FilterControls from './components/FilterControls';

function App() {
  const [minifigures, setMinifigures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMinifigure, setSelectedMinifigure] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [themeFilter, setThemeFilter] = useState('');
  const [editingMinifigure, setEditingMinifigure] = useState(null);

  const fetchMinifigures = useCallback(() => {
    const params = new URLSearchParams({
      sortBy: sortBy,
      theme: themeFilter
    }).toString();
    
    axios.get(`http://localhost:8080/api/minifigures?${params}`)
      .then(response => setMinifigures(response.data))
      .catch(error => console.error('There was an error fetching the minifigures!', error));
  }, [sortBy, themeFilter]);

  useEffect(() => {
    fetchMinifigures();
  }, [fetchMinifigures]);

  const handleEdit = (minifigure) => {
    setSelectedMinifigure(null);
    setEditingMinifigure(minifigure);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMinifigure(null);
    fetchMinifigures();
  };

  const handleAddNew = () => {
    setEditingMinifigure(null);
    setShowForm(true);
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans">
      <Header onAddNew={handleAddNew} />
      
      {showForm && 
        <AddMinifigureForm 
          minifigureToEdit={editingMinifigure}
          onFormSubmit={handleFormClose} 
          onCancel={handleFormClose}
        />
      }
      
      <MinifigureDetailModal 
        minifigure={selectedMinifigure} 
        onClose={() => setSelectedMinifigure(null)} 
        onRefresh={fetchMinifigures}
        onEdit={handleEdit} 
      />

      <main className="container mx-auto px-4 py-8">
        <DashboardStats minifigures={minifigures} />
        <FilterControls 
          sortBy={sortBy} 
          setSortBy={setSortBy} 
          themeFilter={themeFilter} 
          setThemeFilter={setThemeFilter} 
        />
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {minifigures.map(fig => (
            <MinifigureCard 
              key={fig.id} 
              minifigure={fig} 
              onSelect={setSelectedMinifigure} 
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;