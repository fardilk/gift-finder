import React from 'react';
import { cn } from '../utils/cn';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return <label ref={ref} className={cn('mb-1 block text-sm font-medium text-gray-700', className)} {...props} />;
});
Label.displayName = 'Label';
