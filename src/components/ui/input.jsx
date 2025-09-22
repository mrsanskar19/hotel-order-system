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
        className="peer w-full px-3 pt-5 pb-1 text-base border border-gray-300 rounded-md focus:outline-none focus:border-blue-600 transition-all"
        {...rest}
      />
      <label
        htmlFor={inputId}
        className="absolute left-3 top-4 text-gray-500 text-base transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-1.5 peer-focus:left-3 peer-focus:text-xs peer-focus:text-blue-600"
      >
        {label}
      </label>
    </div>
  );
}

