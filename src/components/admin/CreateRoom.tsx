"use client"
import React, { useState } from 'react';

enum Size {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE"
}

const CreateRoom = () => {
  const [name, setName] = useState('');
  const [size, setSize] = useState<Size>(Size.MEDIUM); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, size }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Une erreur est survenue');
      }
      
      const data = await response.json();
      console.log('Room creation:', data);
      setName('');
      setSize(Size.MEDIUM);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la salle.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto dark:bg-[#252530] bg-background   border-2 border-black  dark:border-white rounded-lg shadow-md shadow-md p-6">
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="flex size-14 items-center justify-center rounded-full border">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center">Créer une salle</h2>
        <p className="text-sm text-center">Ajoutez une nouvelle salle à votre établissement</p>
      </div>
      
      {error && (
        <div className="p-3 mb-4 rounded-md border border-red-300 bg-red-50 text-red-500">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm   font-medium">
            Nom de la salle:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 dark:bg-background/50  bg-background/50  border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0"
            placeholder="Ex: Salle 101"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="size" className="block text-sm font-medium">
            Taille de la salle:
          </label>
          <select
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value as Size)}
            className="w-full px-3 py-2 border dark:bg-background/50  bg-background/50 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0"
          >
            <option value="SMALL">Petite </option>
            <option value="MEDIUM">Moyenne </option>
            <option value="LARGE">Grande </option>
          </select>
          <p className="text-xs">Choisissez la capacité qui correspond le mieux à cette salle</p>
        </div>
        
        <div className="pt-3">
          <button 
            type="submit" 
            className="w-full py-2.5 rounded-md shadow flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création...
              </span>
            ) : (
              "Créer la salle"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoom;