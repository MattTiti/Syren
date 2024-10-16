"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
// Expanded Tailwind colors array
const tailwindColors = [
  { name: "White", value: "bg-white" },
  { name: "Gray 100", value: "bg-gray-100" },
  { name: "Gray 200", value: "bg-gray-200" },
  { name: "Gray 300", value: "bg-gray-300" },
  { name: "Blue 100", value: "bg-blue-100" },
  { name: "Blue 200", value: "bg-blue-200" },
  { name: "Blue 300", value: "bg-blue-300" },
  { name: "Blue 400", value: "bg-blue-400" },
  { name: "Blue 500", value: "bg-blue-500" },
  { name: "Blue 600", value: "bg-blue-600" },
  { name: "Blue 700", value: "bg-blue-700" },
  { name: "Blue 800", value: "bg-blue-800" },
  { name: "Blue 900", value: "bg-blue-900" },
  { name: "Green 100", value: "bg-green-100" },
  { name: "Green 200", value: "bg-green-200" },
  { name: "Green 300", value: "bg-green-300" },
  { name: "Green 400", value: "bg-green-400" },
  { name: "Green 500", value: "bg-green-500" },
  { name: "Green 600", value: "bg-green-600" },
  { name: "Green 700", value: "bg-green-700" },
  { name: "Red 100", value: "bg-red-100" },
  { name: "Red 200", value: "bg-red-200" },
  { name: "Red 300", value: "bg-red-300" },
  { name: "Red 400", value: "bg-red-400" },
  { name: "Red 500", value: "bg-red-500" },
  { name: "Red 600", value: "bg-red-600" },
  { name: "Red 700", value: "bg-red-700" },
  { name: "Red 800", value: "bg-red-800" },
  { name: "Red 900", value: "bg-red-900" },
  { name: "Yellow 100", value: "bg-yellow-100" },
  { name: "Yellow 200", value: "bg-yellow-200" },
  { name: "Yellow 300", value: "bg-yellow-300" },
  { name: "Yellow 400", value: "bg-yellow-400" },
  { name: "Yellow 500", value: "bg-yellow-500" },
  { name: "Yellow 600", value: "bg-yellow-600" },
  { name: "Yellow 700", value: "bg-yellow-700" },
  { name: "Yellow 800", value: "bg-yellow-800" },
  { name: "Yellow 900", value: "bg-yellow-900" },
];

export default function Custom() {
  const [formConfig, setFormConfig] = useState({
    title: "Sign Up for Alerts",
    fields: [
      { id: "name", label: "Name", type: "text", required: true },
      { id: "email", label: "Email", type: "email", required: true },
      { id: "phone", label: "Phone", type: "tel", required: false },
    ],
    buttonText: "Subscribe",
    backgroundColor: "bg-white",
  });
  const [saved, setSaved] = useState(true);

  const updateField = (id, key, value) => {
    setFormConfig((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      ),
    }));
  };

  // Hardcoded form URL
  const formUrl = "https://forms.syren.com/user123";

  // Function to copy the form URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formUrl);
      toast.success("Copied Link!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="flex p-0 h-screen">
      <div className={`w-2/3 p-4 ${formConfig.backgroundColor}`}>
        <div className="flex w-full items-center justify-center gap-1">
          <Badge variant="secondary" className="hover:underline">
            <Link href={formUrl}>{formUrl}</Link>
          </Badge>
          <Button variant="ghost" size="icon" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy form URL</span>
          </Button>
        </div>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">{formConfig.title}</h2>
          <form className="space-y-4">
            {formConfig.fields.map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  required={field.required}
                />
              </div>
            ))}
            <Button type="submit">{formConfig.buttonText}</Button>
          </form>
        </div>
      </div>
      <div className="w-1/3 border-l border-neutral-200 flex flex-col h-full">
        <div className="flex items-center justify-between gap-2 h-14 px-6">
          <h2 className="text-xl font-bold">Customize Form</h2>
          <Badge
            className={`${saved ? "bg-green-500" : "bg-yellow-500"}`}
            variant="outline"
          >
            {saved ? "Saved" : "Unsaved Changes"}
          </Badge>
        </div>
        <div className="flex-grow overflow-y-auto px-8 border-t border-neutral-200 mt-0">
          <div className="space-y-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                value={formConfig.title}
                onChange={(e) =>
                  setFormConfig((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Form Title"
              />
            </div>
            {formConfig.fields.map((field) => (
              <div key={field.id} className="flex flex-col gap-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  type="text"
                  value={field.label}
                  onChange={(e) =>
                    updateField(field.id, "label", e.target.value)
                  }
                  placeholder={`${field.id} Label`}
                />
                <Select
                  value={field.type}
                  onValueChange={(value) =>
                    updateField(field.id, "type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="tel">Phone</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`required-${field.id}`}
                    checked={field.required}
                    onCheckedChange={(checked) =>
                      updateField(field.id, "required", checked)
                    }
                  />
                  <Label htmlFor={`required-${field.id}`}>Required</Label>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <div
                      className={`mr-2 h-4 w-4 rounded ${formConfig.backgroundColor}`}
                    ></div>
                    <span>
                      {tailwindColors.find(
                        (c) => c.value === formConfig.backgroundColor
                      )?.name || "Select color"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px]">
                  <div className="grid grid-cols-5 gap-2">
                    {tailwindColors.map((color) => (
                      <button
                        key={color.value}
                        className={`h-8 w-8 rounded-full ${color.value}`}
                        onClick={() =>
                          setFormConfig((prev) => ({
                            ...prev,
                            backgroundColor: color.value,
                          }))
                        }
                        title={color.name}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                type="text"
                value={formConfig.buttonText}
                onChange={(e) =>
                  setFormConfig((prev) => ({
                    ...prev,
                    buttonText: e.target.value,
                  }))
                }
                placeholder="Button Text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
