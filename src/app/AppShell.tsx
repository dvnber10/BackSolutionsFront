import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ChatWidget } from '../components/chat/ChatWidget';
import './AppShell.scss';

/**
 * Estructura común del sitio público: header, contenido y footer.
 * El `<main>` lleva id para que el skip link del inicio pueda saltar directo acá.
 *
 * El chat de preventas va acá y no en las páginas: es la misma pregunta en todo el sitio
 * y así no depende de que el visitante recuerde dónde estaba el botón.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="site__main">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
