import * as React from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { useCitySearch, useDebouncedValue, useCityByCode, type City } from '../hooks';

type Props = {
  valueCode?: string;
  valueDisplay?: string;
  onChange: (next: { code?: string; name?: string }) => void;
  placeholder?: string;
};

export function CityAutocomplete({ valueCode, valueDisplay, onChange, placeholder }: Props) {
  const [input, setInput] = React.useState<string>(valueDisplay ?? '');
  // Prefill display from code on mount if not provided
  const { data: cityByCode } = useCityByCode(valueCode);
  React.useEffect(() => {
    if (!valueDisplay && cityByCode?.name) setInput(cityByCode.name);
  }, [cityByCode, valueDisplay]);

  const debounced = useDebouncedValue(input, 250);
  const { data: options = [] } = useCitySearch(debounced);
  const [open, setOpen] = React.useState(false);

  // keyboard support
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'ArrowDown') {
      setOpen(true);
    }
  };

  return (
    <div className="relative">
      <Command className="w-full">
        <CommandInput
          value={input}
          onValueChange={(v) => {
            setInput(v);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? 'Type to search cities…'}
          className="w-full rounded-md px-3 py-2 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-purple-300"
        />
        {open && (
          <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
            <CommandList className="max-h-60 overflow-auto py-1">
              {options.length === 0 ? (
                <CommandEmpty className="px-3 py-2 text-sm text-slate-500">No cities found</CommandEmpty>
              ) : (
                options.map((c: City) => (
                  <CommandItem
                    key={c.code}
                    value={c.code}
                    className="cursor-pointer px-3 py-2 hover:bg-slate-50"
                    onSelect={() => {
                      onChange({ code: c.code, name: c.name });
                      setInput(c.name);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{c.name}</span>
                      <span className="text-xs text-slate-400">{c.code}</span>
                    </div>
                  </CommandItem>
                ))
              )}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
}
