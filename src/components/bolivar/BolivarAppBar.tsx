import * as React from "react";
import { cn } from "@/lib/utils";

export interface AppBarProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

const AppBar: React.FC<AppBarProps> = ({ title, subtitle, icon, actions }) => {
  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              <h1 className="font-display text-lg font-bold text-foreground leading-tight uppercase tracking-wide">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </header>
      <div className="h-[2px] bg-gradient-to-r from-primary via-primary to-accent" />
    </>
  );
};

AppBar.displayName = "AppBar";

export { AppBar };
