import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { GiLeafSwirl } from 'react-icons/gi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'explorer') navigate('/explorer');
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
        <title>Login — JharYatra AI</title>
      </Helmet>
      <div className="min-h-[80vh] flex items-center justify-center section-padding">
        <div className="w-full max-w-md glass rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <GiLeafSwirl className="text-4xl text-secondary mx-auto mb-2" />
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-slate-500 text-sm">Login to JharYatra AI</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-secondary"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-secondary"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              Login
            </Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary dark:text-secondary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
          <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500">
            <p className="font-semibold mb-1">Demo accounts (after seeding):</p>
            <p>Admin: admin@jharyatra.ai / admin123</p>
            <p>Explorer: explorer@jharyatra.ai / explorer123</p>
            <p>Tourist: tourist@jharyatra.ai / tourist123</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
