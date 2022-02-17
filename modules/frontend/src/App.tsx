import React from 'react';
import './App.css';
import { CurrencyTable } from './features/currencyRate/CurrencyTable';

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline text-blue-600">
        Hello world!
      </h1>
      <CurrencyTable />
    </>
  );
}

export default App;
