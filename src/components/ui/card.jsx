'use client'

import React from 'react'

function Card({ className = '', ...props }) {
  return (
    <div
      data-slot="card"
      className={`bg-white text-black flex flex-col gap-6 rounded-xl border py-6 shadow-sm ${className}`}
      {...props}
    />
  )
}

function CardHeader({ className = '', ...props }) {
  return (
    <div
      data-slot="card-header"
      className={`grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 ${className}`}
      {...props}
    />
  )
}

function CardTitle({ className = '', ...props }) {
  return (
    <div
      data-slot="card-title"
      className={`leading-none font-semibold ${className}`}
      {...props}
    />
  )
}

function CardDescription({ className = '', ...props }) {
  return (
    <div
      data-slot="card-description"
      className={`text-gray-500 text-sm ${className}`}
      {...props}
    />
  )
}

function CardAction({ className = '', ...props }) {
  return (
    <div
      data-slot="card-action"
      className={`col-start-2 row-span-2 row-start-1 self-start justify-self-end ${className}`}
      {...props}
    />
  )
}

function CardContent({ className = '', ...props }) {
  return (
    <div
      data-slot="card-content"
      className={`px-6 ${className}`}
      {...props}
    />
  )
}

function CardFooter({ className = '', ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={`flex items-center px-6 ${className}`}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
