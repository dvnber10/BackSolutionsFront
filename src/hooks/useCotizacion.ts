
// RUTA: src/hooks/useCotizacion.ts

import { useState } from 'react';
import { enviarCotizacion } from '../services/cotizacionService';
import {  type CotizacionFormData } from '../types/types';

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Hook personalizado para gestionar el estado y la lógica del formulario de cotización.
 *
 * @returns Un objeto con el estado del formulario, los manejadores de eventos
 * y el estado de la petición.
 */
export const useCotizacion = () => {
  const [formData, setFormData] = useState<CotizacionFormData>({
    nombre: '',
    email: '',
    telefono: '',
    servicio: 'desarrollo-web', // Valor inicial
    detalles: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  /**
   * Valida el formulario.
   * @returns `true` si es válido, `false` en caso contrario.
   */
  const validateForm = (): boolean => {
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.detalles.trim()) {
      setError('Los campos nombre, email y detalles son obligatorios.');
      return false;
    }
    // Validación de formato de email simple
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('El formato del email no es válido.');
      return false;
    }
    setError(null);
    return true;
  };

  /**
   * Maneja los cambios en los campos del formulario.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Maneja el envío del formulario.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      await enviarCotizacion(formData);
      setStatus('success');
      // Opcional: Resetear formulario tras éxito
      // setFormData({ nombre: '', email: '', telefono: '', servicio: 'desarrollo-web', detalles: '' });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    }
  };

  return {
    formData,
    setFormData,
    status,
    error,
    handleChange,
    handleSubmit,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
  };
};
