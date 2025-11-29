import * as React from 'react';

export const Command = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    {...props}
  />
));
Command.displayName = 'Command';

export const CommandInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    onValueChange?: (value: string) => void;
  }
>(({ className, onValueChange, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(e.target.value);
    props.onChange?.(e);
  };

  return (
    <input
      ref={ref}
      className={className}
      onChange={handleChange}
      {...props}
    />
  );
});
CommandInput.displayName = 'CommandInput';

export const CommandList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    {...props}
  />
));
CommandList.displayName = 'CommandList';

export const CommandEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    {...props}
  />
));
CommandEmpty.displayName = 'CommandEmpty';

export const CommandItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string;
    onSelect?: () => void;
  }
>(({ className, onSelect, ...props }, ref) => {
  const handleClick = () => {
    onSelect?.();
  };

  return (
    <div
      ref={ref}
      className={className}
      onClick={handleClick}
      {...props}
    />
  );
});
CommandItem.displayName = 'CommandItem';
