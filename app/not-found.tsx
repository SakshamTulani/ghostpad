import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-muted/50 shadow-xl border border-border/50 backdrop-blur-sm">
          <Ghost className="h-16 w-16 text-primary animate-bounce-slow" />
        </div>
        {/* Decorative small ghosts or elements could go here */}
      </div>

      <h1 className="mb-2 text-4xl font-bold tracking-tight lg:text-5xl">
        404
      </h1>
      <h2 className="mb-4 text-2xl font-semibold text-foreground/80">
        Page Not Found
      </h2>

      <p className="mb-8 max-w-125 text-muted-foreground text-lg">
        Whoops! It seems like this page has ghosted us. It might have been
        moved, deleted, or never existed in the first place.
      </p>

      <div className="flex gap-4">
        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>

      <div className="mt-12 text-sm text-muted-foreground/60">
        ERROR CODE: 404_GHOSTED
      </div>
    </div>
  );
}
