import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';

type Props = {
  methods: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  children: React.ReactNode;
};

export function Form({ methods, onSubmit, children }: Props) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
