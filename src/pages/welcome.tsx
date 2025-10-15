import React from 'react';
import HeadingTyping from 'src/shared/components/welcome/HeadingTyping';
import KycBox from 'src/shared/components/welcome/KycBox';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();

  function handleKycSelect(type: 'individual' | 'group') {
    if (type === 'individual') navigate('/dashboard');
    else navigate('/groups');
  }

  return (
    <div className="relative flex min-h-[calc(100dvh-0px)] flex-col items-center justify-center p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center">
        <HeadingTyping />
        <p className="max-w-2xl text-balance text-gray-600">
          Find the perfect gift with AI. Describe the occasion, preferences, or budget—and get smart, curated suggestions in seconds.
        </p>
        <h1 className="text-gray-700 drop-shadow-sky-300">Pilih sesi yang ingin kamu masuki!</h1>
        <KycBox onSelect={handleKycSelect} />
      </div>
    </div>
  );
}
