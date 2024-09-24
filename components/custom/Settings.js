"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import Spinner from "@/components/Spinner";

export default function Settings({
  customization,
  handleCustomizationChange,
  userHasAccess,
  userLoading,
  phoneNumber,
  setPhoneNumber,
  deliveryTime,
  setDeliveryTime,
}) {
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  return (
    <AccordionItem value="settings">
      <AccordionTrigger>Message Settings</AccordionTrigger>
      {userHasAccess && (
        <AccordionContent className="px-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryTime">Delivery Time (EST)</Label>
              <Select value={deliveryTime} onValueChange={setDeliveryTime}>
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
            <div className="space-y-2">
              <Label>Enable Messaging:</Label>
              <RadioGroup
                value={customization.messaging.enabled ? "enabled" : "disabled"}
                onValueChange={(value) =>
                  handleCustomizationChange(
                    "messaging",
                    "enabled",
                    value === "enabled"
                  )
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enabled" id="messaging-enabled" />
                  <Label htmlFor="messaging-enabled">Enabled</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="disabled" id="messaging-disabled" />
                  <Label htmlFor="messaging-disabled">Disabled</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={customization.messaging.consentGiven}
                onCheckedChange={(checked) =>
                  handleCustomizationChange(
                    "messaging",
                    "consentGiven",
                    checked
                  )
                }
              />
              <Label htmlFor="consent">
                I consent to receive SMS messages from GoodMornin. Message and
                data rates may apply.
              </Label>
            </div>
          </div>
        </AccordionContent>
      )}
      {!userHasAccess && !userLoading && (
        <AccordionContent className="px-2">
          <p>You must purchase a text plan to access text message settings.</p>
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
