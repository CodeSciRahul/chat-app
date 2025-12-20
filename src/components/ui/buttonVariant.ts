import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:opacity-90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // New centralized styles
        gradient: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:from-blue-600 hover:to-blue-700",
        subtle: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
        ghostStrong: "text-slate-600 hover:text-slate-800 hover:bg-slate-100",
        dangerGhost: "text-red-600 hover:bg-red-50",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        pill: "h-10 px-6 rounded-full",
        pillSm: "h-9 px-5 rounded-full text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
