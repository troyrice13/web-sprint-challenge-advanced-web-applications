// 👉 DO NOT CHANGE THIS FILE 👈
// 👉 DO NOT CHANGE THIS FILE 👈
// 👉 DO NOT CHANGE THIS FILE 👈
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App'
import './styles/reset.css'
import './styles/styles.css'
// Import the necessary modules from react-dom
import { createRoot } from 'react-dom/client';

// Identify the root element
const container = document.getElementById('root');
const root = createRoot(container); // Create a root.

// Use the root to render your component tree
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
