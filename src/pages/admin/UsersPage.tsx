import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { Pagination } from '../../components/admin/Pagination';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StateBlock } from '../../components/ui/StateBlock';
import { useUsers } from '../../features/admin/queries';
import type { UserListItem } from '../../features/admin/types';
import { formatDateTime } from '../../lib/format';

const PAGE_SIZE = 20;

export default function UsersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useUsers({ page, pageSize: PAGE_SIZE });

  const columns: Column<UserListItem>[] = [
    {
      key: 'user',
      header: 'Usuario',
      render: (user) => (
        <div>
          <strong>{user.fullName}</strong>
          <div className="muted">{user.email}</div>
        </div>
      ),
    },
    {
      key: 'roles',
      header: 'Roles',
      render: (user) => (
        <div className="role-list">
          {user.roles.length === 0 ? (
            <span className="muted">—</span>
          ) : (
            user.roles.map((role) => (
              <Badge key={role} tone="neutral">
                {role}
              </Badge>
            ))
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (user) =>
        user.isLockedOut ? (
          <Badge tone="danger">Bloqueado</Badge>
        ) : user.isActive ? (
          <Badge tone="success">Activo</Badge>
        ) : (
          <Badge tone="neutral">Inactivo</Badge>
        ),
    },
    {
      key: 'load',
      header: 'Carga',
      align: 'center',
      render: (user) => `${user.assignedLeads} leads · ${user.openConversations} chats`,
    },
    {
      key: 'lastLogin',
      header: 'Último acceso',
      render: (user) => formatDateTime(user.lastLoginAtUtc) || '—',
    },
  ];

  return (
    <AdminPage
      title="Usuarios"
      description="Equipo con acceso al panel."
      actions={
        <Button to="/admin/users/new">
          <Plus size={16} aria-hidden="true" />
          Nuevo usuario
        </Button>
      }
    >
      <Helmet>
        <title>Usuarios · Panel BackSolutions</title>
      </Helmet>

      {isLoading && <StateBlock variant="loading" />}
      {isError && (
        <StateBlock
          variant="error"
          message="No pudimos cargar los usuarios."
          onRetry={() => void refetch()}
        />
      )}
      {data && data.items.length === 0 && <StateBlock variant="empty" title="No hay usuarios" />}
      {data && data.items.length > 0 && (
        <>
          <DataTable
            columns={columns}
            rows={data.items}
            rowKey={(user) => user.id}
            onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
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
    </AdminPage>
  );
}
