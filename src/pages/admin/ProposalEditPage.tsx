import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Plus, Trash2 } from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import { adminApi } from '../../features/admin/api';
import {
  useLeads,
  useProposal,
  useSaveProposal,
  useUpdateProposalStatus,
} from '../../features/admin/queries';
import { proposalStatusLabels, proposalStatusOptions, proposalStatusTone } from '../../features/admin/enums';
import type { ProposalStatus } from '../../features/admin/enums';
import { errorMessage } from '../../lib/http';
import { formatCurrency } from '../../lib/format';
import './ProposalEditPage.scss';

type ItemDraft = {
  key: string;
  id: string | null;
  description: string;
  quantity: string;
  unitPrice: string;
  discountPercent: string;
};

function newItem(): ItemDraft {
  return {
    key: crypto.randomUUID(),
    id: null,
    description: '',
    quantity: '1',
    unitPrice: '',
    discountPercent: '',
  };
}

function toNumber(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }

  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

export default function ProposalEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();

  const proposal = useProposal(id);
  const leads = useLeads({ pageSize: 200 });
  const save = useSaveProposal(id);
  const changeStatus = useUpdateProposalStatus(id ?? '');

  const [leadId, setLeadId] = useState('');
  const [title, setTitle] = useState('');
  const [currency, setCurrency] = useState('ARS');
  const [validUntil, setValidUntil] = useState('');
  const [summaryHtml, setSummaryHtml] = useState('');
  const [notesHtml, setNotesHtml] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [items, setItems] = useState<ItemDraft[]>([newItem()]);
  const [status, setStatus] = useState<ProposalStatus>('draft');
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const data = proposal.data;

    if (!data) {
      return;
    }

    setLeadId(data.leadId);
    setTitle(data.title);
    setCurrency(data.currency);
    setValidUntil(data.validUntil ? data.validUntil.slice(0, 10) : '');
    setSummaryHtml(data.summaryHtml);
    setNotesHtml(data.notesHtml ?? '');
    setDiscountAmount(String(data.discountAmount));
    setTaxAmount(String(data.taxAmount));
    setStatus(data.status);
    setItems(
      data.items.length > 0
        ? data.items.map((item) => ({
            key: item.id,
            id: item.id,
            description: item.description,
            quantity: String(item.quantity),
            unitPrice: String(item.unitPrice),
            discountPercent: item.discountPercent === null ? '' : String(item.discountPercent),
          }))
        : [newItem()],
    );
  }, [proposal.data]);

  const editable = isNew || status === 'draft';

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const quantity = toNumber(item.quantity) ?? 0;
      const price = toNumber(item.unitPrice) ?? 0;
      const discount = toNumber(item.discountPercent) ?? 0;
      return sum + quantity * price * (1 - discount / 100);
    }, 0);
    const discount = toNumber(discountAmount) ?? 0;
    const tax = toNumber(taxAmount) ?? 0;

    return { subtotal, total: subtotal - discount + tax };
  }, [items, discountAmount, taxAmount]);

  function updateItem(key: string, patch: Partial<ItemDraft>) {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    );
  }

  async function onSave() {
    setFeedback(null);

    if (!leadId) {
      setFeedback('Elegí un lead.');
      return;
    }

    if (!title.trim()) {
      setFeedback('La propuesta necesita un título.');
      return;
    }

    const payload = {
      leadId,
      title: title.trim(),
      summaryHtml,
      notesHtml: notesHtml.trim() || null,
      currency: currency.trim() || null,
      discountAmount: toNumber(discountAmount) ?? 0,
      taxAmount: toNumber(taxAmount) ?? 0,
      validUntil: validUntil ? `${validUntil}T00:00:00Z` : null,
      items: items
        .filter((item) => item.description.trim())
        .map((item, index) => ({
          id: item.id,
          description: item.description.trim(),
          quantity: toNumber(item.quantity) ?? 0,
          unitPrice: toNumber(item.unitPrice) ?? 0,
          discountPercent: toNumber(item.discountPercent),
          sortOrder: index,
        })),
    };

    try {
      const saved = await save.mutateAsync(payload);
      setFeedback('Propuesta guardada.');
      if (isNew) {
        navigate(`/admin/proposals/${saved.id}`, { replace: true });
      }
    } catch (error) {
      setFeedback(errorMessage(error));
    }
  }

  async function onDownload() {
    if (!id) {
      return;
    }

    setDownloading(true);
    try {
      const blob = await adminApi.downloadProposalPdf(id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${proposal.data?.number ?? 'propuesta'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setFeedback(errorMessage(error));
    } finally {
      setDownloading(false);
    }
  }

  if (!isNew && proposal.isLoading) {
    return <StateBlock variant="loading" />;
  }

  if (!isNew && (proposal.isError || !proposal.data)) {
    return (
      <StateBlock
        variant="error"
        title="No encontramos la propuesta"
        onRetry={() => void proposal.refetch()}
      />
    );
  }

  return (
    <AdminPage
      title={isNew ? 'Nueva propuesta' : `${proposal.data?.number ?? ''} · ${title}`}
      description={
        isNew ? 'Cargá las líneas y el servicio recalcula los totales.' : undefined
      }
      actions={
        <>
          <Button variant="secondary" to="/admin/proposals">
            <ArrowLeft size={16} aria-hidden="true" />
            Volver
          </Button>
          {!isNew && (
            <Button variant="secondary" loading={downloading} onClick={() => void onDownload()}>
              <Download size={16} aria-hidden="true" />
              PDF
            </Button>
          )}
          {editable && (
            <Button loading={save.isPending} onClick={() => void onSave()}>
              Guardar
            </Button>
          )}
        </>
      }
    >
      <Helmet>
        <title>{isNew ? 'Nueva propuesta' : 'Editar propuesta'} · Panel BackSolutions</title>
      </Helmet>

      {feedback && <p className="admin-note">{feedback}</p>}

      {!editable && (
        <p className="admin-note admin-note--warning">
          Esta propuesta ya no está en borrador: sus líneas no se pueden editar, pero sí
          cambiar de estado.
        </p>
      )}

      <div className="proposal-edit">
        <div className="proposal-edit__main">
          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Datos generales</h2>
              {!isNew && (
                <Badge tone={proposalStatusTone[status]}>{proposalStatusLabels[status]}</Badge>
              )}
            </div>
            <div className="panel__body">
              <div className="form-grid form-grid--2">
                <Select
                  label="Lead"
                  required
                  value={leadId}
                  disabled={!editable}
                  onChange={(event) => setLeadId(event.target.value)}
                >
                  <option value="">Elegí un lead…</option>
                  {leads.data?.items.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} · {lead.email}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Título"
                  required
                  value={title}
                  disabled={!editable}
                  onChange={(event) => setTitle(event.target.value)}
                />
                <Input
                  label="Moneda"
                  value={currency}
                  disabled={!editable}
                  onChange={(event) => setCurrency(event.target.value)}
                />
                <Input
                  label="Válida hasta"
                  type="date"
                  value={validUntil}
                  disabled={!editable}
                  onChange={(event) => setValidUntil(event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Líneas</h2>
              {editable && (
                <Button size="sm" variant="secondary" onClick={() => setItems((c) => [...c, newItem()])}>
                  <Plus size={16} aria-hidden="true" />
                  Agregar línea
                </Button>
              )}
            </div>
            <div className="panel__body panel__body--flush">
              <div className="items-editor">
                <div className="items-editor__head">
                  <span>Descripción</span>
                  <span>Cant.</span>
                  <span>Precio</span>
                  <span>Desc. %</span>
                  <span>Importe</span>
                  <span />
                </div>
                {items.map((item) => {
                  const quantity = toNumber(item.quantity) ?? 0;
                  const price = toNumber(item.unitPrice) ?? 0;
                  const discount = toNumber(item.discountPercent) ?? 0;
                  const amount = quantity * price * (1 - discount / 100);

                  return (
                    <div className="items-editor__row" key={item.key}>
                      <input
                        className="input"
                        placeholder="Descripción"
                        value={item.description}
                        disabled={!editable}
                        onChange={(event) =>
                          updateItem(item.key, { description: event.target.value })
                        }
                      />
                      <input
                        className="input"
                        inputMode="decimal"
                        value={item.quantity}
                        disabled={!editable}
                        onChange={(event) => updateItem(item.key, { quantity: event.target.value })}
                      />
                      <input
                        className="input"
                        inputMode="decimal"
                        value={item.unitPrice}
                        disabled={!editable}
                        onChange={(event) => updateItem(item.key, { unitPrice: event.target.value })}
                      />
                      <input
                        className="input"
                        inputMode="decimal"
                        value={item.discountPercent}
                        disabled={!editable}
                        onChange={(event) =>
                          updateItem(item.key, { discountPercent: event.target.value })
                        }
                      />
                      <span className="items-editor__amount">
                        {formatCurrency(amount, currency)}
                      </span>
                      <button
                        type="button"
                        className="items-editor__remove"
                        aria-label="Quitar línea"
                        disabled={!editable}
                        onClick={() =>
                          setItems((current) => current.filter((row) => row.key !== item.key))
                        }
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Textos</h2>
            </div>
            <div className="panel__body form-grid">
              <Textarea
                label="Resumen (HTML)"
                rows={5}
                value={summaryHtml}
                disabled={!editable}
                onChange={(event) => setSummaryHtml(event.target.value)}
              />
              <Textarea
                label="Notas (HTML)"
                rows={4}
                hint="No se muestran al cliente en este formato; quedan en el documento."
                value={notesHtml}
                disabled={!editable}
                onChange={(event) => setNotesHtml(event.target.value)}
              />
            </div>
          </section>
        </div>

        <aside className="proposal-edit__side">
          <section className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Totales</h2>
            </div>
            <div className="panel__body stack">
              <Input
                label="Descuento global"
                inputMode="decimal"
                value={discountAmount}
                disabled={!editable}
                onChange={(event) => setDiscountAmount(event.target.value)}
              />
              <Input
                label="Impuestos"
                inputMode="decimal"
                value={taxAmount}
                disabled={!editable}
                onChange={(event) => setTaxAmount(event.target.value)}
              />
              <dl className="totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatCurrency(totals.subtotal, currency)}</dd>
                </div>
                <div>
                  <dt>Descuento</dt>
                  <dd>-{formatCurrency(toNumber(discountAmount) ?? 0, currency)}</dd>
                </div>
                <div>
                  <dt>Impuestos</dt>
                  <dd>{formatCurrency(toNumber(taxAmount) ?? 0, currency)}</dd>
                </div>
                <div className="totals__grand">
                  <dt>Total</dt>
                  <dd>{formatCurrency(totals.total, currency)}</dd>
                </div>
              </dl>
              <p className="proposal-edit__hint">
                Los importes son orientativos: el servidor recalcula subtotal, descuentos,
                impuestos y total al guardar.
              </p>
            </div>
          </section>

          {!isNew && (
            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">Estado</h2>
              </div>
              <div className="panel__body stack">
                <Select
                  label="Nuevo estado"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as ProposalStatus)}
                >
                  {proposalStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <Textarea
                  label="Motivo"
                  rows={2}
                  hint="Opcional; se registra en el historial."
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
                <Button
                  variant="secondary"
                  loading={changeStatus.isPending}
                  disabled={status === proposal.data?.status}
                  onClick={() =>
                    void (async () => {
                      setFeedback(null);
                      try {
                        await changeStatus.mutateAsync({
                          status,
                          reason: reason.trim() || null,
                        });
                        setFeedback('Estado actualizado.');
                      } catch (error) {
                        setFeedback(errorMessage(error));
                      }
                    })()
                  }
                >
                  Cambiar estado
                </Button>
              </div>
            </section>
          )}
        </aside>
      </div>
    </AdminPage>
  );
}
