import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare, Phone } from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { ConfirmButton } from '../../components/admin/ConfirmButton';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select, Textarea } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import {
  useAssignLead,
  useDeleteLead,
  useLead,
  useUpdateLeadNotes,
  useUpdateLeadStatus,
  useUsers,
} from '../../features/admin/queries';
import {
  conversationStatusLabels,
  conversationStatusTone,
  leadSourceLabels,
  leadStatusLabels,
  leadStatusOptions,
  leadStatusTone,
  proposalStatusLabels,
  proposalStatusTone,
  type LeadStatus,
} from '../../features/admin/enums';
import { isOwner } from '../../features/admin/navigation';
import { useAuth } from '../../features/auth/useAuth';
import { errorMessage } from '../../lib/http';
import { formatCurrency, formatDate, formatDateTime } from '../../lib/format';
import './LeadDetailPage.scss';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: lead, isLoading, isError, refetch } = useLead(id);
  const users = useUsers({ pageSize: 100, activeOnly: true });

  const updateStatus = useUpdateLeadStatus(id ?? '');
  const assign = useAssignLead(id ?? '');
  const updateNotes = useUpdateLeadNotes(id ?? '');
  const remove = useDeleteLead();

  const [status, setStatus] = useState<string>('');
  const [assignee, setAssignee] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setAssignee(lead.handledByUserId ?? '');
      setNotes(lead.internalNotes ?? '');
    }
  }, [lead]);

  if (isLoading) {
    return <StateBlock variant="loading" />;
  }

  if (isError || !lead) {
    return (
      <StateBlock
        variant="error"
        title="No encontramos el lead"
        message="Puede que se haya eliminado."
        onRetry={() => void refetch()}
      />
    );
  }

  async function run(action: () => Promise<unknown>, message: string) {
    setFeedback(null);
    try {
      await action();
      setFeedback(message);
    } catch (error) {
      setFeedback(errorMessage(error));
    }
  }

  return (
    <AdminPage
      title={lead.name}
      description={lead.serviceName ? `Interesado en ${lead.serviceName}` : undefined}
      actions={
        <>
          <Button variant="secondary" to="/admin/leads">
            <ArrowLeft size={16} aria-hidden="true" />
            Volver
          </Button>
          {isOwner(user) && (
            <ConfirmButton
              label="Eliminar"
              loading={remove.isPending}
              onConfirm={() =>
                void run(async () => {
                  await remove.mutateAsync(lead.id);
                  navigate('/admin/leads');
                }, '')
              }
            />
          )}
        </>
      }
    >
      <Helmet>
        <title>{lead.name} · Leads · Panel BackSolutions</title>
      </Helmet>

      {feedback && <p className="admin-note">{feedback}</p>}

      <div className="lead-detail">
        <div className="lead-detail__main">
          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Consulta</h2>
              <Badge tone={leadStatusTone[lead.status]}>{leadStatusLabels[lead.status]}</Badge>
            </div>
            <div className="panel__body">
              <p className="lead-detail__details">{lead.details}</p>
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Notas internas</h2>
            </div>
            <div className="panel__body">
              <Textarea
                label="Notas"
                hint="Solo visibles para el equipo."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
            <div className="panel__foot">
              <Button
                loading={updateNotes.isPending}
                onClick={() =>
                  void run(
                    () => updateNotes.mutateAsync({ internalNotes: notes.trim() || null }),
                    'Notas guardadas.',
                  )
                }
              >
                Guardar notas
              </Button>
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Propuestas</h2>
            </div>
            <div className="panel__body panel__body--flush">
              {lead.proposals.length === 0 ? (
                <p className="lead-detail__empty">Sin propuestas todavía.</p>
              ) : (
                <ul className="related-list">
                  {lead.proposals.map((proposal) => (
                    <li key={proposal.id}>
                      <Link className="related-list__row" to={`/admin/proposals/${proposal.id}`}>
                        <span className="related-list__title">
                          {proposal.number} · {proposal.title}
                        </span>
                        <Badge tone={proposalStatusTone[proposal.status]}>
                          {proposalStatusLabels[proposal.status]}
                        </Badge>
                        <span className="related-list__meta">
                          {formatCurrency(proposal.totalAmount, proposal.currency)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Conversaciones</h2>
            </div>
            <div className="panel__body panel__body--flush">
              {lead.conversations.length === 0 ? (
                <p className="lead-detail__empty">Sin conversaciones todavía.</p>
              ) : (
                <ul className="related-list">
                  {lead.conversations.map((conversation) => (
                    <li key={conversation.id}>
                      <Link
                        className="related-list__row"
                        to={`/admin/conversations/${conversation.id}`}
                      >
                        <span className="related-list__title">{conversation.subject}</span>
                        <Badge tone={conversationStatusTone[conversation.status]}>
                          {conversationStatusLabels[conversation.status]}
                        </Badge>
                        <span className="related-list__meta">
                          {formatDateTime(conversation.lastMessageAtUtc)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <aside className="lead-detail__side">
          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Gestión</h2>
            </div>
            <div className="panel__body stack">
              <Select label="Estado" value={status} onChange={(event) => setStatus(event.target.value)}>
                {leadStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Button
                variant="secondary"
                loading={updateStatus.isPending}
                disabled={status === lead.status}
                onClick={() =>
                  void run(
                    () => updateStatus.mutateAsync({ status: status as LeadStatus }),
                    'Estado actualizado.',
                  )
                }
              >
                Actualizar estado
              </Button>

              <Select
                label="Responsable"
                value={assignee}
                onChange={(event) => setAssignee(event.target.value)}
              >
                <option value="">Sin asignar</option>
                {users.data?.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.fullName}
                  </option>
                ))}
              </Select>
              <Button
                variant="secondary"
                loading={assign.isPending}
                disabled={assignee === (lead.handledByUserId ?? '')}
                onClick={() =>
                  void run(
                    () => assign.mutateAsync({ userId: assignee || null }),
                    'Responsable actualizado.',
                  )
                }
              >
                Asignar
              </Button>
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Contacto</h2>
            </div>
            <div className="panel__body">
              <ul className="data-list">
                <DataRow icon={<Mail size={15} />} label="Correo" value={lead.email} />
                <DataRow icon={<Phone size={15} />} label="Teléfono" value={lead.phone ?? '—'} />
                <DataRow
                  icon={<MessageSquare size={15} />}
                  label="Origen"
                  value={leadSourceLabels[lead.source]}
                />
                <DataRow
                  label="Presupuesto"
                  value={
                    lead.budgetMin || lead.budgetMax
                      ? `${formatCurrency(lead.budgetMin, lead.currency ?? 'ARS')} – ${formatCurrency(
                          lead.budgetMax,
                          lead.currency ?? 'ARS',
                        )}`
                      : '—'
                  }
                />
                <DataRow label="Inicio deseado" value={formatDate(lead.targetStartDate) || '—'} />
                <DataRow label="Creado" value={formatDateTime(lead.createdAtUtc)} />
                <DataRow label="IP" value={lead.ipAddress ?? '—'} />
              </ul>
            </div>
          </section>
        </aside>
      </div>
    </AdminPage>
  );
}

function DataRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="data-list__row">
      <span className="data-list__label">
        {icon}
        {label}
      </span>
      <span className="data-list__value">{value}</span>
    </li>
  );
}
