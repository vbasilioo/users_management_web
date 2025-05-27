"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton
      richColors
      expand
      position="top-right"
      toastOptions={{
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
        classNames: {
          success: "bg-success text-success-foreground border-success",
          error: "bg-destructive text-destructive-foreground border-destructive",
          default: "bg-background text-foreground border-border",
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
