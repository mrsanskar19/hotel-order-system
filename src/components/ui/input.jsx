// components/FloatingInput.jsx

import React from 'react';

export function Input({ label, id, name, type = 'text', ...rest }) {
  const inputId = id || name || label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="relative w-full bg-white rounded-md shadow-sm mt-4">
      <input
        type={type}
 id={inputId}
        name={name}
        placeholder=" " // Use placeholder to trigger the floating label effect
        className="peer w-full px-3 pt-6 pb-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
        {...rest}
      />
      <label
        htmlFor={inputId}
        className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:left-0 peer-focus:pl-3 peer-focus:text-sm peer-focus:text-red-500"
      >
        {label}
      </label>
    </div>
  );
}

