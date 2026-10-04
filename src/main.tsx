import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully prevent unhandled WebSocket disconnections in dev preview / iframe
window.addEventListener('unhandledrejection', (event) => {
  const reasonStr = String(event.reason || '');
  if (
    reasonStr.includes('WebSocket') ||
    reasonStr.includes('websocket') ||
    (event.reason && typeof event.reason === 'object' && 'message' in event.reason && String(event.reason.message).includes('WebSocket'))
  ) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  const msgStr = String(event.message || '');
  if (msgStr.includes('WebSocket') || msgStr.includes('websocket')) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(<App />);
