import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary hover:bg-primary-dark text-white shadow-md',
  secondary: 'bg-secondary hover:bg-green-400 text-white shadow-md',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-primary hover:bg-primary/10',
  dark: 'bg-dark hover:bg-slate-800 text-white',
};

const Button = ({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  ...props
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? (
      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : (
      children
    )}
  </motion.button>
);

export default Button;
