
// RUTA: src/services/cotizacionService.ts

import axios from "axios";
import { type CotizacionFormData } from "../types/types";
import { analyzeQuotation, calculateFinalPrice } from "./quotationAnalyzer";
import { generateQuotationHTML, generateQuotationText } from "./quotationGenerator";

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
  // Analizar la cotización automáticamente
  const analysis = analyzeQuotation(data.detalles, data.servicio);
  const finalPrice = calculateFinalPrice(analysis.estimatedCost);

  // Generar documento profesional
  const document = generateQuotationHTML(data, analysis, finalPrice);
  const plainText = generateQuotationText(data, analysis, finalPrice);

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
