import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Tags } from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { Pagination } from '../../components/admin/Pagination';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import { useAdminPosts } from '../../features/admin/queries';
import { contentStatusLabels, contentStatusOptions, contentStatusTone, withAll } from '../../features/admin/enums';
import type { AdminBlogPost } from '../../features/admin/types';
import { formatDate } from '../../lib/format';

const PAGE_SIZE = 20;

export default function BlogPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');

  const { data, isLoading, isError, refetch } = useAdminPosts({
    page,
    pageSize: PAGE_SIZE,
    status: status === 'all' ? undefined : status,
  });

  const columns: Column<AdminBlogPost>[] = [
    {
      key: 'title',
      header: 'Artículo',
      render: (post) => (
        <div>
          <strong>{post.title}</strong>
          <div className="muted">{post.slug}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (post) => (
        <Badge tone={contentStatusTone[post.status]}>{contentStatusLabels[post.status]}</Badge>
      ),
    },
    { key: 'views', header: 'Vistas', align: 'center', render: (post) => post.viewCount },
    {
      key: 'published',
      header: 'Publicado',
      render: (post) => formatDate(post.publishedAtUtc) || '—',
    },
    {
      key: 'author',
      header: 'Autor',
      render: (post) => post.authorName ?? <span className="muted">—</span>,
    },
  ];

  return (
    <AdminPage
      title="Blog"
      description="Artículos publicados en el sitio."
      actions={
        <>
          <Button variant="secondary" to="/admin/blog/tags">
            <Tags size={16} aria-hidden="true" />
            Tags
          </Button>
          <Button to="/admin/blog/new">
            <Plus size={16} aria-hidden="true" />
            Nuevo artículo
          </Button>
        </>
      }
    >
      <Helmet>
        <title>Blog · Panel BackSolutions</title>
      </Helmet>

      <div className="panel">
        <div className="panel__body">
          <div className="filters">
            <Select
              label="Estado"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              {withAll(contentStatusOptions).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {isLoading && <StateBlock variant="loading" />}
      {isError && (
        <StateBlock
          variant="error"
          message="No pudimos cargar los artículos."
          onRetry={() => void refetch()}
        />
      )}
      {data && data.items.length === 0 && (
        <StateBlock variant="empty" title="No hay artículos con estos filtros" />
      )}
      {data && data.items.length > 0 && (
        <>
          <DataTable
            columns={columns}
            rows={data.items}
            rowKey={(post) => post.id}
            onRowClick={(post) => navigate(`/admin/blog/${post.id}`)}
          />
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            totalCount={data.totalCount}
            hasPrevious={data.hasPrevious}
            hasNext={data.hasNext}
            onPage={setPage}
          />
        </>
      )}

      <p className="muted">
        Los tags se administran aparte: <Link to="/admin/blog/tags">gestionar tags</Link>.
      </p>
    </AdminPage>
  );
}
