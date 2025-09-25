'use client';

const Button = ({ children, onClick, className, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-red-500 text-white hover:bg-red-600',
    secondary: 'bg-white text-red-500 border border-red-500 hover:bg-gray-100',
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-bold transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export { Button };
