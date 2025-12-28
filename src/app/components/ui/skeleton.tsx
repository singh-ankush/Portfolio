/**
 * ui/skeleton.tsx
 * Small presentational skeleton/block placeholder used while content loads.
 * - Simple wrapper that applies a pulsing background and rounded corners.
 */
import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
