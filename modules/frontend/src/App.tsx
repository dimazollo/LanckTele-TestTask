import React from 'react';
import { CurrencyTable } from './features/currency/CurrencyTable';

function App() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold underline text-blue-600 mb-3">
        Currency Rates
      </h1>
      <CurrencyTable />
    </div>
  );
}

export default App;
