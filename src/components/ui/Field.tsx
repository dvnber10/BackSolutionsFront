import { forwardRef, useId } from 'react';
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import './Field.scss';

type FieldBase = {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
};

function useFieldIds(id?: string) {
  const generated = useId();
  const fieldId = id ?? generated;

  return {
    fieldId,
    hintId: `${fieldId}-hint`,
    errorId: `${fieldId}-error`,
  };
}

function FieldFooter({
  hint,
  error,
  hintId,
  errorId,
}: {
  hint?: string;
  error?: string;
  hintId: string;
  errorId: string;
}) {
  if (error) {
    return (
      <p className="field__error" id={errorId} role="alert">
        {error}
      </p>
    );
  }

  if (hint) {
    return (
      <p className="field__hint" id={hintId}>
        {hint}
      </p>
    );
  }

  return null;
}

export type InputProps = FieldBase & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, required, id, className, ...rest },
  ref,
) {
  const { fieldId, hintId, errorId } = useFieldIds(id);

  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <label className="field__label" htmlFor={fieldId}>
        {label}
        {required && <span className="field__required" aria-hidden="true"> *</span>}
      </label>
      <input
        id={fieldId}
        ref={ref}
        className={`input${className ? ` ${className}` : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...rest}
      />
      <FieldFooter hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </div>
  );
});

export type TextareaProps = FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, required, id, className, rows = 5, ...rest },
  ref,
) {
  const { fieldId, hintId, errorId } = useFieldIds(id);

  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <label className="field__label" htmlFor={fieldId}>
        {label}
        {required && <span className="field__required" aria-hidden="true"> *</span>}
      </label>
      <textarea
        id={fieldId}
        ref={ref}
        rows={rows}
        className={`textarea${className ? ` ${className}` : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...rest}
      />
      <FieldFooter hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </div>
  );
});

export type SelectProps = FieldBase & SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, required, id, className, children, ...rest },
  ref,
) {
  const { fieldId, hintId, errorId } = useFieldIds(id);

  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <label className="field__label" htmlFor={fieldId}>
        {label}
        {required && <span className="field__required" aria-hidden="true"> *</span>}
      </label>
      <select
        id={fieldId}
        ref={ref}
        className={`select${className ? ` ${className}` : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...rest}
      >
        {children}
      </select>
      <FieldFooter hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </div>
  );
});
