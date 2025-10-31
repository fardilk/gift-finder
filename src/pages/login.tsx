import * as React from 'react';
import { useNavigate, useLocation, Location } from 'react-router-dom';
import { Input } from 'src/shared/ui/input';
import { Button } from 'src/shared/ui/button';
import { useAuth } from 'src/auth/context/app-auth/AuthProvider';

export default function LoginPage() {
  const { login, loginGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as Location & { state?: { from?: Location } };

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      const redirectTo = location?.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleGuest() {
    loginGuest();
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-purple-100 bg-white/80 p-6 shadow-lg shadow-purple-100/60 backdrop-blur">
        <h1 className="text-xl font-semibold text-slate-900">Sign in to Gift Finder</h1>
        <p className="mt-1 text-sm text-slate-500">Use your email to continue or try guest mode.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} placeholder="••••••••" required />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
            <Button type="button" variant="outline" onClick={handleGuest}>Continue as guest</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
