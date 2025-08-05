import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { KaraokeProvider } from './providers/KaraokeProvider.tsx'
import { YorkieErrorBoundary } from './components/realtime/YorkieErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <YorkieErrorBoundary>
      <KaraokeProvider>
        <App />
      </KaraokeProvider>
    </YorkieErrorBoundary>
  </StrictMode>,
)
