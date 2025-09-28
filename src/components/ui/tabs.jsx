'use client'

import React, { useState } from 'react'

function Tabs({ className = '', children, defaultValue = '', ...props }) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  // Clone children and inject activeTab/setActiveTab
  const enhancedChildren = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child
    return React.cloneElement(child, {
      activeTab,
      setActiveTab,
    })
  })

  return (
    <div className={`flex flex-col gap-2 ${className}`} {...props}>
      {enhancedChildren}
    </div>
  )
}

function TabsList({ className = '', children, activeTab, setActiveTab, ...props }) {
  const enhancedChildren = React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child
    return React.cloneElement(child, {
      activeTab,
      setActiveTab,
    })
  })

  return (
    <div
      className={`bg-gray-100 text-gray-600 inline-flex h-9 w-fit items-center justify-center rounded-lg p-1 ${className}`}
      {...props}
    >
      {enhancedChildren}
    </div>
  )
}

function TabsTrigger({ value, className = '', activeTab, setActiveTab, children, ...props }) {
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`
        inline-flex items-center justify-center gap-1.5 px-2 py-1 text-sm font-medium whitespace-nowrap
        border rounded-md h-8 transition-colors
        ${isActive ? 'bg-white text-black shadow-sm' : 'text-gray-500'}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsContent({ value, className = '', activeTab, children, ...props }) {
  if (value !== activeTab) return null

  return (
    <div className={`flex-1 outline-none ${className}`} {...props}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
