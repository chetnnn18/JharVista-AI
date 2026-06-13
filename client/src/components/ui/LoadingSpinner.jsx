const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div
      className={`${sizes[size]} border-4 border-secondary/30 border-t-secondary rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default LoadingSpinner;
