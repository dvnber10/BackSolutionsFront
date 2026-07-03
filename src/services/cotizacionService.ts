
// RUTA: src/services/cotizacionService.ts

import axios from "axios";
import { type CotizacionFormData } from "../types/types";

// La URL base de la API se obtiene desde las variables de entorno de Vite.
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Envía los datos del formulario de cotización al backend.
 * Incluye análisis automático y generación de documento profesional.
 * @param data - Los datos del formulario de cotización.
 * @returns La respuesta del servidor en formato JSON.
 * @throws Si la respuesta de la red no es exitosa.
 */
export const enviarCotizacion = async (data: CotizacionFormData) => {

  // Preparar datos para el backend
  const quotationData = {
    ...data,
  };

  // Se asume un endpoint /api/cotizacion en el backend.
  const response = await axios.post(`${API_URL}/Cotizar`, quotationData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};
