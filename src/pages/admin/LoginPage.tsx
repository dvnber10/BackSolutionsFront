import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Field';
import { Logo } from '../../components/layout/Logo';
import { errorMessage } from '../../lib/http';
import { useAuth } from '../../features/auth/useAuth';
import './LoginPage.scss';

const schema = z.object({
  email: z.string().min(1, 'Ingresá tu correo.').email('Correo inválido.'),
  password: z.string().min(1, 'Ingresá tu contraseña.'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (status === 'authenticated') {
      navigate(from, { replace: true });
    }
  }, [status, from, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root');

    try {
      await login(values.email.trim(), values.password);
      navigate(from, { replace: true });
    } catch (error) {
      setError('root', { message: errorMessage(error) });
    }
  });

  return (
    <div className="login">
      <Helmet>
        <title>Acceso · Panel BackSolutions</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="login__panel">
        <div className="login__brand">
          <Logo />
        </div>
        <h1 className="login__title">Panel de administración</h1>
        <p className="login__subtitle">Ingresá con tu cuenta del equipo.</p>

        <form className="login__form" onSubmit={onSubmit} noValidate>
          <Input
            label="Correo electrónico"
            type="email"
            autoComplete="username"
            autoFocus
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          {errors.root?.message && (
            <p className="login__error" role="alert">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" block loading={isSubmitting}>
            Ingresar
          </Button>
        </form>

        <p className="login__footnote">
          ¿Perdiste el acceso? Escribinos a soporte para que te restablezcan la contraseña.
        </p>
      </div>
    </div>
  );
}
