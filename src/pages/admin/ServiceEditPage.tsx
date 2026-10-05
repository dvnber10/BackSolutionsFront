import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { ConfirmButton } from '../../components/admin/ConfirmButton';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import { useAdminService, useDeleteService, useSaveService } from '../../features/admin/queries';
import { useAuth } from '../../features/auth/useAuth';
import { isOwner } from '../../features/admin/navigation';
import { contentStatusOptions } from '../../features/admin/enums';
import type { ContentStatus } from '../../features/admin/enums';
import { errorMessage } from '../../lib/http';

function toNumber(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

export default function ServiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const service = useAdminService(id);
  const save = useSaveService(id);
  const remove = useDeleteService();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [priceNote, setPriceNote] = useState('');
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [sortOrder, setSortOrder] = useState('0');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const data = service.data;
    if (!data) {
      return;
    }
    setName(data.name);
    setSlug(data.slug);
    setShortDescription(data.shortDescription);
    setFullDescription(data.fullDescription ?? '');
    setIcon(data.icon ?? '');
    setImageUrl(data.imageUrl ?? '');
    setTechnologies(data.technologies.join(', '));
    setBasePrice(data.basePrice === null ? '' : String(data.basePrice));
    setPriceNote(data.priceNote ?? '');
    setStatus(data.status);
    setSortOrder(String(data.sortOrder));
  }, [service.data]);

  async function onSave() {
    setFeedback(null);
    if (!name.trim()) {
      setFeedback('El servicio necesita un nombre.');
      return;
    }
    if (!shortDescription.trim()) {
      setFeedback('Agregá una descripción corta.');
      return;
    }

    try {
      await save.mutateAsync({
        slug: slug.trim() || null,
        name: name.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim() || null,
        icon: icon.trim() || null,
        imageUrl: imageUrl.trim() || null,
        technologies: technologies
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        basePrice: toNumber(basePrice),
        priceNote: priceNote.trim() || null,
        status,
        sortOrder: toNumber(sortOrder) ?? 0,
      });
      setFeedback('Servicio guardado.');
      if (isNew) {
        navigate('/admin/services', { replace: true });
      }
    } catch (error) {
      setFeedback(errorMessage(error));
    }
  }

  if (!isNew && service.isLoading) {
    return <StateBlock variant="loading" />;
  }

  if (!isNew && (service.isError || !service.data)) {
    return (
      <StateBlock
        variant="error"
        title="No encontramos el servicio"
        onRetry={() => void service.refetch()}
      />
    );
  }

  return (
    <AdminPage
      title={isNew ? 'Nuevo servicio' : name || 'Servicio'}
      actions={
        <>
          <Button variant="secondary" to="/admin/services">
            <ArrowLeft size={16} aria-hidden="true" />
            Volver
          </Button>
          <Button loading={save.isPending} onClick={() => void onSave()}>
            Guardar
          </Button>
        </>
      }
    >
      <Helmet>
        <title>{isNew ? 'Nuevo servicio' : 'Editar servicio'} · Panel BackSolutions</title>
      </Helmet>

      {feedback && <p className="admin-note">{feedback}</p>}

      <div className="panel">
        <div className="panel__body form-grid form-grid--2">
          <Input label="Nombre" required value={name} onChange={(event) => setName(event.target.value)} />
          <Input
            label="Slug"
            hint="Vacío = se genera del nombre."
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
          />
          <Textarea
            label="Descripción corta"
            required
            rows={2}
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
          />
          <Input label="Ícono" hint="Nombre de ícono Lucide." value={icon} onChange={(event) => setIcon(event.target.value)} />
          <Input
            label="Imagen (URL)"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
          <Input
            label="Tecnologías"
            hint="Separadas por coma."
            value={technologies}
            onChange={(event) => setTechnologies(event.target.value)}
          />
          <Input
            label="Precio base"
            inputMode="decimal"
            value={basePrice}
            onChange={(event) => setBasePrice(event.target.value)}
          />
          <Input
            label="Nota de precio"
            value={priceNote}
            onChange={(event) => setPriceNote(event.target.value)}
          />
          <Select
            label="Estado"
            value={status}
            onChange={(event) => setStatus(event.target.value as ContentStatus)}
          >
            {contentStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input
            label="Orden"
            inputMode="numeric"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          />
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Descripción completa</h2>
        </div>
        <div className="panel__body">
          <Textarea
            label="HTML"
            rows={10}
            value={fullDescription}
            onChange={(event) => setFullDescription(event.target.value)}
          />
        </div>
      </div>

      {!isNew && isOwner(user) && (
        <div className="row-actions">
          <ConfirmButton
            loading={remove.isPending}
            onConfirm={() =>
              void (async () => {
                setFeedback(null);
                try {
                  await remove.mutateAsync(id as string);
                  navigate('/admin/services', { replace: true });
                } catch (error) {
                  setFeedback(errorMessage(error));
                }
              })()
            }
          />
        </div>
      )}
    </AdminPage>
  );
}
