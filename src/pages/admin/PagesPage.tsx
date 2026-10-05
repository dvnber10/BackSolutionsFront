import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { Pagination } from '../../components/admin/Pagination';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import { useAdminPages } from '../../features/admin/queries';
import { contentStatusLabels, contentStatusOptions, contentStatusTone, withAll } from '../../features/admin/enums';
import type { AdminPage as PageModel } from '../../features/admin/types';
import { formatDate } from '../../lib/format';

const PAGE_SIZE = 20;

export default function PagesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');

  const { data, isLoading, isError, refetch } = useAdminPages({
    page,
    pageSize: PAGE_SIZE,
    status: status === 'all' ? undefined : status,
  });

  const columns: Column<PageModel>[] = [
    {
      key: 'title',
      header: 'Página',
      render: (item) => (
        <div>
          <strong>{item.title}</strong>
          <div className="muted">/{item.slug}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (item) => (
        <Badge tone={contentStatusTone[item.status]}>{contentStatusLabels[item.status]}</Badge>
      ),
    },
    {
      key: 'nav',
      header: 'En menú',
      align: 'center',
      render: (item) => (item.showInNavigation ? 'Sí' : '—'),
    },
    { key: 'sections', header: 'Secciones', align: 'center', render: (item) => item.sections.length },
    { key: 'sort', header: 'Orden', align: 'center', render: (item) => item.sortOrder },
    {
      key: 'updated',
      header: 'Actualizado',
      render: (item) => formatDate(item.updatedAtUtc),
    },
  ];

  return (
    <AdminPage
      title="Páginas"
      description="Páginas del sitio y sus secciones."
      actions={
        <Button to="/admin/pages/new">
          <Plus size={16} aria-hidden="true" />
          Nueva página
        </Button>
      }
    >
      <Helmet>
        <title>Páginas · Panel BackSolutions</title>
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
          message="No pudimos cargar las páginas."
          onRetry={() => void refetch()}
        />
      )}
      {data && data.items.length === 0 && (
        <StateBlock variant="empty" title="No hay páginas con estos filtros" />
      )}
      {data && data.items.length > 0 && (
        <>
          <DataTable
            columns={columns}
            rows={data.items}
            rowKey={(item) => item.id}
            onRowClick={(item) => navigate(`/admin/pages/${item.id}`)}
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
