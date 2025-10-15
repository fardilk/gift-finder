import React from 'react';
import { Path, UseFormReturn } from 'react-hook-form';
import { RHFTextField } from 'src/shared/forms/rhf-text-field';

export type GiftContextValues = {
	occasion: string;
	description: string;
	gift_tone: string;
	budget_min: number;
	budget_max: number;
	currency: string;
};

export function GiftContextForm<T extends GiftContextValues>({ methods }: { methods: UseFormReturn<T> }) {
	return (
		<div className="grid gap-4">
			<RHFTextField<T> name={"occasion" as Path<T>} label="Occasion" placeholder="birthday, wedding, ..." methods={methods} />
			<RHFTextField<T> name={"description" as Path<T>} label="Description" placeholder="Describe the context" methods={methods} />
			<RHFTextField<T> name={"gift_tone" as Path<T>} label="Gift tone" placeholder="funny, romantic, ..." methods={methods} />
			<div className="grid grid-cols-2 gap-4">
				<RHFTextField<T> name={"budget_min" as Path<T>} label="Budget Min" placeholder="0" methods={methods} />
				<RHFTextField<T> name={"budget_max" as Path<T>} label="Budget Max" placeholder="1000000" methods={methods} />
			</div>
			<RHFTextField<T> name={"currency" as Path<T>} label="Currency" placeholder="IDR" methods={methods} />
		</div>
	);
}

export default GiftContextForm;
