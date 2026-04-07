import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Higher-order component that applies Bolívar design token CSS classes
 * to a wrapped component without overwriting its original className.
 *
 * Use this for shadcn/ui components that don't have a direct equivalent
 * in the Librería Bolívar.
 *
 * @example
 * const BolivarDialog = withBolivarTokens(ShadcnDialog, "font-sans rounded-lg");
 */
export function withBolivarTokens<P extends { className?: string }>(
  WrappedComponent: React.ComponentType<P>,
  bolivarClasses: string
) {
  const WithBolivarTokens = React.forwardRef<unknown, P>((props, ref) => (
    <WrappedComponent
      ref={ref}
      {...props}
      className={cn(bolivarClasses, props.className)}
    />
  ));

  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  WithBolivarTokens.displayName = `withBolivarTokens(${displayName})`;

  return WithBolivarTokens;
}
