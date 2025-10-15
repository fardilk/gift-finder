import React from 'react';
import HeadingTyping from 'src/shared/components/welcome/HeadingTyping';
import TypingInputs from 'src/shared/components/welcome/TypingInputs';
import KycBox from 'src/shared/components/welcome/KycBox';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();
  function handleAskAI(text: string) {
    console.log('Ask AI:', text);
  }
  function handleKycSelect(type: 'individual' | 'group') {
    if (type === 'individual') navigate('/individuals');
    else navigate('/groups');
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
