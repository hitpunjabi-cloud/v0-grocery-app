"use client"

import type React from "react"

import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "bg-white border-gray-100 shadow-lg",
          title: "text-gray-700 font-medium",
          description: "text-gray-500",
          success: "bg-emerald-50 border-emerald-200 text-emerald-700",
          error: "bg-red-50 border-red-200 text-red-700",
        },
      }}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#374151",
          "--normal-border": "#f3f4f6",
          "--success-bg": "#ecfdf5",
          "--success-text": "#047857",
          "--success-border": "#a7f3d0",
          "--error-bg": "#fef2f2",
          "--error-text": "#dc2626",
          "--error-border": "#fecaca",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
