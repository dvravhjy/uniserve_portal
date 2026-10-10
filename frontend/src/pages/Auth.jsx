import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Alert, Field, UNIVERSITY, useAction } from '../components/ui';
import { NAV } from '../components/Layout';

export const homeFor = (role) => NAV[role][0][0];

function Shell({ title, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <div className="text-2xl font-bold text-brand-900">UniServe</div>
          <div className="text-sm text-slate-500">{UNIVERSITY}</div>
        </div>
        <div className="card">
          <h1 className="mb-4 text-lg font-semibold">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { msg, run } = useAction();
  const [form, setForm] = useState({ email: '', password: '' });
  if (user) return <Navigate to={homeFor(user.role)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    const ok = await run(() => login(form.email, form.password));
    if (ok) navigate('/');
  };
  return (
    <Shell title="Sign in">
      <form onSubmit={submit} className="space-y-3">
        <Alert type={msg.type}>{msg.text}</Alert>
        <Field label="Email"><input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Password"><input className="input" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
        <button className="btn w-full" type="submit">Sign in</button>
        <p className="text-center text-sm text-slate-500">New student? <Link className="text-brand-600 underline" to="/register">Create an account</Link></p>
      </form>
    </Shell>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { msg, run } = useAction();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', program: '', yearLevel: 1 });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const ok = await run(() => register({ ...form, yearLevel: Number(form.yearLevel) }));
    if (ok) navigate('/');
  };
  return (
    <Shell title="Student registration">
      <form onSubmit={submit} className="space-y-3">
        <Alert type={msg.type}>{msg.text}</Alert>
        <Field label="Full name"><input className="input" required value={form.fullName} onChange={set('fullName')} /></Field>
        <Field label="Email"><input className="input" type="email" required value={form.email} onChange={set('email')} /></Field>
        <Field label="Password (8+ characters, with a letter and a number)"><input className="input" type="password" required minLength={8} value={form.password} onChange={set('password')} /></Field>
        <Field label="Program"><input className="input" required placeholder="e.g. BS Computer Science" value={form.program} onChange={set('program')} /></Field>
        <Field label="Year level">
          <select className="input" value={form.yearLevel} onChange={set('yearLevel')}>{[1, 2, 3, 4, 5].map((y) => <option key={y}>{y}</option>)}</select>
        </Field>
        <button className="btn w-full" type="submit">Create account</button>
        <p className="text-center text-sm text-slate-500">Already registered? <Link className="text-brand-600 underline" to="/login">Sign in</Link></p>
      </form>
    </Shell>
  );
}
