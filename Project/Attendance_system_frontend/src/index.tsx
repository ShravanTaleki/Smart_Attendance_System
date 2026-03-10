import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Inter from Google Fonts
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
document.head.appendChild(fontLink);

// Global reset
const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    font-family: "Inter", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f7f7f7;
  }
  input, button, select, textarea {
    font-family: "Inter", sans-serif;
  }
  input:focus {
    border-color: #000 !important;
    outline: none;
  }
  button:hover:not(:disabled) {
    opacity: 0.85;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
`;

const styleTag = document.createElement('style');
styleTag.textContent = globalStyles;
document.head.appendChild(styleTag);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
