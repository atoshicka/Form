import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './app/App.tsx';
import { AuthProvider } from './context/AuthProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <Toaster 
        position="bottom-right"
        toastOptions={{
            success: {
                style: {
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--input-border)',
                    borderRadius: '12px',
                    fontSize: '14px',
                },
                iconTheme: {
                    primary: 'var(--accent)',
                    secondary: 'var(--input-bg)',
                },
            },
        }}
    />
      <App />
        </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
