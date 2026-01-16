import { cn } from "@/lib/utils";

export function GlassButton({ className, variant = "primary", ...props }) {
  const variants = {
    primary: "bg-blue-600/80 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30",
    secondary: "bg-white/40 hover:bg-white/60 text-gray-900 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
    outline: "border-2 border-blue-500/50 text-blue-600 hover:bg-blue-500/10 dark:text-blue-400",
  };

  return (
    <button
      className={cn(
        "rounded-xl px-6 py-3 font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 backdrop-blur-sm",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
