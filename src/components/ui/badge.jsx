'use client';

const Badge = ({ children, color = 'red' }) => {
  const colors = {
    red: 'bg-red-500 text-white',
    white: 'bg-white text-red-500',
  };

  return (
    <span className={`px-2 py-1 text-xs font-bold rounded ${colors[color]}`}>
      {children}
    </span>
  );
};

export { Badge };
