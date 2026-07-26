import { createRoot } from 'react-dom/client';

import { initErrorMonitoring } from './lib/error-monitoring';
import App from './App';

import './index.css';

// Initialise error monitoring before rendering so the first frame is covered.
// Set VITE_SENTRY_DSN to connect to a real Sentry project; without it the SDK
// no-ops and structured console.error logs are still emitted from the boundaries.
initErrorMonitoring();

createRoot(document.getElementById('root')!).render(<App />);
