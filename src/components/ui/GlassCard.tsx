import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  hover?: boolean;
  variant?: "default" | "stat" | "success" | "warning" | "danger";
  delay?: number;
}

export function GlassCard({
  children,
  className,
  hover = false,
  variant = "default",
  delay = 0,
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: "",
    stat: "stat-card",
    success: "border-l-4 border-l-success",
    warning: "border-l-4 border-l-warning",
    danger: "border-l-4 border-l-destructive",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        hover ? "glass-card-hover" : "glass-card",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
