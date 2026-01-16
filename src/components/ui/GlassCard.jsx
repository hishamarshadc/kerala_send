import { cn } from "@/lib/utils";

export function GlassCard({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl p-6 transition-all duration-300 hover:bg-white/30 dark:hover:bg-black/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
