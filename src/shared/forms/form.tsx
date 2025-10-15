import React from 'react';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';

type Props<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
};

export function Form<T extends FieldValues>({ methods, onSubmit, children }: Props<T>) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
