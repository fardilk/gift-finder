import React from 'react';
import { Button } from 'src/shared/ui/button';

export type KycBoxProps = {
  onSelect?: (type: 'individual' | 'group') => void;
};

export function KycBox({ onSelect }: KycBoxProps) {
  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-4">
      <Button
        variant="default"
        className="h-32 rounded-2xl border bg-white/70 text-left text-gray-800 shadow-sm backdrop-blur transition hover:shadow-md"
        onClick={() => onSelect?.('individual')}
      >
        <div className="flex h-full w-full flex-col items-start justify-center p-4">
          <i className="fa-solid fa-user text-2xl text-purple-500" />
          <span className="mt-2 text-lg font-semibold">KYC for Individuals</span>
        </div>
      </Button>
      <Button
        variant="default"
        className="h-32 rounded-2xl border bg-white/70 text-left text-gray-800 shadow-sm backdrop-blur transition hover:shadow-md"
        onClick={() => onSelect?.('group')}
      >
        <div className="flex h-full w-full flex-col items-start justify-center p-4">
          <i className="fa-solid fa-people-group text-2xl text-teal-500" />
          <span className="mt-2 text-lg font-semibold">KYC for Group</span>
        </div>
      </Button>
    </div>
  );
}

export default KycBox;
