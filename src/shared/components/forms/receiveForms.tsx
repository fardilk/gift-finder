import React from 'react';
import { Path, UseFormReturn } from 'react-hook-form';
import { RHFTextField } from 'src/shared/forms/rhf-text-field';

export type ReceiverValues = {
  receiver_name?: string;
  relationship: string;
  gender: string;
  age_range: string;
  personality: string;
  interests: string[];
  style_preference: string;
  hobbies: string[];
};

export function ReceiverForm<T extends ReceiverValues>({ methods }: { methods: UseFormReturn<T> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <RHFTextField<T> name={"receiver_name" as Path<T>} label="Receiver name" placeholder="(optional)" methods={methods} />
      <RHFTextField<T> name={"relationship" as Path<T>} label="Relationship" placeholder="friend, family, ..." methods={methods} />
      <RHFTextField<T> name={"gender" as Path<T>} label="Gender" placeholder="male, female, other" methods={methods} />
      <RHFTextField<T> name={"age_range" as Path<T>} label="Age range" placeholder="25–34" methods={methods} />
      <RHFTextField<T> name={"personality" as Path<T>} label="Personality" placeholder="introvert, extrovert, ..." methods={methods} />
      <RHFTextField<T> name={"style_preference" as Path<T>} label="Style preference" placeholder="minimalist, luxury, ..." methods={methods} />
      <RHFTextField<T> name={"interests" as Path<T>} label="Interests" placeholder="travel, music, ..." methods={methods} />
      <RHFTextField<T> name={"hobbies" as Path<T>} label="Hobbies" placeholder="reading, gaming, ..." methods={methods} />
    </div>
  );
}

export default ReceiverForm;
