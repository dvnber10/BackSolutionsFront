import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { ConfirmButton } from '../../components/admin/ConfirmButton';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import { useAdminPage, useDeletePage, useSavePage } from '../../features/admin/queries';
import { useAuth } from '../../features/auth/useAuth';
import { isOwner } from '../../features/admin/navigation';
import {
  contentStatusOptions,
  pageSectionTypeLabels,
  pageSectionTypeOptions,
} from '../../features/admin/enums';
import type { ContentStatus, PageSectionType } from '../../features/admin/enums';
import { errorMessage } from '../../lib/http';
import './PageEditPage.scss';

type SectionDraft = {
  key: string;
  id: string | null;
  type: PageSectionType;
  title: string;
  subtitle: string;
  isVisible: boolean;
  contentText: string;
};

function newSection(): SectionDraft {
  return {
    key: crypto.randomUUID(),
    id: null,
    type: 'richText',
    title: '',
    subtitle: '',
    isVisible: true,
    contentText: '{\n  \n}',
  };
}

export default function PageEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const page = useAdminPage(id);
  const save = useSavePage(id);
  const remove = useDeletePage();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [eyebrow, setEyebrow] = useState('');
  const [intro, setIntro] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [showInNavigation, setShowInNavigation] = useState(false);
  const [sortOrder, setSortOrder] = useState('0');
  const [sections, setSections] = useState<SectionDraft[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const data = page.data;
    if (!data) {
      return;
    }
    setTitle(data.title);
    setSlug(data.slug);
    setEyebrow(data.eyebrow ?? '');
    setIntro(data.intro ?? '');
    setSeoTitle(data.seoTitle ?? '');
    setSeoDescription(data.seoDescription ?? '');
    setOgImageUrl(data.ogImageUrl ?? '');
    setStatus(data.status);
    setShowInNavigation(data.showInNavigation);
    setSortOrder(String(data.sortOrder));
    setSections(
      data.sections.map((section) => ({
        key: section.id,
        id: section.id,
        type: section.type,
        title: section.title ?? '',
        subtitle: section.subtitle ?? '',
        isVisible: section.isVisible,
        contentText: JSON.stringify(section.content ?? {}, null, 2),
      })),
    );
  }, [page.data]);

  function updateSection(key: string, patch: Partial<SectionDraft>) {
    setSections((current) =>
      current.map((section) => (section.key === key ? { ...section, ...patch } : section)),
    );
  }

  function moveSection(index: number, direction: -1 | 1) {
    setSections((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) {
        return current;
      }
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function onSave() {
    setFeedback(null);
    if (!title.trim()) {
      setFeedback('La página necesita un título.');
      return;
    }

    const parsedSections = [];
    for (const section of sections) {
      let content: unknown;
      try {
        content = section.contentText.trim() ? JSON.parse(section.contentText) : null;
      } catch {
        setFeedback(
          `El contenido de la sección "${section.title || pageSectionTypeLabels[section.type]}" no es JSON válido.`,
        );
        return;
      }
      parsedSections.push({
        id: section.id,
        type: section.type,
        title: section.title.trim() || null,
        subtitle: section.subtitle.trim() || null,
        content,
        sortOrder: parsedSections.length,
        isVisible: section.isVisible,
      });
    }

    try {
      await save.mutateAsync({
        slug: slug.trim() || null,
        title: title.trim(),
        eyebrow: eyebrow.trim() || null,
        intro: intro.trim() || null,
        seoTitle: seoTitle.trim() || null,
        seoDescription: seoDescription.trim() || null,
        ogImageUrl: ogImageUrl.trim() || null,
        status,
        showInNavigation,
        sortOrder: Number(sortOrder) || 0,
        sections: parsedSections,
      });
      setFeedback('Página guardada.');
      if (isNew) {
        navigate('/admin/pages', { replace: true });
      }
    } catch (error) {
      setFeedback(errorMessage(error));
    }
  }

  if (!isNew && page.isLoading) {
    return <StateBlock variant="loading" />;
  }

  if (!isNew && (page.isError || !page.data)) {
    return (
      <StateBlock
        variant="error"
        title="No encontramos la página"
        onRetry={() => void page.refetch()}
      />
    );
  }

  return (
    <AdminPage
      title={isNew ? 'Nueva página' : title || 'Página'}
      actions={
        <>
          <Button variant="secondary" to="/admin/pages">
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
        <title>{isNew ? 'Nueva página' : 'Editar página'} · Panel BackSolutions</title>
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
          <Input label="Volanta" value={eyebrow} onChange={(event) => setEyebrow(event.target.value)} />
          <Input label="Orden" inputMode="numeric" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} />
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
          <Input label="Imagen OG (URL)" value={ogImageUrl} onChange={(event) => setOgImageUrl(event.target.value)} />
          <Textarea
            label="Introducción"
            rows={2}
            value={intro}
            onChange={(event) => setIntro(event.target.value)}
          />
        </div>
        <div className="panel__body">
          <label className="check">
            <input
              type="checkbox"
              checked={showInNavigation}
              onChange={(event) => setShowInNavigation(event.target.checked)}
            />
            Mostrar en el menú del sitio
          </label>
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <h2 className="panel__title">SEO</h2>
        </div>
        <div className="panel__body form-grid">
          <Input label="Título SEO" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} />
          <Textarea
            label="Descripción SEO"
            rows={3}
            value={seoDescription}
            onChange={(event) => setSeoDescription(event.target.value)}
          />
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Secciones</h2>
          <Button size="sm" variant="secondary" onClick={() => setSections((c) => [...c, newSection()])}>
            <Plus size={16} aria-hidden="true" />
            Agregar sección
          </Button>
        </div>
        <div className="panel__body stack">
          {sections.length === 0 && <p className="muted">Sin secciones.</p>}
          {sections.map((section, index) => (
            <article className="section-editor" key={section.key}>
              <header className="section-editor__head">
                <Select
                  label="Tipo"
                  value={section.type}
                  onChange={(event) =>
                    updateSection(section.key, { type: event.target.value as PageSectionType })
                  }
                >
                  {pageSectionTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Título"
                  value={section.title}
                  onChange={(event) => updateSection(section.key, { title: event.target.value })}
                />
                <Input
                  label="Subtítulo"
                  value={section.subtitle}
                  onChange={(event) => updateSection(section.key, { subtitle: event.target.value })}
                />
                <div className="section-editor__controls">
                  <button
                    type="button"
                    aria-label="Subir"
                    disabled={index === 0}
                    onClick={() => moveSection(index, -1)}
                  >
                    <ArrowUp size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Bajar"
                    disabled={index === sections.length - 1}
                    onClick={() => moveSection(index, 1)}
                  >
                    <ArrowDown size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Quitar"
                    onClick={() =>
                      setSections((current) => current.filter((row) => row.key !== section.key))
                    }
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </header>
              <label className="check">
                <input
                  type="checkbox"
                  checked={section.isVisible}
                  onChange={(event) =>
                    updateSection(section.key, { isVisible: event.target.checked })
                  }
                />
                Visible
              </label>
              <Textarea
                label="Contenido (JSON)"
                rows={6}
                value={section.contentText}
                onChange={(event) =>
                  updateSection(section.key, { contentText: event.target.value })
                }
              />
            </article>
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
                  navigate('/admin/pages', { replace: true });
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
