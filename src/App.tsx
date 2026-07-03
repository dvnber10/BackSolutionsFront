
// RUTA: src/App.tsx

import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import './App.css';


/**
 * Componente principal de la aplicación.
 * Configura el enrutamiento y la navegación principal.
 */
function App() {
  return (
    <Router>
      <div className="app-shell">
        <header className="site-header">
          <nav className="site-nav">
            <NavLink className="brand" to="/">
              <span className="brand-mark">B</span>
              <span>BackSolutions</span>
            </NavLink>
            <ul className="nav-links">
              <li><NavLink to="/">Inicio</NavLink></li>
              <li><NavLink to="/services">Servicios</NavLink></li>
              <li><NavLink to="/portfolio">Portafolio</NavLink></li>
              <li><NavLink to="/about">Nosotros</NavLink></li>
              <li><NavLink to="/blog">Blog</NavLink></li>
              <li><NavLink to="/contact">Contacto</NavLink></li>
            </ul>
          </nav>
        </header>
        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <p>&copy; {new Date().getFullYear()} BackSolutions. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
