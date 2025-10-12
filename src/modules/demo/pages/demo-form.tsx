import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'src/shared/forms/form';
import { RHFTextField } from 'src/shared/forms/rhf-text-field';
import { Button } from 'src/shared/ui/button';

const Schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
});

type FormValues = z.infer<typeof Schema>;

export default function DemoFormPage() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { name: '', email: '' },
    mode: 'onChange',
  });

  const onSubmit = (data: FormValues) => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Demo Form</h1>
      <Form methods={methods} onSubmit={onSubmit}>
        <RHFTextField methods={methods} name="name" label="Name" placeholder="Your name" />
        <RHFTextField methods={methods} name="email" label="Email" placeholder="you@example.com" />
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
