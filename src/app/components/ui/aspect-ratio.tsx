"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
/**
 * ui/aspect-ratio.tsx
 * Aspect ratio primitive wrapper around Radix `AspectRatio`.
 * - Ensures consistent aspect boxes (images, embeds) across the UI.
 */
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
