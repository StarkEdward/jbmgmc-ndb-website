import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
      </div>
      <p className="mt-6 text-muted-foreground font-medium animate-pulse tracking-wider text-sm uppercase">Loading Content...</p>
    </div>
  )
}
