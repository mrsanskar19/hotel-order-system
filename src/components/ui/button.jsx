// components/Button.jsx

import React from 'react';

export function Button({ children, variant = 'primary', className = '', ...props }) {
  let baseStyles = `
    inline-flex items-center justify-center
    px-4 py-2 rounded-md font-medium
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-all duration-200 ease-in-out
  `;

  const variants = {
    primary: `
      text-white bg-primary-500 hover:bg-primary-600 active:bg-primary-700
      focus:ring-primary-500
    `,
    outline: `
      text-primary-500 border border-primary-500
      hover:bg-primary-50 active:bg-primary-100
      focus:ring-primary-500
    `,
    ghost: `
      text-primary-500 bg-transparent
      hover:bg-primary-50 active:bg-primary-100
      focus:ring-primary-500
    `,
    disabled: `
      text-gray-400 bg-gray-200 cursor-not-allowed
    `,
  };

  const finalClassName = `${baseStyles} ${variants[variant] || variants.primary} ${className}`;

  return (
    <button className={finalClassName} {...props}>
      {children}
    </button>
  );
}

