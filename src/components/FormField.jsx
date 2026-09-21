import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

const FormField = forwardRef(({ label, icon: Icon, error, hint, className = "", ...rest }, ref) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={rest.id} className="text-sm font-medium text-on-surface dark:text-white/90">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className={`absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 ${
              error ? "text-error" : "text-outline dark:text-white/40"
            }`}
          />
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg border py-3 pl-10 outline-none transition-colors duration-150
            bg-surface-container-lowest text-on-surface placeholder-outline-variant/70
            dark:bg-white/5 dark:text-white dark:placeholder-white/30
            ${
              error
                ? "border-error bg-error/5 pr-10 focus:border-error focus:ring-1 focus:ring-error"
                : "border-outline-variant focus:border-student-teal focus:ring-1 focus:ring-student-teal dark:border-white/10"
            } ${className}`}
          {...rest}
        />
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-error" />
        )}
      </div>
      {error ? (
        <p className="text-xs text-error animate-fade-up">{error.message}</p>
      ) : (
        hint && <p className="text-xs text-on-surface-variant dark:text-white/40">{hint}</p>
      )}
    </div>
  );
});

FormField.displayName = "FormField";
export default FormField;