import * as React from 'react';

export default function RegistrationPage() {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <div className="mx-auto max-w-md p-8">
      <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-600">Register to join groups and save your picks.</p>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <label className="text-sm">Name</label>
          <input value={name} onChange={(e) => setName(e.currentTarget.value)} className="rounded-md border border-slate-200 p-2 text-sm" />
          <label className="text-sm">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} className="rounded-md border border-slate-200 p-2 text-sm" />
          <label className="text-sm">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} className="rounded-md border border-slate-200 p-2 text-sm" />
          <button type="submit" className="mt-2 rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700">Register</button>
        </form>
        {submitted && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            Registration submitted (demo). You can now <a href="/login" className="underline">login</a> and accept invites.
          </div>
        )}
      </div>
    </div>
  );
}
