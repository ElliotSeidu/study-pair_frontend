import { forwardRef, useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordField = forwardRef(({ label, error, hint, id, className = "", ...rest }, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-on-surface dark:text-white/90">
        {label}
      </label>
      <div className="relative">
        <Lock
          className={`absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 ${
            error ? "text-error" : "text-outline dark:text-white/40"
          }`}
        />
        <input
          ref={ref}
          id={id}
          type={visible ? "text" : "password"}
          className={`w-full rounded-lg border py-3 pl-10 pr-10 outline-none transition-colors duration-150
            bg-surface-container-lowest text-on-surface placeholder-outline-variant/70
            dark:bg-white/5 dark:text-white dark:placeholder-white/30
            ${
              error
                ? "border-error bg-error/5 focus:border-error focus:ring-1 focus:ring-error"
                : "border-outline-variant focus:border-student-teal focus:ring-1 focus:ring-student-teal dark:border-white/10"
            } ${className}`}
          {...rest}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface-variant dark:text-white/40 dark:hover:text-white/70"
        >
          {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
        </button>
      </div>
      {error ? (
        <p className="text-xs text-error">{error.message}</p>
      ) : (
        hint && <p className="text-xs text-on-surface-variant dark:text-white/40">{hint}</p>
      )}
    </div>
  );
});

PasswordField.displayName = "PasswordField";
export default PasswordField;