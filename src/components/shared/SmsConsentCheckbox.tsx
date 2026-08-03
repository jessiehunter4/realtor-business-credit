import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { SMS_CONSENT_TEXT } from "@/lib/messagingConsent";

interface SmsConsentCheckboxProps {
  /** Raw digits of the phone number. The box only appears once a number is entered. */
  phone: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
}

/**
 * Separate, specific, unchecked-by-default SMS consent. Always visible.
 */
const SmsConsentCheckbox = ({ phone, checked, onCheckedChange, id = "smsConsent" }: SmsConsentCheckboxProps) => {
  return (
    <div className="flex items-start space-x-3">
      <Checkbox id={id} checked={checked} onCheckedChange={(c) => onCheckedChange(c === true)} />
      <label htmlFor={id} className="text-sm leading-relaxed cursor-pointer text-muted-foreground">
        {SMS_CONSENT_TEXT}{" "}
        <Link to="/terms" className="text-primary underline">Terms</Link>
        {" · "}
        <Link to="/privacy" className="text-primary underline">Privacy</Link>
      </label>
    </div>
  );
};

export default SmsConsentCheckbox;
