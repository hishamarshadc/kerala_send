import { cn } from "@/lib/utils";

export function GlassInput({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl bg-white/40 border border-white/50 px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm dark:bg-black/20 dark:border-white/10 dark:text-white",
        className
      )}
      {...props}
    />
  );
}
