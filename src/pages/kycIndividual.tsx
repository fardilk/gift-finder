import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import StepIndicator, { Step } from 'src/shared/ui/stepIndicator';
import GiftContextForm, { GiftContextValues } from 'src/shared/components/forms/giftContextForms';
import ReceiverForm, { ReceiverValues } from 'src/shared/components/forms/receiveForms';
import ReviewAndConfirm from 'src/shared/components/forms/budgetForms';
import { Button } from 'src/shared/ui/button';

type FormValues = GiftContextValues & ReceiverValues;

export default function KycIndividualPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const steps: Step[] = [
    { title: 'Gift Context', subtitle: 'Tell us what this gift is for.' },
    { title: 'About the Receiver', subtitle: 'Who will get this gift?' },
    { title: 'Review & Confirmation' },
  ];

  const methods = useForm<FormValues>({
    defaultValues: {
      occasion: '',
      description: '',
      gift_tone: '',
      budget_min: 0,
      budget_max: 0,
      currency: 'IDR',
      receiver_name: '',
      relationship: '',
      gender: '',
      age_range: '',
      personality: '',
      interests: [],
      style_preference: '',
      hobbies: [],
    },
    mode: 'onChange',
  });

  const summary = useMemo(() => {
    const v = methods.getValues();
    return `Gift for ${v.receiver_name || '—'} (${v.age_range || '—'}), ${v.personality || '—'}, ` +
      `interests: ${(v.interests || []).join(', ') || '—'}, occasion: ${v.occasion || '—'}, ` +
      `budget ${v.budget_min || 0}–${v.budget_max || 0} ${v.currency || ''}`;
  }, [methods]);

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function onGenerate() {
    navigate('/recommendations');
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <StepIndicator current={step} steps={steps} />
      <div className="mx-auto mt-6 grid gap-6 rounded-2xl border bg-white/70 p-6 shadow-sm backdrop-blur">
        {step === 0 && (
          <>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gift Context</h2>
              <p className="text-sm text-gray-600">Tell us what this gift is for.</p>
            </div>
            <GiftContextForm methods={methods} />
            <div className="flex justify-end">
              <Button type="button" onClick={next}>Continue →</Button>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">About the Receiver</h2>
            </div>
            <ReceiverForm methods={methods} />
            <div className="flex justify-between">
              <Button type="button" variant="ghost" onClick={back}>← Back</Button>
              <Button type="button" onClick={next}>Next → Review</Button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Review & Confirmation</h2>
            </div>
            <ReviewAndConfirm summary={summary} />
            <div className="flex justify-between">
              <Button type="button" variant="ghost" onClick={back}>← Back</Button>
              <Button type="button" onClick={onGenerate}>✨ Generate Recommendations</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
