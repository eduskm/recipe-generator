import React from 'react';
import IngredientsList from './IngredientList';
import './App.css';

function App() {
  return (
    <div>
      <h1 className="title">Recepie Generator</h1>
      {/* Aici poți adăuga componentele tale */}


      <div className="app-container">
      <IngredientsList />
      </div>

    </div>
    

  );
}

export default App;