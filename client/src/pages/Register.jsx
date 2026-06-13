import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { GiLeafSwirl } from 'react-icons/gi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: searchParams.get('role') === 'explorer' ? 'explorer' : 'tourist',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === 'explorer') navigate('/explorer');
      else navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up — JharYatra AI</title>
      </Helmet>
      <div className="min-h-[80vh] flex items-center justify-center section-padding">
        <div className="w-full max-w-md glass rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <GiLeafSwirl className="text-4xl text-secondary mx-auto mb-2" />
            <h1 className="text-2xl font-bold">Join JharYatra AI</h1>
            <p className="text-slate-500 text-sm">Start exploring Jharkhand</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Join as</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="tourist">Tourist</option>
                <option value="explorer">Explorer</option>
              </select>
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary dark:text-secondary font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
