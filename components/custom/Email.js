import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/Spinner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Email({
  customization,
  handleCustomizationChange,
  userHasAccess,
  userLoading,
}) {
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  return (
    <AccordionItem value="email">
      <AccordionTrigger>Email Settings</AccordionTrigger>
      {userHasAccess && !userLoading && (
        <AccordionContent className="px-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-address">Email Address:</Label>
              <Input
                id="email-address"
                type="email"
                value={customization.email.address}
                onChange={(e) =>
                  handleCustomizationChange("email", "address", e.target.value)
                }
                placeholder="Enter your email address"
              />
            </div>
            <div className="space-y-2">
              <Label>Enable Email:</Label>
              <RadioGroup
                value={customization.email.enabled ? "enabled" : "disabled"}
                onValueChange={(value) =>
                  handleCustomizationChange(
                    "email",
                    "enabled",
                    value === "enabled"
                  )
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enabled" id="email-enabled" />
                  <Label htmlFor="email-enabled">Enabled</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="disabled" id="email-disabled" />
                  <Label htmlFor="email-disabled">Disabled</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-delivery-time">Email Delivery Time:</Label>
              <Select
                value={customization.email.deliveryTime}
                onValueChange={(value) =>
                  handleCustomizationChange("email", "deliveryTime", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select delivery time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time} EST
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="email-consent"
                checked={customization.email.consentGiven}
                onCheckedChange={(checked) =>
                  handleCustomizationChange("email", "consentGiven", checked)
                }
              />
              <Label htmlFor="email-consent">
                I consent to receive email messages from GoodMornin.
              </Label>
            </div>
          </div>
        </AccordionContent>
      )}
      {!userHasAccess && !userLoading && (
        <AccordionContent className="px-2">
          <p>You must purchase a plan to access email settings.</p>
        </AccordionContent>
      )}
      {userLoading && (
        <AccordionContent className="px-2">
          <Spinner />
        </AccordionContent>
      )}
    </AccordionItem>
  );
}
