'use client'

import React, { useState } from 'react'

function Switch({ className = '', checked: controlled, defaultChecked, onChange, disabled = false, ...props }) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false)
  const isControlled = controlled !== undefined
  const checked = isControlled ? controlled : internalChecked

  const handleToggle = () => {
    if (disabled) return
    if (!isControlled) setInternalChecked(!checked)
    onChange?.(!checked)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleToggle}
      className={`inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 
        ${checked ? 'bg-blue-600' : 'bg-gray-300'} 
        ${className}`}
      data-slot="switch"
      {...props}
    >
      <span
        className={`block size-4 rounded-full bg-white shadow transform transition-transform 
          ${checked ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'}`}
        data-slot="switch-thumb"
      />
    </button>
  )
}

export { Switch }

