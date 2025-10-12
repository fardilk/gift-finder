import React from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  methods: UseFormReturn<T>;
};

export function RHFTextField<T extends FieldValues>({ name, label, placeholder, methods }: Props<T>) {
  const {
    control,
    formState: { errors },
  } = methods;

  const error = (errors as any)[name]?.message as string | undefined;

  return (
    <div className="mb-4">
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      <Controller
        name={name}
        control={control}
        render={({ field }) => <Input id={name} placeholder={placeholder} {...field} />}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
