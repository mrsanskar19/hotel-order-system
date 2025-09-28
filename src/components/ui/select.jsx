'use client'

import React, { useState, useRef, useEffect } from 'react'

function Select({ children, className = '', onValueChange, defaultValue, ...props }) {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(defaultValue || null)
  const triggerRef = useRef(null)
  const contentRef = useRef(null)

  // Close when clicked outside
  useEffect(() => {
    function onClickOutside(e) {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Handle selecting an item
  function handleSelect(value) {
    setSelectedValue(value)
    setOpen(false)
    if (onValueChange) onValueChange(value)
  }

  // Enhance children (Options / supporting parts)
  const enhancedChildren = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child
    // Pass props to items
    return React.cloneElement(child, {
      selectedValue,
      onSelect: handleSelect,
      open,
      setOpen,
    })
  })

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      <SelectTrigger
        ref={triggerRef}
        open={open}
        selectedValue={selectedValue}
        onClick={() => setOpen(!open)}
      />
      {open && (
        <SelectContent ref={contentRef}>{enhancedChildren}</SelectContent>
      )}
    </div>
  )
}

const SelectTrigger = React.forwardRef(
  ({ open, selectedValue, onClick }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        onClick={onClick}
        className="border px-3 py-2 flex justify-between items-center bg-white"
      >
        {selectedValue ?? <span className="text-gray-500">Select...</span>}
        <span style={{ marginLeft: '8px' }}>{open ? '▲' : '▼'}</span>
      </button>
    )
  }
)

function SelectContent({ children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className="absolute mt-1 w-full border bg-white shadow-lg z-10 max-h-60 overflow-auto"
      {...props}
    >
      {children}
    </div>
  )
}

const SelectItem = ({
  value,
  children,
  selectedValue,
  onSelect,
  open,
  setOpen,
  className = '',
  ...props
}) => {
  const isSelected = selectedValue === value

  return (
    <div
      onClick={() => onSelect(value)}
      className={`px-2 py-1 cursor-pointer ${
        isSelected ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'
      } ${className}`}
      {...props}
    >
      {children}
      {isSelected && <span style={{ float: 'right' }}>✔</span>}
    </div>
  )
}

export { Select, SelectItem }
