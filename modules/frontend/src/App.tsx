import React from 'react';
import { CurrencyTable } from './features/currency/CurrencyTable';

function App() {
  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="text-xl font-bold text-blue-600 mb-3">Currency Rates</h1>

      <CurrencyTable className="h-full" />
    </div>
  );
}

export default App;
