import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { ConfirmButton } from '../../components/admin/ConfirmButton';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import {
  useAdminPost,
  useAdminTags,
  useDeletePost,
  useSavePost,
  useUsers,
} from '../../features/admin/queries';
import { useAuth } from '../../features/auth/useAuth';
import { isOwner } from '../../features/admin/navigation';
import { contentStatusOptions } from '../../features/admin/enums';
import type { ContentStatus } from '../../features/admin/enums';
import { errorMessage } from '../../lib/http';
import './BlogEditPage.scss';

export default function BlogEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const post = useAdminPost(id);
  const tags = useAdminTags();
  const users = useUsers({ pageSize: 200, activeOnly: true });
  const save = useSavePost(id);
  const remove = useDeletePost();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverImageAlt, setCoverImageAlt] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [authorId, setAuthorId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const data = post.data;
    if (!data) {
      return;
    }
    setTitle(data.title);
    setSlug(data.slug);
    setExcerpt(data.excerpt ?? '');
    setContentHtml(data.contentHtml);
    setCoverImageUrl(data.coverImageUrl ?? '');
    setCoverImageAlt(data.coverImageAlt ?? '');
    setSeoTitle(data.seoTitle ?? '');
    setSeoDescription(data.seoDescription ?? '');
    setStatus(data.status);
    setAuthorId(data.authorId ?? '');
    setSelectedTags(data.tags);
  }, [post.data]);

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  }

  async function onSave() {
    setFeedback(null);
    if (!title.trim()) {
      setFeedback('El artículo necesita un título.');
      return;
    }
    if (!contentHtml.trim()) {
      setFeedback('El contenido no puede estar vacío.');
      return;
    }

    try {
      await save.mutateAsync({
        slug: slug.trim() || null,
        title: title.trim(),
        excerpt: excerpt.trim() || null,
        contentHtml,
        coverImageUrl: coverImageUrl.trim() || null,
        coverImageAlt: coverImageAlt.trim() || null,
        seoTitle: seoTitle.trim() || null,
        seoDescription: seoDescription.trim() || null,
        status,
        authorId: authorId || null,
        tags: selectedTags,
      });
      setFeedback('Artículo guardado.');
      if (isNew) {
        navigate('/admin/blog', { replace: true });
      }
    } catch (error) {
      setFeedback(errorMessage(error));
    }
  }

  if (!isNew && post.isLoading) {
    return <StateBlock variant="loading" />;
  }

  if (!isNew && (post.isError || !post.data)) {
    return (
      <StateBlock
        variant="error"
        title="No encontramos el artículo"
        onRetry={() => void post.refetch()}
      />
    );
  }

  return (
    <AdminPage
      title={isNew ? 'Nuevo artículo' : title || 'Artículo'}
      actions={
        <>
          <Button variant="secondary" to="/admin/blog">
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
        <title>{isNew ? 'Nuevo artículo' : 'Editar artículo'} · Panel BackSolutions</title>
      </Helmet>

      {feedback && <p className="admin-note">{feedback}</p>}

      <div className="post-edit">
        <div className="post-edit__main">
          <div className="panel">
            <div className="panel__body form-grid form-grid--2">
              <Input label="Título" required value={title} onChange={(event) => setTitle(event.target.value)} />
              <Input
                label="Slug"
                hint="Vacío = se genera del título."
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              />
              <Textarea
                label="Extracto"
                rows={2}
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
              />
            </div>
          </div>

          <div className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Contenido</h2>
            </div>
            <div className="panel__body">
              <Textarea
                label="HTML"
                rows={16}
                value={contentHtml}
                onChange={(event) => setContentHtml(event.target.value)}
              />
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
        </div>

        <aside className="post-edit__side">
          <div className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Publicación</h2>
            </div>
            <div className="panel__body stack">
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
              <Select
                label="Autor"
                value={authorId}
                onChange={(event) => setAuthorId(event.target.value)}
              >
                <option value="">Sin autor</option>
                {users.data?.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.fullName}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Portada</h2>
            </div>
            <div className="panel__body stack">
              <Input
                label="Imagen (URL)"
                value={coverImageUrl}
                onChange={(event) => setCoverImageUrl(event.target.value)}
              />
              <Input
                label="Texto alternativo"
                value={coverImageAlt}
                onChange={(event) => setCoverImageAlt(event.target.value)}
              />
            </div>
          </div>

          <div className="panel">
            <div className="panel__head">
              <h2 className="panel__title">Tags</h2>
            </div>
            <div className="panel__body">
              {tags.data && tags.data.length > 0 ? (
                <div className="tag-picker">
                  {tags.data.map((tag) => (
                    <label className="check" key={tag.id}>
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.name)}
                        onChange={() => toggleTag(tag.name)}
                      />
                      {tag.name}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="muted">No hay tags creados.</p>
              )}
            </div>
          </div>
        </aside>
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
                  navigate('/admin/blog', { replace: true });
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
