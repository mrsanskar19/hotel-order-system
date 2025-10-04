'use client'

import React, { useState, useRef, useEffect, createContext, useContext } from 'react'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

// Context to share state across components
const SelectContext = createContext()

function Select({ children, defaultValue, onChange }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(defaultValue || null)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option) => {
    setSelected(option)
    setOpen(false)
    onChange?.(option)
  }

  return (
    <SelectContext.Provider
      value={{ open, setOpen, selected, handleSelect, menuRef }}
    >
      <div className="relative inline-block w-64" ref={menuRef}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({ children, size = 'default' }) {
  const { setOpen, open, selected } = useContext(SelectContext)

  const sizeClass = size === 'sm' ? 'h-8 text-sm' : 'h-9 text-sm'

  return (
    <button
      type="button"
      className={`w-full flex items-center justify-between border border-gray-300 bg-white px-3 py-2 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${sizeClass}`}
      onClick={() => setOpen(!open)}
      data-slot="select-trigger"
      data-size={size}
    >
      <span className="truncate">{selected?.label || children}</span>
      <ChevronDownIcon className="w-4 h-4 text-gray-400 ml-2" />
    </button>
  )
}

function SelectContent({ children }) {
  const { open } = useContext(SelectContext)

  if (!open) return null

  return (
    <ul
      className="absolute z-10 mt-2 w-full max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
      data-slot="select-content"
    >
      {children}
    </ul>
  )
}

function SelectItem({ children, value }) {
  const { selected, handleSelect } = useContext(SelectContext)
  const isSelected = selected?.value === value

  return (
    <li
      onClick={() => handleSelect({ label: children, value })}
      className={`flex items-center justify-between px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 ${
        isSelected ? 'bg-gray-100 font-medium' : ''
      }`}
      data-slot="select-item"
    >
      <span>{children}</span>
      {isSelected && <CheckIcon className="w-4 h-4 text-blue-500" />}
    </li>
  )
}

function SelectLabel({ children }) {
  return (
    <div
      className="text-muted-foreground px-2 py-1.5 text-xs text-gray-500 uppercase"
      data-slot="select-label"
    >
      {children}
    </div>
  )
}

function SelectSeparator() {
  return (
    <div
      className="bg-gray-200 pointer-events-none -mx-1 my-1 h-px"
      data-slot="select-separator"
    />
  )
}

function SelectValue() {
  const { selected } = useContext(SelectContext)
  return (
    <span data-slot="select-value" className="truncate">
      {selected?.label}
    </span>
  )
}

function SelectGroup({ children }) {
  return (
    <div data-slot="select-group">
      {children}
    </div>
  )
}

function SelectScrollUpButton() {
  return (
    <div className="flex items-center justify-center py-1 text-gray-400">
      <ChevronUpIcon className="w-4 h-4" />
    </div>
  )
}

function SelectScrollDownButton() {
  return (
    <div className="flex items-center justify-center py-1 text-gray-400">
      <ChevronDownIcon className="w-4 h-4" />
    </div>
  )
}

// Export all parts like original Radix-style API
export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectValue,
  SelectGroup,
}

