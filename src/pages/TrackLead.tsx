import { useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHeader } from '../components/ui/PageHeader';
import { Section } from '../components/layout/Section';
import { StateBlock } from '../components/ui/StateBlock';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useTrackedLead } from '../features/content/queries';
import { formatCurrency, formatDate } from '../lib/format';
import type { LeadStatus } from '../features/content/types';
import './TrackLead.scss';

const LEAD_STATUS: Record<LeadStatus, { label: string; tone: 'info' | 'warning' | 'accent' | 'success' | 'neutral' }> = {
  new: { label: 'Recibida', tone: 'info' },
  inReview: { label: 'En revisión', tone: 'warning' },
  quoteSent: { label: 'Propuesta enviada', tone: 'accent' },
  won: { label: 'Aceptada', tone: 'success' },
  lost: { label: 'No avanzó', tone: 'neutral' },
  spam: { label: 'Descartada', tone: 'neutral' },
  archived: { label: 'Archivada', tone: 'neutral' },
};

const PROPOSAL_STATUS: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  viewed: 'Vista',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  expired: 'Vencida',
};

export default function TrackLead() {
  const { token } = useParams<{ token: string }>();
  const lead = useTrackedLead(token);

  if (lead.isLoading) {
    return (
      <Section>
        <StateBlock variant="loading" message="Buscando tu consulta…" />
      </Section>
    );
  }

  if (lead.isError || !lead.data) {
    return (
      <Section>
        <StateBlock
          variant="error"
          title="No encontramos esta consulta"
          message="El enlace puede ser inválido o haber vencido. Si necesitás ayuda, escribinos."
          action={
            <Button to="/contact" variant="secondary">
              Contactanos
            </Button>
          }
        />
      </Section>
    );
  }

  const data = lead.data;
  const status = LEAD_STATUS[data.status];

  return (
    <>
      <SEO title="Mi consulta" description="Seguimiento de tu consulta." path={`/consulta/${token}`} noIndex />

      <PageHeader
        eyebrow="Seguimiento"
        title={`Hola, ${data.name}`}
        intro="Acá podés ver el estado de tu consulta y las propuestas que te enviamos."
      />

      <Section>
        <div className="track">
          <div className="track__summary">
            <div className="track__field">
              <span className="track__label">Estado</span>
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>
            <div className="track__field">
              <span className="track__label">Fecha de envío</span>
              <span>{formatDate(data.createdAtUtc)}</span>
            </div>
            {data.targetStartDate && (
              <div className="track__field">
                <span className="track__label">Inicio deseado</span>
                <span>{formatDate(data.targetStartDate)}</span>
              </div>
            )}
          </div>

          <div className="track__proposals">
            <h2 className="track__subtitle">Propuestas</h2>

            {data.proposals.length === 0 ? (
              <p className="track__empty">
                Todavía no hay propuestas. Te avisaremos cuando estén listas.
              </p>
            ) : (
              <ul className="track__list">
                {data.proposals.map((proposal) => (
                  <li className="proposal" key={proposal.id}>
                    <div className="proposal__main">
                      <p className="proposal__number">#{proposal.number}</p>
                      <h3 className="proposal__title">{proposal.title}</h3>
                      <p className="proposal__meta">
                        <span>{PROPOSAL_STATUS[proposal.status] ?? proposal.status}</span>
                        {proposal.validUntil && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Válida hasta {formatDate(proposal.validUntil)}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="proposal__aside">
                      <strong className="proposal__amount">
                        {formatCurrency(proposal.totalAmount, proposal.currency)}
                      </strong>
                      {proposal.pdfUrl && (
                        <Button href={proposal.pdfUrl} target="_blank" rel="noreferrer" variant="secondary" size="sm">
                          <FileText size={16} aria-hidden="true" />
                          Ver PDF
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
