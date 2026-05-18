import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "p" | "small" | "code";
  as?: React.ElementType;
}

export function Typography({
  variant = "p",
  as,
  className,
  children,
  ...props
}: TypographyProps) {
  let Component: React.ElementType = as || "p";

  // Mapeia variante para tag HTML padrão caso o desenvolvedor não passe a prop "as"
  if (!as) {
    switch (variant) {
      case "h1":
        Component = "h1";
        break;
      case "h2":
        Component = "h2";
        break;
      case "h3":
        Component = "h3";
        break;
      case "small":
        Component = "small";
        break;
      case "code":
        Component = "code";
        break;
      default:
        Component = "p";
    }
  }

  // Estilização Dark Industrial Brutalista premium para cada variante
  const baseStyles = {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-white font-sans border-b border-slate-800 pb-2",
    h2: "scroll-m-20 text-3xl font-bold tracking-tight text-slate-100 font-sans border-b border-slate-800/60 pb-2",
    h3: "scroll-m-20 text-xl font-semibold tracking-tight text-slate-200 font-sans",
    p: "leading-7 text-slate-400 [&:not(:first-child)]:mt-4 font-sans",
    small: "text-xs font-medium leading-none text-slate-500 font-sans",
    code: "relative rounded bg-slate-800/80 border border-slate-700 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-slate-300",
  };

  return (
    <Component
      className={cn(baseStyles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
