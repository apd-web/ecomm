import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className = "", id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <label className="block space-y-2 text-sm text-muted" htmlFor={inputId}>
        {label ? <span className="text-xs uppercase tracking-[0.2em]">{label}</span> : null}
        <input
          id={inputId}
          ref={ref}
          className={`w-full rounded-xl border border-line/70 bg-surface/70 px-4 py-3 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/40 ${className}`}
          {...props}
        />
        {error ? <span className="text-xs text-accentSoft">{error}</span> : null}
        {!error && hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </label>
    );
  },
);

Input.displayName = "Input";
