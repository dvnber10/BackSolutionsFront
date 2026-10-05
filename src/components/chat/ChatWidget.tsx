import { useEffect, useMemo, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Paperclip, Send, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Field';
import { Spinner } from '../ui/Spinner';
import { useService, useServices, useTrackedLead } from '../../features/content/queries';
import { chatApi } from '../../features/chat/api';
import {
  chatKeys,
  usePublicConversation,
  useSendChatMessage,
  useStartConversation,
} from '../../features/chat/queries';
import {
  OPEN_EVENT,
  clearChat,
  markChatRead,
  readChat,
  saveChat,
  type SavedChat,
} from '../../features/chat/store';
import {
  MAX_ATTACHMENT_BYTES,
  MAX_MESSAGE_LENGTH,
  MAX_SUBJECT_LENGTH,
  conversationStatusLabels,
  type ChatMessage,
  type PublicConversation,
} from '../../features/chat/types';
import { errorMessage } from '../../lib/http';
import { formatDateTime } from '../../lib/format';
import './ChatWidget.scss';

function hubUrl(publicToken: string): string {
  const api = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';
  const base = api.replace(/\/api\/?$/, '');
  return `${base}/hubs/chat/conversation?publicToken=${encodeURIComponent(publicToken)}`;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No pudimos leer el archivo.'));
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.readAsDataURL(file);
  });
}

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.ceil(bytes / 1024)} kB`;
}

// ── Formulario de alta ───────────────────────────────────────

function ChatStartForm({
  defaults,
  leadId,
  defaultSubject,
  onStarted,
}: {
  defaults: { name: string; email: string } | null;
  leadId: string | null;
  defaultSubject: string;
  onStarted: (chat: SavedChat) => void;
}) {
  const services = useServices();
  const start = useStartConversation();

  const [name, setName] = useState(defaults?.name ?? '');
  const [email, setEmail] = useState(defaults?.email ?? '');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultSubject) {
      setSubject((current) => (current === '' ? defaultSubject : current));
    }
  }, [defaultSubject]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Contanos tu nombre.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Revisá el email: no parece válido.');
      return;
    }

    if (!subject.trim()) {
      setError('Poné un asunto.');
      return;
    }

    if (!message.trim()) {
      setError('Escribí tu consulta.');
      return;
    }

    try {
      const started = await start.mutateAsync({
        subject: subject.trim(),
        message: message.trim(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        leadId,
        serviceId: serviceId || null,
        attachmentName: file?.name ?? null,
        attachmentContentType: file?.type || null,
        attachmentBase64: file ? await fileToBase64(file) : null,
      });

      onStarted({
        publicToken: started.publicToken,
        name: name.trim(),
        email: email.trim(),
        lastReadAtUtc: started.firstMessage.sentAtUtc,
      });
    } catch (caught) {
      setError(errorMessage(caught));
    }
  }

  return (
    <form className="chat-form" onSubmit={onSubmit}>
      <p className="chat-form__intro">
        ¿Tenés una duda antes de pedir una cotización? Escribinos y te respondemos por
        acá. No hace falta que dejes tus datos de contacto para que teemos el hilo.
      </p>

      <Input
        label="Nombre"
        required
        value={name}
        autoComplete="name"
        onChange={(event) => setName(event.target.value)}
      />
      <Input
        label="Email"
        required
        type="email"
        value={email}
        autoComplete="email"
        hint="Solo para poder responderte."
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        label="Teléfono"
        type="tel"
        value={phone}
        autoComplete="tel"
        hint="Opcional."
        onChange={(event) => setPhone(event.target.value)}
      />
      <Select
        label="¿Sobre qué servicio?"
        value={serviceId}
        onChange={(event) => setServiceId(event.target.value)}
      >
        <option value="">Consulta general</option>
        {services.data?.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </Select>
      <Input
        label="Asunto"
        required
        value={subject}
        maxLength={MAX_SUBJECT_LENGTH}
        onChange={(event) => setSubject(event.target.value)}
      />
      <Textarea
        label="Consulta"
        required
        rows={4}
        value={message}
        maxLength={MAX_MESSAGE_LENGTH}
        placeholder="Contanos qué necesitás, en pocas líneas."
        onChange={(event) => setMessage(event.target.value)}
      />
      <label className="chat-form__file">
        <Paperclip size={16} aria-hidden="true" />
        <span>{file ? `${file.name} · ${formatSize(file.size)}` : 'Adjuntar un archivo'}</span>
        <input
          type="file"
          className="visually-hidden"
          onChange={(event) => {
            const picked = event.target.files?.[0] ?? null;
            if (picked && picked.size > MAX_ATTACHMENT_BYTES) {
              setError(`El archivo supera los ${formatSize(MAX_ATTACHMENT_BYTES)}.`);
              event.target.value = '';
              setFile(null);
              return;
            }
            setFile(picked);
          }}
        />
      </label>
      <p className="chat-form__file-hint">
        Opcional, hasta 5 MB. Los adjuntos se pueden enviar solo con el primer mensaje.
      </p>

      {error && (
        <p className="chat-form__error" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" loading={start.isPending} block>
        <Send size={16} aria-hidden="true" />
        Enviar consulta
      </Button>
    </form>
  );
}

// ── Hilo ─────────────────────────────────────────────────────

function ChatThread({
  conversation,
  publicToken,
  onRestart,
}: {
  conversation: PublicConversation;
  publicToken: string;
  onRestart: () => void;
}) {
  const send = useSendChatMessage(publicToken);
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const closed = conversation.status === 'closed';

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [conversation.messages.length, publicToken]);

  async function onSend(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim() || closed) {
      return;
    }

    // El error se muestra bajo el composer, no como excepción sin manejar.
    await send.mutateAsync({ body: draft.trim() }).catch(() => undefined);
    setDraft('');
  }

  return (
    <>
      <div className="chat-thread">
        {conversation.messages.map((message) => (
          <ChatBubble key={message.id} message={message} publicToken={publicToken} />
        ))}
        <div ref={endRef} />
      </div>

      {closed ? (
        <div className="chat-closed">
          <p>
            <strong>Cerramos esta conversación.</strong>
            {conversation.closeReason ? ` ${conversation.closeReason}` : null}
          </p>
          <Button variant="secondary" size="sm" onClick={onRestart}>
            Empezar una consulta nueva
          </Button>
        </div>
      ) : (
        <form className="chat-composer" onSubmit={onSend}>
          <Textarea
            label="Responder"
            rows={2}
            value={draft}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="Escribí tu mensaje…"
            onChange={(event) => setDraft(event.target.value)}
          />
          {send.isError && (
            <p className="chat-form__error" role="alert">
              {errorMessage(send.error)}
            </p>
          )}
          <Button
            type="submit"
            loading={send.isPending}
            disabled={!draft.trim()}
            block
          >
            <Send size={16} aria-hidden="true" />
            Enviar
          </Button>
        </form>
      )}
    </>
  );
}

function ChatBubble({
  message,
  publicToken,
}: {
  message: ChatMessage;
  publicToken: string;
}) {
  const mine = message.senderType === 'client';
  return (
    <article className={`chat-msg${mine ? ' chat-msg--mine' : ''}`}>
      <p className="chat-msg__meta">
        <span>{mine ? 'Vos' : (message.senderName ?? 'BackSolutions')}</span>
        <time>{formatDateTime(message.sentAtUtc)}</time>
      </p>
      <p className="chat-msg__body">{message.body}</p>
      {message.hasAttachment && (
        <a
          className="chat-msg__file"
          href={chatApi.attachmentUrl(publicToken, message.id)}
          target="_blank"
          rel="noreferrer"
        >
          <Paperclip size={14} aria-hidden="true" />
          {message.attachmentName ?? 'Adjunto'}
        </a>
      )}
    </article>
  );
}

// ── Widget ───────────────────────────────────────────────────

export function ChatWidget() {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState<SavedChat | null>(readChat);
  // Lo que ya escribió el visitante, para no hacérselo escribir de nuevo al empezar
  // otra consulta.
  const [visitor, setVisitor] = useState<{ name: string; email: string } | null>(() =>
    chat ? { name: chat.name, email: chat.email } : null,
  );
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const token = chat?.publicToken;
  const conversation = usePublicConversation(token, open);

  // Contexto de la página: en la ficha de un lead se puede enganchar la conversación a
  // ese lead, y en la de un servicio se propone el asunto sola.
  const leadToken = useMemo(
    () => (pathname.startsWith('/consulta/') ? pathname.split('/')[2] : undefined),
    [pathname],
  );
  const trackedLead = useTrackedLead(leadToken);
  const leadId = trackedLead.data?.id ?? null;

  const serviceSlug = pathname.startsWith('/services/') ? pathname.split('/')[2] : undefined;
  const currentService = useService(serviceSlug);
  const defaultSubject = currentService.data
    ? `Consulta sobre ${currentService.data.name}`
    : '';

  // Botón "Chatear" en cualquier pantalla.
  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  // Escape cierra y el foco vuelve al lanzador.
  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    panelRef.current?.focus();
  }, [open, chat?.publicToken]);

  // Al abrir el panel, lo que hay hasta ahora queda como leído. Se actualiza el estado
  // local además del storage para que el punto de "respuesta nueva" no vuelva a
  // aparecer al cerrar y abrir de nuevo.
  useEffect(() => {
    const lastMessageAt = open ? conversation.data?.lastMessageAtUtc : undefined;

    if (lastMessageAt) {
      markChatRead(lastMessageAt);
      setChat((current) =>
        current ? { ...current, lastReadAtUtc: lastMessageAt } : current,
      );
    }
  }, [open, conversation.data?.lastMessageAtUtc]);

  // Respuestas del equipo en vivo. El Hub público se autentica con el token del hilo,
  // no con el de sesión: por eso va en la query string y no en `accessTokenFactory`.
  useEffect(() => {
    if (!open || !token) {
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl(token))
      .withAutomaticReconnect()
      .build();

    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.conversation(token) });
    };

// El grupo público solo recibe `messageAdded`: los escalamientos son un asunto interno
    // y el broadcaster nunca los manda a este grupo. El payload se ignora a propósito y se
    // relee el hilo, así el visitante nunca ve un mensaje que el backend no guardó.
    connection.on('messageAdded', refresh);

    void connection.start().catch(() => {
      // Sin Hub sigue el polling cada 10 s: peor la latencia que perder la respuesta.
    });

    return () => {
      connection.off('messageAdded', refresh);
      void connection.stop();
    };
  }, [open, token, queryClient]);

  const lastReadAt = chat?.lastReadAtUtc ?? null;
  const hasUnread = Boolean(
    conversation.data?.messages.some(
      (message) =>
        message.senderType !== 'client' &&
        (lastReadAt === null || message.sentAtUtc > lastReadAt),
    ),
  );

  function onStarted(saved: SavedChat) {
    saveChat(saved);
    setChat(saved);
    setVisitor({ name: saved.name, email: saved.email });
  }

  function onRestart() {
    setVisitor((current) => current ?? (chat ? { name: chat.name, email: chat.email } : null));
    clearChat();
    setChat(null);
    queryClient.removeQueries({ queryKey: chatKeys.conversation(token ?? '') });
  }

  const status = conversation.data?.status;

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className="chat-launcher"
        aria-expanded={open}
        aria-controls="chat-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <MessageCircle size={22} aria-hidden="true" />
        <span className="chat-launcher__label">Consultas</span>
        {!open && hasUnread && (
          <>
            <span className="chat-launcher__dot" aria-hidden="true" />
            <span className="chat-launcher__note">Tenés una respuesta nueva</span>
          </>
        )}
      </button>

      {open && (
        <div
          id="chat-panel"
          ref={panelRef}
          className="chat-panel"
          role="dialog"
          aria-label="Chat con BackSolutions"
          tabIndex={-1}
        >
          <header className="chat-panel__head">
            <div>
              <p className="chat-panel__title">Consultas</p>
              <p className="chat-panel__subtitle">
                {status ? conversationStatusLabels[status] : 'Respuesta del equipo'}
              </p>
            </div>
            <button
              type="button"
              className="chat-panel__close"
              aria-label="Cerrar el chat"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          {!token && (
            <ChatStartForm
              defaults={visitor}
              leadId={leadId}
              defaultSubject={defaultSubject}
              onStarted={onStarted}
            />
          )}

          {token && conversation.isLoading && (
            <div className="chat-panel__loading">
              <Spinner />
            </div>
          )}

          {token && conversation.isError && (
            <div className="chat-panel__error">
              <p>{errorMessage(conversation.error)}</p>
              <Button size="sm" variant="secondary" onClick={onRestart}>
                Empezar una consulta nueva
              </Button>
            </div>
          )}

          {token && conversation.data && (
            <ChatThread
              conversation={conversation.data}
              publicToken={token}
              onRestart={onRestart}
            />
          )}

          {token && conversation.data && conversation.data.messages.length > 1 && (
            <button type="button" className="chat-panel__restart" onClick={onRestart}>
              Empezar una consulta nueva
            </button>
          )}
        </div>
      )}
    </>
  );
}