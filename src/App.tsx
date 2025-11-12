import { useState } from 'react';
import { CryptoConverter } from './components/CryptoConverter';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <CryptoConverter />
    </div>
  );
}