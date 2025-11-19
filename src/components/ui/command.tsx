import * as React from 'react';

export function Command({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function CommandInput(
  {
    value,
    onValueChange,
    placeholder,
    onKeyDown,
    className,
  }: {
    value: string;
    onValueChange: (v: string) => void;
    placeholder?: string;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    className?: string;
  }
) {
  return (
    <input
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      className={className}
    />
  );
}

export function CommandList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <ul role="listbox" className={className}>
      {children}
    </ul>
  );
}

export function CommandEmpty({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} role="status" aria-live="polite">
      {children}
    </div>
  );
}

export function CommandItem(
  { children, onSelect, value, className }: { children: React.ReactNode; value: string; onSelect?: (v: string) => void; className?: string }
) {
  return (
    <li
      role="option"
      aria-selected={false}
      tabIndex={-1}
      className={className}
      onMouseDown={(e) => {
        e.preventDefault();
        onSelect?.(value);
      }}
    >
      {children}
    </li>
  );
}
