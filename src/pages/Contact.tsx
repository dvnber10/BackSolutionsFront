import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHeader } from '../components/ui/PageHeader';
import { Section } from '../components/layout/Section';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Field';
import { useCreateLead, useServices, useSiteSettings } from '../features/content/queries';
import type { CreateLeadRequest, PublicLeadCreated } from '../features/content/types';
import { openChatWidget } from '../features/chat/store';
import { errorMessage } from '../lib/http';
import './Contact.scss';

const schema = z.object({
  name: z.string().trim().min(2, 'Ingresá tu nombre'),
  email: z.string().trim().email('Ingresá un email válido'),
  phone: z.string().trim().optional(),
  serviceId: z.string().optional(),
  budget: z.string().optional(),
  details: z.string().trim().min(10, 'Contanos un poco más sobre el proyecto'),
  // Honeypot: los humanos no lo ven ni lo completan; si viaja con valor, el backend
  // descarta el envío igual respondiendo 201.
  website: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const BUDGETS = [
  { value: 'lt-1000', label: 'Menos de USD 1.000', min: 0, max: 1000 },
  { value: '1000-5000', label: 'USD 1.000 – 5.000', min: 1000, max: 5000 },
  { value: '5000-15000', label: 'USD 5.000 – 15.000', min: 5000, max: 15000 },
  { value: 'gt-15000', label: 'Más de USD 15.000', min: 15000, max: undefined },
  { value: 'unknown', label: 'A definir', min: undefined, max: undefined },
];

export default function Contact() {
  const settings = useSiteSettings();
  const services = useServices();
  const createLead = useCreateLead();
  const [created, setCreated] = useState<PublicLeadCreated | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      serviceId: '',
      budget: '',
      details: '',
      website: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const budget = BUDGETS.find((option) => option.value === values.budget);

    const payload: CreateLeadRequest = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone?.trim() || null,
      serviceId: values.serviceId || null,
      details: values.details.trim(),
      budgetMin: budget?.min ?? null,
      budgetMax: budget?.max ?? null,
      currency: 'USD',
      source: 'web',
      website: values.website ?? '',
    };

    const result = await createLead.mutateAsync(payload);
    setCreated(result);
  });

  const contact = settings.data;

  return (
    <>
      <SEO
        title="Contacto"
        description="Contanos tu proyecto y te devolvemos una propuesta a medida."
        path="/contact"
      />

      <PageHeader
        eyebrow="Contacto"
        title="Hablemos de tu proyecto"
        intro="Completá el formulario y te respondemos a la brevedad. Sin compromiso."
      />

      <Section>
        {created ? (
          <div className="contact-success" role="status">
            <CheckCircle2 className="contact-success__icon" aria-hidden="true" />
            <h2 className="contact-success__title">¡Recibimos tu consulta!</h2>
            <p className="contact-success__text">
              Gracias por escribirnos. Te vamos a contactar al email que nos dejaste.
            </p>
            <p className="contact-success__text">
              Podés seguir el estado de tu consulta y ver las propuestas cuando estén listas.
            </p>
            <div className="contact-success__actions">
              <Button to={`/consulta/${created.publicToken}`}>Seguir mi consulta</Button>
              <Button to="/" variant="secondary">
                Volver al inicio
              </Button>
            </div>
          </div>
        ) : (
          <div className="contact-layout">
            <form className="contact-form" onSubmit={onSubmit} noValidate>
              <div className="contact-form__row">
                <Input
                  label="Nombre"
                  required
                  autoComplete="name"
                  placeholder="Tu nombre"
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="tu@email.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              <div className="contact-form__row">
                <Input
                  label="Teléfono"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+57 3xx ..."
                  error={errors.phone?.message}
                  {...register('phone')}
                />
                <Select label="Servicio de interés" error={errors.serviceId?.message} {...register('serviceId')}>
                  <option value="">No estoy seguro</option>
                  {services.data?.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </Select>
              </div>

              <Select label="Presupuesto estimado" error={errors.budget?.message} {...register('budget')}>
                <option value="">Prefiero no decirlo</option>
                {BUDGETS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>

              <Textarea
                label="Contanos sobre tu proyecto"
                required
                placeholder="Objetivos, plazos, referencias…"
                error={errors.details?.message}
                {...register('details')}
              />

              {/* Honeypot anti-bot: oculto para personas, no para bots. */}
              <div className="contact-form__trap" aria-hidden="true">
                <label htmlFor="website">No completar</label>
                <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
              </div>

              {createLead.isError && (
                <p className="contact-form__error" role="alert">
                  {errorMessage(createLead.error)}
                </p>
              )}

              <Button type="submit" size="lg" loading={isSubmitting || createLead.isPending}>
                Enviar consulta
              </Button>
            </form>

            <aside className="contact-aside">
              <h2 className="contact-aside__title">Otras vías</h2>
              <ul className="contact-aside__list">
                {contact?.contactEmail && (
                  <li>
                    <Mail aria-hidden="true" />
                    <a href={`mailto:${contact.contactEmail}`}>{contact.contactEmail}</a>
                  </li>
                )}
                {contact?.phone && (
                  <li>
                    <Phone aria-hidden="true" />
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  </li>
                )}
                {contact?.whatsApp && (
                  <li>
                    <MessageCircle aria-hidden="true" />
                    <a
                      href={`https://wa.me/${contact.whatsApp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp
                    </a>
                  </li>
                )}
                {contact?.address && (
                  <li>
                    <MapPin aria-hidden="true" />
                    <span>{contact.address}</span>
                  </li>
                )}
              </ul>
              <p className="contact-aside__note">
                Respondemos en horario laboral. Si es urgente, escribinos por WhatsApp.
              </p>
              <div className="contact-aside__chat">
                <p className="contact-aside__chat-text">
                  ¿Preferís chatear? Escribinos por el chat sin completar nada más y te
                  respondemos en el momento.
                </p>
                <Button variant="secondary" onClick={openChatWidget}>
                  <MessageCircle size={16} aria-hidden="true" />
                  Abrir el chat
                </Button>
              </div>
              <Link className="contact-aside__link" to="/services">
                Ver servicios
              </Link>
            </aside>
          </div>
        )}
      </Section>
    </>
  );
}
