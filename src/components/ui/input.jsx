// components/FloatingInput.jsx

import React from 'react';

export function Input({ label, id, name, type = 'text', ...rest }) {
  const inputId = id || name || label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="relative w-full">
      <input
        type={type}
        id={inputId}
        name={name}
        placeholder=" "
        className="
          peer w-full px-3 pt-5 pb-2 text-sm border border-gray-300 rounded-md
          placeholder-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
          transition-all dark:bg-gray-900 dark:text-white dark:border-gray-600
        "
        {...rest}
      />
      <label
        htmlFor={inputId}
        className="
          absolute left-3 top-2 text-gray-500 text-sm transition-all
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
          peer-focus:top-2 peer-focus:text-sm peer-focus:text-red-500
          dark:text-gray-400 peer-focus:dark:text-red-400
        "
      >
        {label}
      </label>
    </div>
  );
}

