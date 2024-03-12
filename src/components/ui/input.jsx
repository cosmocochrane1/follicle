import * as React from "react";
import { cn } from "@/lib/utils";
import LucideIcon from "@/components/LucideIcon";

const PasswordInput = React.forwardRef(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        className={className}
        ref={ref}
        {...props}
      />

      <span
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer",
          { "cursor-not-allowed opacity-50": props.disabled },
        )}
        onClick={() => !props.disabled && setShowPassword((prev) => !prev)}
      >
        <LucideIcon
          className="w-5 h-5"
          name={showPassword ? "eye-off" : "eye"}
        />
      </span>
    </div>
  );
});

const Input = React.forwardRef(({ className, type, icon, ...props }, ref) => {
  const formattedClassName = cn(
    "flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50",
    className
  );

  if (type === "password") {
    return (
      <PasswordInput className={formattedClassName} ref={ref} {...props} />
    );
  }

  return (
    <input type={type} className={formattedClassName} ref={ref} {...props} />
  );
});
Input.displayName = "Input";

export { Input };
