import React from 'react';
import AiBox from 'src/shared/components/layout/aibox';
import { ProfileAssistant } from 'src/shared/components/layout/aibox/profileAssistant';
import { AiInputs } from 'src/shared/components/layout/aibox/inputs';
import { AiResults } from 'src/shared/components/layout/aibox/results';
import { useAiResults } from 'src/shared/components/layout/aibox/hooks/useAiResults';
import AiReplyBox from 'src/shared/components/layout/aibox/aiReplyBox';
import { Button } from 'src/shared/ui/button';
import { Input } from 'src/shared/ui/input';
import { Label } from 'src/shared/ui/label';

type PreviewItem = {
  id: string;
  label: string;
  render: () => React.ReactNode;
};

type PreviewGroup = {
  id: string;
  label: string;
  items: PreviewItem[];
};

export default function PreviewComponentPage() {
  const { results, isLoading, error, submit } = useAiResults();

  const groups: PreviewGroup[] = React.useMemo(() => [
    {
      id: 'ai',
      label: 'AI components',
      items: [
  { id: 'profileAssistant', label: 'ProfileAssistant', render: () => <ProfileAssistant /> },
        { id: 'aibox', label: 'AiBox', render: () => (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-sm font-medium">Default</h3>
              <AiBox />
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Chat layout</h3>
              <AiReplyBox onSend={submit} />
              <div className="rounded border border-purple-100 p-3 mt-3">
                <AiResults isLoading={isLoading} error={error} results={results} />
              </div>
            </div>
          </div>
        ) },
        { id: 'aiResults', label: 'AiResults', render: () => (
          <AiResults isLoading={isLoading} error={error} results={results} />
        ) },
      ],
    },
    {
      id: 'inputs',
      label: 'Inputs',
      items: [
        { id: 'aiInputs', label: 'AiInputs', render: () => <AiInputs onSubmit={submit} /> },
        { id: 'input', label: 'Input', render: () => <Input placeholder="Sample input" /> },
        { id: 'button', label: 'Button', render: () => <Button>Button</Button> },
        { id: 'label', label: 'Label', render: () => <Label htmlFor="sample">Label</Label> },
      ],
    },
    {
      id: 'cards',
      label: 'Cards',
      items: [
        { id: 'result-card', label: 'Result Card (mock)', render: () => (
          <AiResults isLoading={false} error={null} results={[{ id: 'x', title: 'Sample', detail: 'Card preview' }]} />
        ) },
      ],
    },
  ], [error, isLoading, results, submit]);

  // selection via query params
  const params = new URLSearchParams(window.location.search);
  const [activeGroup, setActiveGroup] = React.useState(
    () => params.get('group') || groups[0]?.id
  );
  const [activeItem, setActiveItem] = React.useState(
    () => params.get('name') || groups[0]?.items[0]?.id
  );

  React.useEffect(() => {
    const g = groups.find((gr) => gr.id === activeGroup) ? activeGroup : groups[0]?.id;
    const itemList = groups.find((gr) => gr.id === g)?.items || [];
    const i = itemList.find((it) => it.id === activeItem) ? activeItem : itemList[0]?.id;
    const next = new URLSearchParams(window.location.search);
    if (g) next.set('group', g);
    if (i) next.set('name', i);
    const newUrl = `${window.location.pathname}?${next.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [activeGroup, activeItem, groups]);

  const current = React.useMemo(() => {
    const g = groups.find((gr) => gr.id === activeGroup) || groups[0];
    const i = g?.items.find((it) => it.id === activeItem) || g?.items[0];
    return i;
  }, [activeGroup, activeItem, groups]);

  return (
    <div className="min-h-screen p-6">
      <h1 className="mb-4 text-2xl font-semibold">Component previews</h1>
      <div className="flex gap-6">
        {/* sidebar */}
        <aside className="w-64 flex-none rounded-2xl border border-purple-100 bg-white/70 p-4 shadow-sm">
          <nav className="flex flex-col gap-3">
            {groups.map((group) => (
              <div key={group.id}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-purple-500">{group.label}</p>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const active = activeGroup === group.id && activeItem === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            setActiveGroup(group.id);
                            setActiveItem(item.id);
                          }}
                          className={[
                            'w-full rounded-lg px-3 py-2 text-left text-sm transition',
                            active ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50',
                          ].join(' ')}
                        >
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* preview stage */}
        <main className="flex-1 rounded-2xl border border-purple-100 bg-white/80 p-6 shadow-sm">
          <div className="mb-4 text-sm text-slate-500">
            <span className="font-medium text-slate-800">Previewing:</span> {activeGroup} / {activeItem}
          </div>
          <div className="rounded-xl border border-purple-50 bg-white p-4">
            {current?.render()}
          </div>
        </main>
      </div>
    </div>
  );
}
