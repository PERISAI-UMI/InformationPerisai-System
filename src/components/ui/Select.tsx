import React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, children, id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 transition focus:border-[#E6AF2E] focus:outline-none focus:ring-1 focus:ring-[#E6AF2E] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="text-xs text-rose-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
