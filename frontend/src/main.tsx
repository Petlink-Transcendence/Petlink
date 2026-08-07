import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401 && window.location.pathname !== '/login') {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }
  return response;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
