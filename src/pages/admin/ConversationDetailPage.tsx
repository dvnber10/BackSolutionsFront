import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Send, ShieldAlert } from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import {
  adminKeys,
  useAssignConversation,
  useCloseConversation,
  useConversation,
  useCreateEscalation,
  useSendMessage,
  useUpdateEscalationStatus,
  useUsers,
} from '../../features/admin/queries';
import {
  conversationStatusLabels,
  conversationStatusTone,
  escalationStatusLabels,
  escalationStatusOptions,
  escalationStatusTone,
  severityFromRank,
  severityLabels,
  severityTone,
} from '../../features/admin/enums';
import type {
  EscalationSeverity,
  EscalationStatus,
  MessageSenderType,
} from '../../features/admin/enums';
import type { Escalation, UpdateEscalationStatusRequest } from '../../features/admin/types';
import { errorMessage } from '../../lib/http';
import { getAccessToken } from '../../lib/session';
import { formatDateTime } from '../../lib/format';
import './ConversationDetailPage.scss';

const senderTypeLabels: Record<MessageSenderType, string> = {
  client: 'Cliente',
  team: 'Equipo',
  system: 'Sistema',
};

const escalationSeverityOptions: { value: EscalationSeverity; label: string }[] = (
  ['low', 'medium', 'high', 'critical'] as EscalationSeverity[]
).map((value) => ({ value, label: severityLabels[value] }));

function hubBaseUrl(): string {
  const api = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';
  return api.replace(/\/api\/?$/, '');
}

function EscalationCard({
  escalation,
  busy,
  onUpdate,
}: {
  escalation: Escalation;
  busy: boolean;
  onUpdate: (id: string, body: UpdateEscalationStatusRequest) => Promise<void>;
}) {
  const [status, setStatus] = useState<EscalationStatus>(escalation.status);
  const [note, setNote] = useState(escalation.resolutionNote ?? '');

  return (
    <article className="escalation">
      <header className="escalation__head">
        <Badge tone={severityTone[escalation.severity]}>{severityLabels[escalation.severity]}</Badge>
        <Badge tone={escalationStatusTone[escalation.status]}>
          {escalationStatusLabels[escalation.status]}
        </Badge>
        <time className="escalation__time">{formatDateTime(escalation.createdAtUtc)}</time>
      </header>
      <p className="escalation__reason">{escalation.reason}</p>
      <p className="escalation__by">
        Abierto por {escalation.raisedByName ?? 'el sistema'}
        {escalation.assignedToName ? ` · asignado a ${escalation.assignedToName}` : ''}
      </p>
      {escalation.resolvedAtUtc && (
        <p className="escalation__resolution">
          Resuelto: {escalation.resolutionNote ?? 'sin nota'}
        </p>
      )}
      <div className="escalation__controls">
        <Select
          label="Estado"
          value={status}
          onChange={(event) => setStatus(event.target.value as EscalationStatus)}
        >
          {escalationStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Input
          label="Nota de resolución"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <Button
          size="sm"
          variant="secondary"
          loading={busy}
          disabled={status === escalation.status && note === (escalation.resolutionNote ?? '')}
          onClick={() => void onUpdate(escalation.id, { status, resolutionNote: note.trim() || null })}
        >
          Actualizar
        </Button>
      </div>
    </article>
  );
}

export default function ConversationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const conversation = useConversation(id, true);
  const users = useUsers({ pageSize: 200, activeOnly: true });
  const sendMessage = useSendMessage(id ?? '');
  const assign = useAssignConversation(id ?? '');
  const close = useCloseConversation(id ?? '');
  const createEscalation = useCreateEscalation(id ?? '');
  const updateEscalation = useUpdateEscalationStatus(id ?? '');

  const [body, setBody] = useState('');
  const [internal, setInternal] = useState(false);
  const [assignee, setAssignee] = useState('');
  const [closeReason, setCloseReason] = useState('');
  const [escalationSeverity, setEscalationSeverity] = useState<EscalationSeverity>('medium');
  const [escalationReason, setEscalationReason] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const threadEnd = useRef<HTMLDivElement>(null);

  const data = conversation.data;

  useEffect(() => {
    setAssignee(data?.assignedToUserId ?? '');
  }, [data?.assignedToUserId]);

  useEffect(() => {
    threadEnd.current?.scrollIntoView({ block: 'end' });
  }, [data?.messages.length]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${hubBaseUrl()}/hubs/chat/team`, {
        accessTokenFactory: () => getAccessToken() ?? '',
      })
      .withAutomaticReconnect()
      .build();

    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.conversation(id) });
    };

    connection.on('messageAdded', refresh);
    connection.on('escalationChanged', refresh);
    void connection.start().catch(() => {
      /* polling sigue activo como respaldo */
    });

    return () => {
      connection.off('messageAdded', refresh);
      connection.off('escalationChanged', refresh);
      void connection.stop();
    };
  }, [id, queryClient]);

  const severity = useMemo(
    () => (data ? severityFromRank(data.highestSeverity) : null),
    [data],
  );

  if (conversation.isLoading) {
    return <StateBlock variant="loading" />;
  }

  if (conversation.isError || !data) {
    return (
      <StateBlock
        variant="error"
        title="No encontramos la conversación"
        onRetry={() => void conversation.refetch()}
      />
    );
  }

  const isClosed = data.status === 'closed';

  async function run(action: () => Promise<unknown>, okMessage: string) {
    setFeedback(null);
    try {
      await action();
      setFeedback(okMessage);
    } catch (error) {
      setFeedback(errorMessage(error));
    }
  }

  return (
    <AdminPage
      title={data.subject}
      description={`${data.clientName} · ${data.clientEmail}`}
      actions={
        <Button variant="secondary" to="/admin/conversations">
          <ArrowLeft size={16} aria-hidden="true" />
          Volver
        </Button>
      }
    >
      <Helmet>
        <title>{data.subject} · Conversaciones · Panel BackSolutions</title>
      </Helmet>

      {feedback && <p className="admin-note">{feedback}</p>}

      <div className="thread">
        <div className="thread__main panel">
          <div className="panel__head">
            <div className="thread__badges">
              <Badge tone={conversationStatusTone[data.status]}>
                {conversationStatusLabels[data.status]}
              </Badge>
              {severity && <Badge tone={severityTone[severity]}>{severityLabels[severity]}</Badge>}
              {data.leadId && (
                <Link className="thread__lead" to={`/admin/leads/${data.leadId}`}>
                  Ver lead
                </Link>
              )}
            </div>
            <span className="muted">{data.messages.length} mensajes</span>
          </div>

          <div className="panel__body thread__messages">
            {data.messages.length === 0 && <p className="muted">Todavía no hay mensajes.</p>}
            {data.messages.map((message) => (
              <article
                key={message.id}
                className={`bubble bubble--${message.senderType}${
                  message.isInternal ? ' bubble--internal' : ''
                }`}
              >
                <header className="bubble__meta">
                  <span className="bubble__sender">
                    {message.senderName ?? senderTypeLabels[message.senderType]}
                  </span>
                  {message.isInternal && <Badge tone="warning">Nota interna</Badge>}
                  <time>{formatDateTime(message.sentAtUtc)}</time>
                </header>
                <p className="bubble__body">{message.body}</p>
                {message.hasAttachment && (
                  <span className="bubble__attachment">
                    {message.attachmentName ?? 'Adjunto'}
                  </span>
                )}
              </article>
            ))}
            <div ref={threadEnd} />
          </div>

          <div className="panel__body thread__composer">
            <Textarea
              label="Responder"
              rows={3}
              placeholder="Escribí un mensaje…"
              value={body}
              disabled={isClosed}
              onChange={(event) => setBody(event.target.value)}
            />
            <div className="thread__composer-actions">
              <label className="check">
                <input
                  type="checkbox"
                  checked={internal}
                  disabled={isClosed}
                  onChange={(event) => setInternal(event.target.checked)}
                />
                Nota interna (no la ve el cliente)
              </label>
              <Button
                loading={sendMessage.isPending}
                disabled={isClosed || !body.trim()}
                onClick={() =>
                  void run(async () => {
                    await sendMessage.mutateAsync({ body: body.trim(), isInternal: internal });
                    setBody('');
                    setInternal(false);
                  }, 'Mensaje enviado.')
                }
              >
                <Send size={16} aria-hidden="true" />
                Enviar
              </Button>
            </div>
          </div>
        </div>

        <aside className="thread__side">
          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Gestión</h2>
            </div>
            <div className="panel__body stack">
              <Select
                label="Responsable"
                value={assignee}
                onChange={(event) => setAssignee(event.target.value)}
              >
                <option value="">Sin asignar</option>
                {users.data?.items.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName}
                  </option>
                ))}
              </Select>
              <Button
                variant="secondary"
                loading={assign.isPending}
                disabled={assignee === (data.assignedToUserId ?? '')}
                onClick={() =>
                  void run(
                    () => assign.mutateAsync({ userId: assignee || null }),
                    'Responsable actualizado.',
                  )
                }
              >
                Asignar
              </Button>

              {!isClosed && (
                <>
                  <Textarea
                    label="Motivo de cierre"
                    rows={2}
                    value={closeReason}
                    onChange={(event) => setCloseReason(event.target.value)}
                  />
                  <Button
                    variant="danger"
                    loading={close.isPending}
                    disabled={!closeReason.trim()}
                    onClick={() =>
                      void run(
                        () => close.mutateAsync({ reason: closeReason.trim() }),
                        'Conversación cerrada.',
                      )
                    }
                  >
                    Cerrar conversación
                  </Button>
                </>
              )}

              {isClosed && data.closeReason && (
                <p className="muted">Cerrada: {data.closeReason}</p>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">
                <ShieldAlert size={16} aria-hidden="true" /> Escalamientos
              </h2>
            </div>
            <div className="panel__body stack">
              {data.escalations.length === 0 && <p className="muted">Sin escalamientos.</p>}
              {data.escalations.map((escalation) => (
                <EscalationCard
                  key={escalation.id}
                  escalation={escalation}
                  busy={updateEscalation.isPending}
                  onUpdate={(escalationId, payload) =>
                    run(
                      () =>
                        updateEscalation.mutateAsync({ id: escalationId, body: payload }),
                      'Escalamiento actualizado.',
                    )
                  }
                />
              ))}
            </div>
          </section>

          {!isClosed && (
            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">Nuevo escalamiento</h2>
              </div>
              <div className="panel__body stack">
                <Select
                  label="Severidad"
                  value={escalationSeverity}
                  onChange={(event) =>
                    setEscalationSeverity(event.target.value as EscalationSeverity)
                  }
                >
                  {escalationSeverityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <Textarea
                  label="Motivo"
                  rows={3}
                  value={escalationReason}
                  onChange={(event) => setEscalationReason(event.target.value)}
                />
                <Button
                  variant="secondary"
                  loading={createEscalation.isPending}
                  disabled={!escalationReason.trim()}
                  onClick={() =>
                    void run(async () => {
                      await createEscalation.mutateAsync({
                        severity: escalationSeverity,
                        reason: escalationReason.trim(),
                      });
                      setEscalationReason('');
                    }, 'Escalamiento creado.')
                  }
                >
                  Escalar
                </Button>
              </div>
            </section>
          )}
        </aside>
      </div>
    </AdminPage>
  );
}
