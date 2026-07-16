import * as React from "react";
import { Input } from "@/components/ui/input";

export function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 10);
  if (d.length === 0) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function extractPhoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

type PhoneInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> & {
  value: string; // raw digits, e.g. "1234567890"
  onChange: (rawDigits: string) => void;
};

/**
 * PhoneInput
 * - Displays value formatted as (###) ###-####
 * - Calls onChange with raw digits only (max 10)
 * - Accepts pasted input, strips non-digits, supports backspace/delete/cursor.
 */
const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, placeholder = "(555) 555-5555", ...rest }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(extractPhoneDigits(e.target.value));
    };
    return (
      <Input
        {...rest}
        ref={ref}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={14}
        placeholder={placeholder}
        value={formatPhoneDisplay(value)}
        onChange={handleChange}
      />
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export default PhoneInput;