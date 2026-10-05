import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  AlertOctagon,
  BadgeCheck,
  Briefcase,
  FileText,
  Inbox,
  Layers,
  MessagesSquare,
  Newspaper,
  Sparkles,
  TrendingUp,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { StateBlock } from '../../components/ui/StateBlock';
import { useDashboardStats } from '../../features/admin/queries';
import { formatCurrency } from '../../lib/format';
import './DashboardPage.scss';

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardStats();

  return (
    <AdminPage title="Dashboard" description="Un vistazo rápido al negocio.">
      <Helmet>
        <title>Dashboard · Panel BackSolutions</title>
      </Helmet>

      {isLoading && <StateBlock variant="loading" />}

      {isError && (
        <StateBlock
          variant="error"
          message="No pudimos cargar las métricas."
          onRetry={() => void refetch()}
        />
      )}

      {data && (
        <>
          <section className="stat-grid" aria-label="Indicadores">
            <Stat
              icon={<Inbox size={18} />}
              label="Leads totales"
              value={data.totalLeads}
              hint={`${data.newLeads} nuevos`}
            />
            <Stat
              icon={<TrendingUp size={18} />}
              label="En revisión"
              value={data.leadsInReview}
            />
            <Stat
              icon={<BadgeCheck size={18} />}
              label="Ganados"
              value={data.leadsWon}
              tone="success"
            />
            <Stat
              icon={<XCircle size={18} />}
              label="Perdidos"
              value={data.leadsLost}
              tone="danger"
            />
            <Stat
              icon={<Sparkles size={18} />}
              label="Ingresos ganados"
              value={formatCurrency(data.wonRevenue)}
              tone="success"
            />
            <Stat
              icon={<MessagesSquare size={18} />}
              label="Conversaciones abiertas"
              value={data.openConversations}
              hint={`${data.awaitingTeam} esperando al equipo`}
            />
            <Stat
              icon={<AlertOctagon size={18} />}
              label="Escalaciones abiertas"
              value={data.openEscalations}
              hint={`${data.criticalEscalations} críticas`}
              tone={data.criticalEscalations > 0 ? 'danger' : 'default'}
            />
            <Stat icon={<UserCheck size={18} />} label="Usuarios activos" value={data.activeUsers} />
          </section>

          <section className="dash-grid">
            <div className="panel">
              <div className="panel__head">
                <h2 className="panel__title">Servicios más consultados</h2>
              </div>
              <div className="panel__body panel__body--flush">
                {data.topServices.length === 0 ? (
                  <p className="dash-empty">Todavía no hay datos suficientes.</p>
                ) : (
                  <ul className="top-list">
                    {data.topServices.map((service) => (
                      <li className="top-list__item" key={service.serviceId}>
                        <span className="top-list__name">{service.name}</span>
                        <span className="top-list__count">{service.leads}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel__head">
                <h2 className="panel__title">Contenido publicado</h2>
              </div>
              <div className="panel__body">
                <ul className="content-counts">
                  <ContentCount icon={<Layers size={16} />} label="Páginas" value={data.publishedPages} to="/admin/pages" />
                  <ContentCount icon={<Briefcase size={16} />} label="Servicios" value={data.publishedServices} to="/admin/services" />
                  <ContentCount icon={<Layers size={16} />} label="Proyectos" value={data.publishedProjects} to="/admin/portfolio" />
                  <ContentCount icon={<Newspaper size={16} />} label="Artículos" value={data.publishedPosts} to="/admin/blog" />
                  <ContentCount icon={<FileText size={16} />} label="Propuestas" value={data.totalLeads} to="/admin/proposals" />
                </ul>
              </div>
            </div>
          </section>
        </>
      )}
    </AdminPage>
  );
}

type StatProps = {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  hint?: string;
  tone?: 'default' | 'success' | 'danger';
};

function Stat({ icon, label, value, hint, tone = 'default' }: StatProps) {
  return (
    <div className={`stat stat--${tone}`}>
      <span className="stat__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="stat__label">{label}</span>
      <strong className="stat__value">{value}</strong>
      {hint && <span className="stat__hint">{hint}</span>}
    </div>
  );
}

function ContentCount({
  icon,
  label,
  value,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  to: string;
}) {
  return (
    <li>
      <Link className="content-counts__row" to={to}>
        <span className="content-counts__icon" aria-hidden="true">
          {icon}
        </span>
        <span>{label}</span>
        <strong>{value}</strong>
      </Link>
    </li>
  );
}
