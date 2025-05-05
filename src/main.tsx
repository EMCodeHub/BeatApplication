import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ContextBeatProvider } from './context/ContextBeatProvider';

createRoot(document.getElementById('root')!).render(
  <ContextBeatProvider>
    <App />
  </ContextBeatProvider>
);
