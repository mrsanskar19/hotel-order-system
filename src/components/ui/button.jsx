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
      text-white bg-red-500 hover:bg-red-600 active:bg-red-700 
 focus:ring-red-500
    `,
    secondry: `
      text-white bg-purple-500 hover:bg-purple-600 active:bg-purple-700
 focus:ring-purple-500
    `,
    outline: `
      text-red-500 border border-red-500
      hover:bg-red-50 active:bg-red-100
 focus:ring-red-500
    `,
    ghost: `
      text-red-500 bg-transparent
      hover:bg-red-50 active:bg-red-100
      focus:ring-red-500
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
