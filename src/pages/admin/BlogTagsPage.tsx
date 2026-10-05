import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Plus } from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { ConfirmButton } from '../../components/admin/ConfirmButton';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import {
  useAdminTags,
  useDeleteTag,
  useSaveTag,
} from '../../features/admin/queries';
import { useAuth } from '../../features/auth/useAuth';
import { isOwner } from '../../features/admin/navigation';
import type { Tag } from '../../features/admin/types';
import { errorMessage } from '../../lib/http';
import './BlogTagsPage.scss';

function TagRow({ tag }: { tag: Tag }) {
  const save = useSaveTag();
  const remove = useDeleteTag();
  const { user } = useAuth();
  const [name, setName] = useState(tag.name);
  const [slug, setSlug] = useState(tag.slug);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setName(tag.name);
    setSlug(tag.slug);
  }, [tag]);

  const dirty = name !== tag.name || slug !== tag.slug;

  return (
    <div className="tag-row">
      <Input label="Nombre" value={name} onChange={(event) => setName(event.target.value)} />
      <Input
        label="Slug"
        hint="Vacío = se genera del nombre."
        value={slug}
        onChange={(event) => setSlug(event.target.value)}
      />
      <div className="tag-row__actions">
        <Button
          size="sm"
          variant="secondary"
          loading={save.isPending}
          disabled={!dirty || !name.trim()}
          onClick={() =>
            void (async () => {
              setFeedback(null);
              try {
                await save.mutateAsync({
                  id: tag.id,
                  body: { name: name.trim(), slug: slug.trim() || null },
                });
              } catch (error) {
                setFeedback(errorMessage(error));
              }
            })()
          }
        >
          Guardar
        </Button>
        {isOwner(user) && (
          <ConfirmButton
            loading={remove.isPending}
            onConfirm={() => void remove.mutateAsync(tag.id)}
          />
        )}
      </div>
      {feedback && <p className="tag-row__feedback">{feedback}</p>}
    </div>
  );
}

export default function BlogTagsPage() {
  const tags = useAdminTags();
  const save = useSaveTag();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  async function onCreate() {
    setFeedback(null);
    if (!name.trim()) {
      setFeedback('El tag necesita un nombre.');
      return;
    }
    try {
      await save.mutateAsync({ body: { name: name.trim(), slug: slug.trim() || null } });
      setName('');
      setSlug('');
    } catch (error) {
      setFeedback(errorMessage(error));
    }
  }

  return (
    <AdminPage
      title="Tags del blog"
      description="Categorías reutilizables para los artículos."
      actions={
        <Button variant="secondary" to="/admin/blog">
          <ArrowLeft size={16} aria-hidden="true" />
          Volver
        </Button>
      }
    >
      <Helmet>
        <title>Tags del blog · Panel BackSolutions</title>
      </Helmet>

      {feedback && <p className="admin-note">{feedback}</p>}

      <div className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Nuevo tag</h2>
        </div>
        <div className="panel__body tag-create">
          <Input label="Nombre" value={name} onChange={(event) => setName(event.target.value)} />
          <Input
            label="Slug"
            hint="Opcional."
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
          />
          <Button loading={save.isPending} disabled={!name.trim()} onClick={() => void onCreate()}>
            <Plus size={16} aria-hidden="true" />
            Crear
          </Button>
        </div>
      </div>

      {tags.isLoading && <StateBlock variant="loading" />}
      {tags.isError && (
        <StateBlock
          variant="error"
          message="No pudimos cargar los tags."
          onRetry={() => void tags.refetch()}
        />
      )}
      {tags.data && tags.data.length === 0 && (
        <StateBlock variant="empty" title="Todavía no hay tags" />
      )}
      {tags.data && tags.data.length > 0 && (
        <div className="panel">
          <div className="panel__body stack">
            {tags.data.map((tag) => (
              <TagRow key={tag.id} tag={tag} />
            ))}
          </div>
        </div>
      )}
    </AdminPage>
  );
}
