import React from 'react';
import HeadingTyping from 'src/shared/components/welcome/HeadingTyping';
import TypingInputs from 'src/shared/components/welcome/TypingInputs';
import KycBox from 'src/shared/components/welcome/KycBox';

export default function WelcomePage() {
  function handleAskAI(text: string) {
    // TODO: wire into AI command handler
    console.log('Ask AI:', text);
  }
  function handleKycSelect(type: 'individual' | 'group') {
    console.log('KYC selected:', type);
  }

  return (
    <div className="relative flex min-h-[calc(100dvh-0px)] flex-col items-center justify-center p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center">
        <HeadingTyping />
        <p className="max-w-2xl text-balance text-gray-600">
          Find the perfect gift with AI. Describe the occasion, preferences, or budget—and get smart, curated suggestions in seconds.
        </p>
        <TypingInputs onSubmit={handleAskAI} />
        <div className="mt-2 text-sm text-gray-500">or</div>
        <KycBox onSelect={handleKycSelect} />
      </div>
    </div>
  );
}
