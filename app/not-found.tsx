import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <div className="bg-card border border-border shadow-sm rounded-2xl p-8 md:p-12 max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center animate-bounce">
            <FileQuestion className="h-10 w-10" />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-foreground mb-2">404</h2>
        <h3 className="text-xl font-medium text-foreground mb-4">Page Not Found</h3>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <Link href="/">
          <Button size="lg" className="px-8 font-semibold">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
