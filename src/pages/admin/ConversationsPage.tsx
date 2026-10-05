import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { AdminPage } from '../../components/admin/AdminPage';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { Pagination } from '../../components/admin/Pagination';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import { useConversations } from '../../features/admin/queries';
import {
  conversationStatusLabels,
  conversationStatusOptions,
  conversationStatusTone,
  severityFromRank,
  severityLabels,
  severityTone,
  withAll,
} from '../../features/admin/enums';
import type { ConversationListItem } from '../../features/admin/types';
import { formatDateTime } from '../../lib/format';
import './ConversationsPage.scss';

const PAGE_SIZE = 20;

const severityFilterOptions = [
  { value: 'any', label: 'Cualquier severidad' },
  { value: 'low', label: 'Baja o más' },
  { value: 'medium', label: 'Media o más' },
  { value: 'high', label: 'Alta o más' },
  { value: 'critical', label: 'Solo crítica' },
];

export default function ConversationsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [minSeverity, setMinSeverity] = useState('any');

  const { data, isLoading, isError, refetch } = useConversations({
    page,
    pageSize: PAGE_SIZE,
    status: status === 'all' ? undefined : status,
    minSeverity: minSeverity === 'any' ? undefined : minSeverity,
  });

  const columns: Column<ConversationListItem>[] = [
    {
      key: 'subject',
      header: 'Conversación',
      render: (conversation) => (
        <div className="conversation-cell">
          <span className="conversation-cell__subject">{conversation.subject}</span>
          <span className="conversation-cell__client">
            {conversation.clientName} · {conversation.clientEmail}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (conversation) => (
        <Badge tone={conversationStatusTone[conversation.status]}>
          {conversationStatusLabels[conversation.status]}
        </Badge>
      ),
    },
    {
      key: 'severity',
      header: 'Severidad',
      render: (conversation) => {
        const severity = severityFromRank(conversation.highestSeverity);
        return severity ? (
          <Badge tone={severityTone[severity]}>{severityLabels[severity]}</Badge>
        ) : (
          <span className="muted">—</span>
        );
      },
    },
    {
      key: 'assigned',
      header: 'Responsable',
      render: (conversation) =>
        conversation.assignedToName ?? <span className="muted">Sin asignar</span>,
    },
    { key: 'messages', header: 'Mensajes', align: 'center', render: (conversation) => conversation.messageCount },
    {
      key: 'unread',
      header: 'Sin leer',
      align: 'center',
      render: (conversation) =>
        conversation.unreadCount > 0 ? (
          <Badge tone="accent">{conversation.unreadCount}</Badge>
        ) : (
          '0'
        ),
    },
    {
      key: 'last',
      header: 'Último mensaje',
      render: (conversation) => formatDateTime(conversation.lastMessageAtUtc) || '—',
    },
  ];

  return (
    <AdminPage title="Conversaciones" description="Chat con clientes y escalamientos.">
      <Helmet>
        <title>Conversaciones · Panel BackSolutions</title>
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
              {withAll(conversationStatusOptions).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              label="Severidad"
              value={minSeverity}
              onChange={(event) => {
                setMinSeverity(event.target.value);
                setPage(1);
              }}
            >
              {severityFilterOptions.map((option) => (
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
          message="No pudimos cargar las conversaciones."
          onRetry={() => void refetch()}
        />
      )}

      {data && data.items.length === 0 && (
        <StateBlock variant="empty" title="No hay conversaciones con estos filtros" />
      )}

      {data && data.items.length > 0 && (
        <>
          <DataTable
            columns={columns}
            rows={data.items}
            rowKey={(conversation) => conversation.id}
            onRowClick={(conversation) => navigate(`/admin/conversations/${conversation.id}`)}
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
