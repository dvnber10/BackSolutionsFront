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
import { useAdminServices } from '../../features/admin/queries';
import { contentStatusLabels, contentStatusOptions, contentStatusTone, withAll } from '../../features/admin/enums';
import type { AdminServiceItem } from '../../features/admin/types';
import { formatCurrency, formatDate } from '../../lib/format';

const PAGE_SIZE = 20;

export default function ServicesPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');

  const { data, isLoading, isError, refetch } = useAdminServices({
    page,
    pageSize: PAGE_SIZE,
    status: status === 'all' ? undefined : status,
  });

  const columns: Column<AdminServiceItem>[] = [
    {
      key: 'name',
      header: 'Servicio',
      render: (service) => (
        <div>
          <strong>{service.name}</strong>
          <div className="muted">{service.slug}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (service) => (
        <Badge tone={contentStatusTone[service.status]}>{contentStatusLabels[service.status]}</Badge>
      ),
    },
    {
      key: 'price',
      header: 'Desde',
      align: 'right',
      render: (service) => (service.basePrice === null ? '—' : formatCurrency(service.basePrice)),
    },
    { key: 'sort', header: 'Orden', align: 'center', render: (service) => service.sortOrder },
    {
      key: 'updated',
      header: 'Actualizado',
      render: (service) => formatDate(service.updatedAtUtc),
    },
  ];

  return (
    <AdminPage
      title="Servicios"
      description="Catálogo de servicios publicados en el sitio."
      actions={
        <Button to="/admin/services/new">
          <Plus size={16} aria-hidden="true" />
          Nuevo servicio
        </Button>
      }
    >
      <Helmet>
        <title>Servicios · Panel BackSolutions</title>
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
          message="No pudimos cargar los servicios."
          onRetry={() => void refetch()}
        />
      )}
      {data && data.items.length === 0 && (
        <StateBlock variant="empty" title="No hay servicios con estos filtros" />
      )}
      {data && data.items.length > 0 && (
        <>
          <DataTable
            columns={columns}
            rows={data.items}
            rowKey={(service) => service.id}
            onRowClick={(service) => navigate(`/admin/services/${service.id}`)}
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
