import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { AdminPage } from '../../components/admin/AdminPage';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { Pagination } from '../../components/admin/Pagination';
import { Badge } from '../../components/ui/Badge';
import { Input, Select } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import { useLeads } from '../../features/admin/queries';
import { leadSourceLabels, leadStatusLabels, leadStatusTone, leadStatusOptions, withAll } from '../../features/admin/enums';
import type { LeadListItem } from '../../features/admin/types';
import { formatDateTime } from '../../lib/format';
import './LeadsPage.scss';

const PAGE_SIZE = 20;

export default function LeadsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [unassignedOnly, setUnassignedOnly] = useState(false);

  const { data, isLoading, isError, refetch } = useLeads({
    page,
    pageSize: PAGE_SIZE,
    status: status === 'all' ? undefined : status,
    search: search.trim() || undefined,
    unassignedOnly: unassignedOnly || undefined,
  });

  function resetToFirstPage<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  const columns: Column<LeadListItem>[] = [
    {
      key: 'lead',
      header: 'Lead',
      render: (lead) => (
        <div className="lead-cell">
          <span className="lead-cell__name">{lead.name}</span>
          <span className="lead-cell__email">{lead.email}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (lead) => (
        <Badge tone={leadStatusTone[lead.status]}>{leadStatusLabels[lead.status]}</Badge>
      ),
    },
    { key: 'source', header: 'Origen', render: (lead) => leadSourceLabels[lead.source] },
    { key: 'proposals', header: 'Propuestas', align: 'center', render: (lead) => lead.proposalCount },
    { key: 'chats', header: 'Chats', align: 'center', render: (lead) => lead.conversationCount },
    {
      key: 'owner',
      header: 'Responsable',
      render: (lead) => lead.handledByName ?? <span className="muted">Sin asignar</span>,
    },
    {
      key: 'created',
      header: 'Creado',
      render: (lead) => formatDateTime(lead.createdAtUtc),
    },
  ];

  return (
    <AdminPage title="Leads" description="Bandeja comercial con el detalle de cada consulta.">
      <Helmet>
        <title>Leads · Panel BackSolutions</title>
      </Helmet>

      <div className="panel">
        <div className="panel__body">
          <div className="filters">
            <div className="filters__grow">
              <Input
                label="Buscar"
                placeholder="Nombre, correo o detalle"
                value={search}
                onChange={(event) => resetToFirstPage(setSearch)(event.target.value)}
              />
            </div>
            <Select
              label="Estado"
              value={status}
              onChange={(event) => resetToFirstPage(setStatus)(event.target.value)}
            >
              {withAll(leadStatusOptions).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <label className="check">
              <input
                type="checkbox"
                checked={unassignedOnly}
                onChange={(event) => resetToFirstPage(setUnassignedOnly)(event.target.checked)}
              />
              Solo sin asignar
            </label>
          </div>
        </div>
      </div>

      {isLoading && <StateBlock variant="loading" />}

      {isError && (
        <StateBlock
          variant="error"
          message="No pudimos cargar los leads."
          onRetry={() => void refetch()}
        />
      )}

      {data && data.items.length === 0 && (
        <StateBlock variant="empty" title="No hay leads con estos filtros" />
      )}

      {data && data.items.length > 0 && (
        <>
          <DataTable
            columns={columns}
            rows={data.items}
            rowKey={(lead) => lead.id}
            onRowClick={(lead) => navigate(`/admin/leads/${lead.id}`)}
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
