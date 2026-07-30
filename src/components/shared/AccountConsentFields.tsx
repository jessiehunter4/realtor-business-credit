import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import PhoneInput from "@/components/shared/PhoneInput";
import SmsConsentCheckbox from "@/components/shared/SmsConsentCheckbox";

interface AccountConsentFieldsProps {
  /** Raw digits of the mobile number. Omit the phone block by passing showPhone={false}. */
  phone?: string;
  onPhoneChange?: (digits: string) => void;
  smsConsent?: boolean;
  onSmsConsentChange?: (checked: boolean) => void;
  agreed: boolean;
  onAgreedChange: (checked: boolean) => void;
  showPhone?: boolean;
  disabled?: boolean;
  idPrefix?: string;
}

/**
 * Consent block for customer-facing account creation: required Terms/Privacy
 * agreement, optional mobile number, and the standard SMS opt-in.
 */
const AccountConsentFields = ({
  phone = "",
  onPhoneChange,
  smsConsent = false,
  onSmsConsentChange,
  agreed,
  onAgreedChange,
  showPhone = true,
  disabled = false,
  idPrefix = "acct",
}: AccountConsentFieldsProps) => {
  return (
    <div className="space-y-4">
      {showPhone && onPhoneChange && (
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-phone`}>Mobile Phone (optional)</Label>
          <PhoneInput
            id={`${idPrefix}-phone`}
            value={phone}
            onChange={onPhoneChange}
            disabled={disabled}
          />
        </div>
      )}

      {showPhone && onSmsConsentChange && (
        <SmsConsentCheckbox
          id={`${idPrefix}-sms-consent`}
          phone={phone}
          checked={smsConsent}
          onCheckedChange={onSmsConsentChange}
        />
      )}

      <div className="flex items-start space-x-3">
        <Checkbox
          id={`${idPrefix}-terms`}
          checked={agreed}
          disabled={disabled}
          onCheckedChange={(c) => onAgreedChange(c === true)}
        />
        <label
          htmlFor={`${idPrefix}-terms`}
          className="text-sm leading-relaxed cursor-pointer text-muted-foreground"
        >
          I agree to the{" "}
          <Link to="/terms" className="text-primary underline">Terms of Use</Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.
        </label>
      </div>
    </div>
  );
};

export default AccountConsentFields;