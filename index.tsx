
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("TABLy: Application bootstrapping...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("TABLy: Render successful");
  } catch (error) {
    console.error("TABLy: Critical initialization error", error);
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif;">
        <h1 style="color: #ef4444;">Erreur de chargement</h1>
        <p style="color: #64748b;">${error instanceof Error ? error.message : 'Une erreur inconnue est survenue'}</p>
        <button onclick="window.location.reload()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Réessayer</button>
      </div>
    `;
  }
} else {
  console.error("TABLy: HTML Root container not found");
}
