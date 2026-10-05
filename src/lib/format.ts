const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** Fecha larga legible (ej: "05 de marzo de 2026"). Devuelve '' si no hay valor válido. */
export function formatDate(value?: string | null): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
}

export function formatDateTime(value?: string | null): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? '' : dateTimeFormatter.format(date);
}

/** Monto en la moneda indicada. El backend manda decimal; se formatea para mostrar. */
export function formatCurrency(amount: number | null | undefined, currency = 'ARS'): string {
  if (amount === null || amount === undefined) {
    return '';
  }

  try {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString('es-AR')}`;
  }
}

/** "5 min de lectura" – un solo lugar para no repetir el texto. */
export function readingTime(minutes: number): string {
  return `${minutes} min de lectura`;
}
