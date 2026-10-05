import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { ConfirmButton } from '../../components/admin/ConfirmButton';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import {
  useAdminProject,
  useDeleteProject,
  useSaveProject,
} from '../../features/admin/queries';
import { useAuth } from '../../features/auth/useAuth';
import { isOwner } from '../../features/admin/navigation';
import { contentStatusOptions } from '../../features/admin/enums';
import type { ContentStatus } from '../../features/admin/enums';
import { errorMessage } from '../../lib/http';
import './PortfolioEditPage.scss';

type ImageDraft = { key: string; id: string | null; url: string; altText: string };

function newImage(): ImageDraft {
  return { key: crypto.randomUUID(), id: null, url: '', altText: '' };
}

export default function PortfolioEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const project = useAdminProject(id);
  const save = useSaveProject(id);
  const remove = useDeleteProject();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [descriptionHtml, setDescriptionHtml] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverImageAlt, setCoverImageAlt] = useState('');
  const [clientName, setClientName] = useState('');
  const [techStack, setTechStack] = useState('');
  const [startedOn, setStartedOn] = useState('');
  const [deliveredOn, setDeliveredOn] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [sortOrder, setSortOrder] = useState('0');
  const [images, setImages] = useState<ImageDraft[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const data = project.data;
    if (!data) {
      return;
    }
    setTitle(data.title);
    setSlug(data.slug);
    setSummary(data.summary);
    setDescriptionHtml(data.descriptionHtml ?? '');
    setCoverImageUrl(data.coverImageUrl ?? '');
    setCoverImageAlt(data.coverImageAlt ?? '');
    setClientName(data.clientName ?? '');
    setTechStack(data.techStack.join(', '));
    setStartedOn(data.startedOn ? data.startedOn.slice(0, 10) : '');
    setDeliveredOn(data.deliveredOn ? data.deliveredOn.slice(0, 10) : '');
    setLiveUrl(data.liveUrl ?? '');
    setRepositoryUrl(data.repositoryUrl ?? '');
    setIsFeatured(data.isFeatured);
    setStatus(data.status);
    setSortOrder(String(data.sortOrder));
    setImages(
      data.images.map((image) => ({
        key: image.id,
        id: image.id,
        url: image.url,
        altText: image.altText ?? '',
      })),
    );
  }, [project.data]);

  async function onSave() {
    setFeedback(null);
    if (!title.trim()) {
      setFeedback('El proyecto necesita un título.');
      return;
    }
    if (!summary.trim()) {
      setFeedback('Agregá un resumen.');
      return;
    }

    try {
      await save.mutateAsync({
        slug: slug.trim() || null,
        title: title.trim(),
        summary: summary.trim(),
        descriptionHtml: descriptionHtml.trim() || null,
        coverImageUrl: coverImageUrl.trim() || null,
        coverImageAlt: coverImageAlt.trim() || null,
        clientName: clientName.trim() || null,
        techStack: techStack
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        startedOn: startedOn || null,
        deliveredOn: deliveredOn || null,
        liveUrl: liveUrl.trim() || null,
        repositoryUrl: repositoryUrl.trim() || null,
        isFeatured,
        status,
        sortOrder: Number(sortOrder) || 0,
        images: images
          .filter((image) => image.url.trim())
          .map((image, index) => ({
            id: image.id,
            url: image.url.trim(),
            altText: image.altText.trim() || null,
            sortOrder: index,
          })),
      });
      setFeedback('Proyecto guardado.');
      if (isNew) {
        navigate('/admin/portfolio', { replace: true });
      }
    } catch (error) {
      setFeedback(errorMessage(error));
    }
  }

  if (!isNew && project.isLoading) {
    return <StateBlock variant="loading" />;
  }

  if (!isNew && (project.isError || !project.data)) {
    return (
      <StateBlock
        variant="error"
        title="No encontramos el proyecto"
        onRetry={() => void project.refetch()}
      />
    );
  }

  return (
    <AdminPage
      title={isNew ? 'Nuevo proyecto' : title || 'Proyecto'}
      actions={
        <>
          <Button variant="secondary" to="/admin/portfolio">
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
        <title>{isNew ? 'Nuevo proyecto' : 'Editar proyecto'} · Panel BackSolutions</title>
      </Helmet>

      {feedback && <p className="admin-note">{feedback}</p>}

      <div className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Datos</h2>
        </div>
        <div className="panel__body form-grid form-grid--2">
          <Input label="Título" required value={title} onChange={(event) => setTitle(event.target.value)} />
          <Input
            label="Slug"
            hint="Vacío = se genera del título."
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
          />
          <Input label="Cliente" value={clientName} onChange={(event) => setClientName(event.target.value)} />
          <Input
            label="Stack"
            hint="Separado por coma."
            value={techStack}
            onChange={(event) => setTechStack(event.target.value)}
          />
          <Input
            label="Inicio"
            type="date"
            value={startedOn}
            onChange={(event) => setStartedOn(event.target.value)}
          />
          <Input
            label="Entrega"
            type="date"
            value={deliveredOn}
            onChange={(event) => setDeliveredOn(event.target.value)}
          />
          <Input label="Sitio en vivo" value={liveUrl} onChange={(event) => setLiveUrl(event.target.value)} />
          <Input
            label="Repositorio"
            value={repositoryUrl}
            onChange={(event) => setRepositoryUrl(event.target.value)}
          />
          <Input
            label="Imagen de portada (URL)"
            value={coverImageUrl}
            onChange={(event) => setCoverImageUrl(event.target.value)}
          />
          <Input
            label="Texto alternativo de portada"
            value={coverImageAlt}
            onChange={(event) => setCoverImageAlt(event.target.value)}
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
          <Textarea
            label="Resumen"
            required
            rows={2}
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />
        </div>
        <div className="panel__body">
          <label className="check">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(event) => setIsFeatured(event.target.checked)}
            />
            Proyecto destacado
          </label>
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Descripción</h2>
        </div>
        <div className="panel__body">
          <Textarea
            label="HTML"
            rows={8}
            value={descriptionHtml}
            onChange={(event) => setDescriptionHtml(event.target.value)}
          />
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Galería</h2>
          <Button size="sm" variant="secondary" onClick={() => setImages((c) => [...c, newImage()])}>
            <Plus size={16} aria-hidden="true" />
            Agregar imagen
          </Button>
        </div>
        <div className="panel__body stack">
          {images.length === 0 && <p className="muted">Sin imágenes.</p>}
          {images.map((image) => (
            <div className="image-row" key={image.key}>
              <Input
                label="URL"
                value={image.url}
                onChange={(event) =>
                  setImages((current) =>
                    current.map((row) =>
                      row.key === image.key ? { ...row, url: event.target.value } : row,
                    ),
                  )
                }
              />
              <Input
                label="Texto alternativo"
                value={image.altText}
                onChange={(event) =>
                  setImages((current) =>
                    current.map((row) =>
                      row.key === image.key ? { ...row, altText: event.target.value } : row,
                    ),
                  )
                }
              />
              <button
                type="button"
                className="image-row__remove"
                aria-label="Quitar imagen"
                onClick={() => setImages((current) => current.filter((row) => row.key !== image.key))}
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
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
                  navigate('/admin/portfolio', { replace: true });
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
