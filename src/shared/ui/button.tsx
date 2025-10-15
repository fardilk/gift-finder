import React from 'react';
import { cn } from '../utils/cn';
import { meshHover } from '../style/hover';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  // eslint-disable-next-line react/prop-types
  ({ className, variant = 'default', ...props }: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const base = 'inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';
    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: meshHover({ className: 'bg-blue-600 text-white focus:ring-blue-400 focus:ring-offset-white' }),
  outline: 'border border-purple-500 text-purple-500 hover:bg-purple-50 focus:ring-purple-300',
      ghost: 'hover:bg-gray-100',
    };
    return <button ref={ref} className={cn(base, variants[variant], className)} {...props} />;
  }
);
Button.displayName = 'Button';
