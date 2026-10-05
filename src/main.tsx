import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Fuentes empaquetadas localmente: no dependemos de Google Fonts en runtime y
// evitamos el parpadeo por FOIT.
import '@fontsource-variable/inter';
import '@fontsource-variable/sora';
import '@fontsource-variable/jetbrains-mono';

import './styles/global.scss';
import App from './App';
import { Providers } from './app/providers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
