import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">404</h1>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">Page Not Found</h2>
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
        </p>
      </div>
      <div className="space-x-4">
        <Link href="/">
          <Button size="lg">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
