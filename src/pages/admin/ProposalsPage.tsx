import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { Pagination } from '../../components/admin/Pagination';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import { useProposals } from '../../features/admin/queries';
import { proposalStatusLabels, proposalStatusOptions, proposalStatusTone, withAll } from '../../features/admin/enums';
import type { ProposalListItem } from '../../features/admin/types';
import { formatCurrency, formatDate } from '../../lib/format';
import './ProposalsPage.scss';

const PAGE_SIZE = 20;

export default function ProposalsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('leadId');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, refetch } = useProposals({
    page,
    pageSize: PAGE_SIZE,
    leadId,
    status: status === 'all' ? undefined : status,
    search: search.trim() || undefined,
  });

  const columns: Column<ProposalListItem>[] = [
    {
      key: 'proposal',
      header: 'Propuesta',
      render: (proposal) => (
        <div className="proposal-cell">
          <span className="proposal-cell__number">{proposal.number}</span>
          <span className="proposal-cell__title">{proposal.title}</span>
        </div>
      ),
    },
    { key: 'lead', header: 'Lead', render: (proposal) => proposal.leadName },
    {
      key: 'status',
      header: 'Estado',
      render: (proposal) => (
        <Badge tone={proposalStatusTone[proposal.status]}>
          {proposalStatusLabels[proposal.status]}
        </Badge>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      render: (proposal) => formatCurrency(proposal.totalAmount, proposal.currency),
    },
    {
      key: 'validUntil',
      header: 'Válida hasta',
      render: (proposal) => formatDate(proposal.validUntil) || '—',
    },
  ];

  return (
    <AdminPage
      title="Propuestas"
      description="Presupuestos enviados a los leads."
      actions={
        <Button to="/admin/proposals/new">
          <Plus size={16} aria-hidden="true" />
          Nueva propuesta
        </Button>
      }
    >
      <Helmet>
        <title>Propuestas · Panel BackSolutions</title>
      </Helmet>

      {leadId && (
        <p className="admin-note">Filtrando por el lead seleccionado en su ficha.</p>
      )}

      <div className="panel">
        <div className="panel__body">
          <div className="filters">
            <div className="filters__grow">
              <Input
                label="Buscar"
                placeholder="Número, título o lead"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              label="Estado"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              {withAll(proposalStatusOptions).map((option) => (
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
          message="No pudimos cargar las propuestas."
          onRetry={() => void refetch()}
        />
      )}

      {data && data.items.length === 0 && (
        <StateBlock variant="empty" title="No hay propuestas con estos filtros" />
      )}

      {data && data.items.length > 0 && (
        <>
          <DataTable
            columns={columns}
            rows={data.items}
            rowKey={(proposal) => proposal.id}
            onRowClick={(proposal) => navigate(`/admin/proposals/${proposal.id}`)}
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
