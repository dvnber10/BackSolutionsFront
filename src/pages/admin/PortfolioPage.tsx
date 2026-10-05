import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { Pagination } from '../../components/admin/Pagination';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import { useAdminProjects } from '../../features/admin/queries';
import { contentStatusLabels, contentStatusOptions, contentStatusTone, withAll } from '../../features/admin/enums';
import type { AdminPortfolioProject } from '../../features/admin/types';
import { formatDate } from '../../lib/format';

const PAGE_SIZE = 20;

export default function PortfolioPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');

  const { data, isLoading, isError, refetch } = useAdminProjects({
    page,
    pageSize: PAGE_SIZE,
    status: status === 'all' ? undefined : status,
  });

  const columns: Column<AdminPortfolioProject>[] = [
    {
      key: 'title',
      header: 'Proyecto',
      render: (project) => (
        <div>
          <strong>{project.title}</strong>
          <div className="muted">{project.slug}</div>
        </div>
      ),
    },
    {
      key: 'featured',
      header: 'Destacado',
      align: 'center',
      render: (project) =>
        project.isFeatured ? (
          <Badge tone="accent">
            <Star size={12} aria-hidden="true" /> Destacado
          </Badge>
        ) : (
          <span className="muted">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (project) => (
        <Badge tone={contentStatusTone[project.status]}>{contentStatusLabels[project.status]}</Badge>
      ),
    },
    {
      key: 'delivered',
      header: 'Entregado',
      render: (project) => formatDate(project.deliveredOn) || '—',
    },
    { key: 'sort', header: 'Orden', align: 'center', render: (project) => project.sortOrder },
  ];

  return (
    <AdminPage
      title="Portafolio"
      description="Proyectos y casos publicados en el sitio."
      actions={
        <Button to="/admin/portfolio/new">
          <Plus size={16} aria-hidden="true" />
          Nuevo proyecto
        </Button>
      }
    >
      <Helmet>
        <title>Portafolio · Panel BackSolutions</title>
      </Helmet>

      <div className="panel">
        <div className="panel__body">
          <div className="filters">
            <Select
              label="Estado"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              {withAll(contentStatusOptions).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {isLoading && <StateBlock variant="loading" />}
      {isError && (
        <StateBlock
          variant="error"
          message="No pudimos cargar los proyectos."
          onRetry={() => void refetch()}
        />
      )}
      {data && data.items.length === 0 && (
        <StateBlock variant="empty" title="No hay proyectos con estos filtros" />
      )}
      {data && data.items.length > 0 && (
        <>
          <DataTable
            columns={columns}
            rows={data.items}
            rowKey={(project) => project.id}
            onRowClick={(project) => navigate(`/admin/portfolio/${project.id}`)}
          />
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            totalCount={data.totalCount}
            hasPrevious={data.hasPrevious}
            hasNext={data.hasNext}
            onPage={setPage}
          />
        </>
      )}
    </AdminPage>
  );
}
