import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, KeyRound, LockOpen } from 'lucide-react';
import { AdminPage } from '../../components/admin/AdminPage';
import { ConfirmButton } from '../../components/admin/ConfirmButton';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Field';
import { StateBlock } from '../../components/ui/StateBlock';
import {
  useAssignRoles,
  useCreateUser,
  useDeactivateUser,
  useResetPassword,
  useRoles,
  useUnlockUser,
  useUpdateUser,
  useUser,
} from '../../features/admin/queries';
import { errorMessage } from '../../lib/http';
import { formatDateTime } from '../../lib/format';
import './UserEditPage.scss';

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();

  const user = useUser(id);
  const roles = useRoles();
  const create = useCreateUser();
  const update = useUpdateUser();
  const assignRoles = useAssignRoles();
  const unlock = useUnlockUser();
  const resetPassword = useResetPassword();
  const deactivate = useDeactivateUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const data = user.data;
    if (!data) {
      return;
    }
    setEmail(data.email);
    setFullName(data.fullName);
    setAvatarUrl(data.avatarUrl ?? '');
    setIsActive(data.isActive);
    setSelectedRoles(data.roles);
  }, [user.data]);

  function toggleRole(role: string) {
    setSelectedRoles((current) =>
      current.includes(role) ? current.filter((item) => item !== role) : [...current, role],
    );
  }

  async function onCreate() {
    setFeedback(null);
    if (!email.trim() || !fullName.trim()) {
      setFeedback('Completá email y nombre.');
      return;
    }
    if (password.length < 8) {
      setFeedback('La contraseña necesita al menos 8 caracteres.');
      return;
    }
    if (selectedRoles.length === 0) {
      setFeedback('Elegí al menos un rol.');
      return;
    }
    try {
      await create.mutateAsync({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        roles: selectedRoles,
        phone: phone.trim() || null,
        avatarUrl: avatarUrl.trim() || null,
        mustChangePassword,
      });
      setPassword('');
      setFeedback('Usuario creado.');
    } catch (error) {
      setFeedback(errorMessage(error));
    }
  }

  async function onUpdate() {
    setFeedback(null);
    try {
      await update.mutateAsync({
        id: id as string,
        body: {
          fullName: fullName.trim(),
          avatarUrl: avatarUrl.trim() || null,
          isActive,
        },
      });
      setFeedback('Usuario actualizado.');
    } catch (error) {
      setFeedback(errorMessage(error));
    }
  }

  async function onSaveRoles() {
    setFeedback(null);
    try {
      await assignRoles.mutateAsync({ id: id as string, body: { roles: selectedRoles } });
      setFeedback('Roles actualizados.');
    } catch (error) {
      setFeedback(errorMessage(error));
    }
  }

  if (!isNew && user.isLoading) {
    return <StateBlock variant="loading" />;
  }

  if (!isNew && (user.isError || !user.data)) {
    return (
      <StateBlock
        variant="error"
        title="No encontramos el usuario"
        onRetry={() => void user.refetch()}
      />
    );
  }

  return (
    <AdminPage
      title={isNew ? 'Nuevo usuario' : fullName || 'Usuario'}
      description={isNew ? undefined : user.data?.email}
      actions={
        <Button variant="secondary" to="/admin/users">
          <ArrowLeft size={16} aria-hidden="true" />
          Volver
        </Button>
      }
    >
      <Helmet>
        <title>{isNew ? 'Nuevo usuario' : 'Editar usuario'} · Panel BackSolutions</title>
      </Helmet>

      {feedback && <p className="admin-note">{feedback}</p>}

      <div className="panel">
        <div className="panel__head">
          <h2 className="panel__title">{isNew ? 'Datos de acceso' : 'Datos'}</h2>
        </div>
        <div className="panel__body form-grid form-grid--2">
          {isNew ? (
            <Input
              label="Email"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          ) : (
            <div className="user-edit__static">
              <span className="muted">Email</span>
              <strong>{user.data?.email}</strong>
            </div>
          )}
          <Input
            label="Nombre completo"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          <Input
            label="Teléfono"
            hint={isNew ? undefined : 'El endpoint de detalle no lo expone: se define al crear.'}
            value={phone}
            disabled={!isNew}
            onChange={(event) => setPhone(event.target.value)}
          />
          <Input
            label="Avatar (URL)"
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
          />
          {isNew && (
            <>
              <Input
                label="Contraseña"
                required
                type="password"
                hint="Mínimo 8 caracteres."
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <label className="check">
                <input
                  type="checkbox"
                  checked={mustChangePassword}
                  onChange={(event) => setMustChangePassword(event.target.checked)}
                />
                Pedir cambio de contraseña en el primer acceso
              </label>
            </>
          )}
        </div>
        {!isNew && (
          <div className="panel__body">
            <label className="check">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
              />
              Usuario activo
            </label>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Roles</h2>
        </div>
        <div className="panel__body stack">
          {roles.isLoading && <StateBlock variant="loading" />}
          {roles.data &&
            roles.data.map((role) => (
              <label className="check" key={role.id}>
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.name)}
                  onChange={() => toggleRole(role.name)}
                />
                <span>
                  <strong>{role.name}</strong> — {role.description}
                  {role.isSystem ? '' : ' (personalizado)'}
                </span>
              </label>
            ))}
          <div>
            {isNew ? (
              <Button loading={create.isPending} disabled={!fullName.trim() || !email.trim()} onClick={() => void onCreate()}>
                Crear usuario
              </Button>
            ) : (
              <Button loading={update.isPending} onClick={() => void onUpdate()}>
                Guardar datos
              </Button>
            )}
          </div>
          {!isNew && (
            <Button
              variant="secondary"
              loading={assignRoles.isPending}
              onClick={() => void onSaveRoles()}
            >
              Guardar roles
            </Button>
          )}
        </div>
      </div>

      {!isNew && (
        <div className="panel">
          <div className="panel__head">
            <h2 className="panel__title">Seguridad</h2>
          </div>
          <div className="panel__body stack">
            <div className="user-edit__meta">
              <Badge tone={user.data?.isLockedOut ? 'danger' : 'success'}>
                {user.data?.isLockedOut ? 'Bloqueado' : 'Desbloqueado'}
              </Badge>
              <span className="muted">
                Último acceso: {formatDateTime(user.data?.lastLoginAtUtc) || 'nunca'}
              </span>
            </div>
            <div>
              <Button
                variant="secondary"
                loading={unlock.isPending}
                disabled={!user.data?.isLockedOut}
                onClick={() =>
                  void (async () => {
                    setFeedback(null);
                    try {
                      await unlock.mutateAsync(id as string);
                      setFeedback('Usuario desbloqueado.');
                    } catch (error) {
                      setFeedback(errorMessage(error));
                    }
                  })()
                }
              >
                <LockOpen size={16} aria-hidden="true" />
                Desbloquear
              </Button>
            </div>
            <Input
              label="Nueva contraseña"
              type="password"
              hint="Mínimo 8 caracteres."
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <div>
              <Button
                loading={resetPassword.isPending}
                disabled={newPassword.length < 8}
                onClick={() =>
                  void (async () => {
                    setFeedback(null);
                    try {
                      await resetPassword.mutateAsync({
                        id: id as string,
                        body: { newPassword, mustChangePassword: true },
                      });
                      setNewPassword('');
                      setFeedback('Contraseña restablecida.');
                    } catch (error) {
                      setFeedback(errorMessage(error));
                    }
                  })()
                }
              >
                <KeyRound size={16} aria-hidden="true" />
                Restablecer contraseña
              </Button>
            </div>
            <div className="row-actions">
              <ConfirmButton
                label="Desactivar usuario"
                confirmLabel="Confirmar baja"
                loading={deactivate.isPending}
                onConfirm={() =>
                  void (async () => {
                    setFeedback(null);
                    try {
                      await deactivate.mutateAsync(id as string);
                      navigate('/admin/users', { replace: true });
                    } catch (error) {
                      setFeedback(errorMessage(error));
                    }
                  })()
                }
              />
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}