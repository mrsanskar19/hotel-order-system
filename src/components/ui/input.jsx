'use client';

const Input = ({
  type = 'text',
  name,
  label,
  placeholder = ' ',
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          peer
          w-full
          px-3
          pt-5
          pb-2
          text-sm
          border
          border-gray-300
          rounded-md
          bg-white
          text-black
          focus:outline-none
          focus:ring-2
          focus:ring-red-500
          focus:border-red-500
        `}
      />
      <label
        htmlFor={name}
        className={`
          absolute
          left-3
          top-2
          text-gray-500
          text-sm
          transition-all
          pointer-events-none
          peer-placeholder-shown:top-3.5
          peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-400
          peer-focus:top-2
          peer-focus:text-sm
          peer-focus:text-red-500
        `}
      >
        {label}
      </label>
    </div>
  );
};

// Textarea.tsx
const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">{label}</label>
    <textarea {...props} className="border rounded px-3 py-2 text-sm resize-none" />
  </div>
)

export { Input,Textarea };
