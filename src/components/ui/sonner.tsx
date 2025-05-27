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
      position="top-center"
      duration={2000}
      toastOptions={{
        classNames: {
          toast: "bg-background border-border",
          title: "text-foreground",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted hover:bg-muted",
          success: "!bg-success !text-success-foreground !border-success group-[.toaster]:bg-success group-[.toaster]:text-success-foreground group-[.toaster]:border-success",
          error: "!bg-destructive !text-destructive-foreground !border-destructive group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive",
          info: "!bg-info !text-info-foreground !border-info group-[.toaster]:bg-info group-[.toaster]:text-info-foreground group-[.toaster]:border-info",
          warning: "!bg-warning !text-warning-foreground !border-warning group-[.toaster]:bg-warning group-[.toaster]:text-warning-foreground group-[.toaster]:border-warning",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
