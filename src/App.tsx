import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from './app/AppShell';
import { Spinner } from './components/ui/Spinner';
import { RequireAuth } from './features/auth/RequireAuth';

const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const TrackLead = lazy(() => import('./pages/TrackLead'));
const NotFound = lazy(() =>
  import('./pages/NotFound').then((module) => ({ default: module.NotFound })),
);

const AdminLayout = lazy(() =>
  import('./components/admin/AdminLayout').then((module) => ({ default: module.AdminLayout })),
);
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const LeadsPage = lazy(() => import('./pages/admin/LeadsPage'));
const LeadDetailPage = lazy(() => import('./pages/admin/LeadDetailPage'));
const ProposalsPage = lazy(() => import('./pages/admin/ProposalsPage'));
const ProposalEditPage = lazy(() => import('./pages/admin/ProposalEditPage'));
const ConversationsPage = lazy(() => import('./pages/admin/ConversationsPage'));
const ConversationDetailPage = lazy(() => import('./pages/admin/ConversationDetailPage'));
const ServicesPage = lazy(() => import('./pages/admin/ServicesPage'));
const ServiceEditPage = lazy(() => import('./pages/admin/ServiceEditPage'));
const PortfolioPage = lazy(() => import('./pages/admin/PortfolioPage'));
const PortfolioEditPage = lazy(() => import('./pages/admin/PortfolioEditPage'));
const BlogPage = lazy(() => import('./pages/admin/BlogPage'));
const BlogEditPage = lazy(() => import('./pages/admin/BlogEditPage'));
const BlogTagsPage = lazy(() => import('./pages/admin/BlogTagsPage'));
const PagesPage = lazy(() => import('./pages/admin/PagesPage'));
const PageEditPage = lazy(() => import('./pages/admin/PageEditPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const UserEditPage = lazy(() => import('./pages/admin/UserEditPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

/**
 * Al cambiar de ruta, volver arriba. Sin esto, al navegar desde el footer de una
 * página larga se aterriza a mitad de la página nueva.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function RouteFallback() {
  return (
    <div className="route-loader">
      <Spinner size="lg" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Panel: pantalla de acceso sin chrome público. */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Panel: todo lo demás protegido y con su propio layout. */}
          <Route element={<RequireAuth />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/leads" element={<LeadsPage />} />
              <Route path="/admin/leads/:id" element={<LeadDetailPage />} />
              <Route path="/admin/proposals" element={<ProposalsPage />} />
              <Route path="/admin/proposals/new" element={<ProposalEditPage />} />
              <Route path="/admin/proposals/:id" element={<ProposalEditPage />} />
              <Route path="/admin/conversations" element={<ConversationsPage />} />
              <Route path="/admin/conversations/:id" element={<ConversationDetailPage />} />
              <Route path="/admin/services" element={<ServicesPage />} />
              <Route path="/admin/services/new" element={<ServiceEditPage />} />
              <Route path="/admin/services/:id" element={<ServiceEditPage />} />
              <Route path="/admin/portfolio" element={<PortfolioPage />} />
              <Route path="/admin/portfolio/new" element={<PortfolioEditPage />} />
              <Route path="/admin/portfolio/:id" element={<PortfolioEditPage />} />
              <Route path="/admin/blog" element={<BlogPage />} />
              <Route path="/admin/blog/new" element={<BlogEditPage />} />
              <Route path="/admin/blog/tags" element={<BlogTagsPage />} />
              <Route path="/admin/blog/:id" element={<BlogEditPage />} />
              <Route path="/admin/pages" element={<PagesPage />} />
              <Route path="/admin/pages/new" element={<PageEditPage />} />
              <Route path="/admin/pages/:id" element={<PageEditPage />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/users/new" element={<UserEditPage />} />
              <Route path="/admin/users/:id" element={<UserEditPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Sitio público. */}
          <Route element={<AppShell><Outlet /></AppShell>}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:slug" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/consulta/:token" element={<TrackLead />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
