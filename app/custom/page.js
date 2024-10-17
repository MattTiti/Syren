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
import { Copy, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

// Expanded Tailwind colors array
const BG_COLORS = [
  { name: "White", value: "bg-white" },
  { name: "Black", value: "bg-black" },
  { name: "Gray", value: "bg-gray-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Rose", value: "bg-rose-500" },
  { name: "Yellow", value: "bg-yellow-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Emerald", value: "bg-emerald-500" },
  { name: "Teal", value: "bg-teal-500" },
  { name: "Cyan", value: "bg-cyan-500" },
  { name: "Sky", value: "bg-sky-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Violet", value: "bg-violet-500" },
  { name: "Fuschia", value: "bg-fuchsia-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Pink", value: "bg-pink-500" },
];

const TEXT_COLORS = [
  { name: "Black", value: "text-black", bgValue: "bg-black" },
  { name: "White", value: "text-white", bgValue: "bg-white" },
  { name: "Gray", value: "text-gray-500", bgValue: "bg-gray-500" },
  { name: "Red", value: "text-red-500", bgValue: "bg-red-500" },
  { name: "Orange", value: "text-orange-500", bgValue: "bg-orange-500" },
  { name: "Rose", value: "text-rose-500", bgValue: "bg-rose-500" },
  { name: "Yellow", value: "text-yellow-500", bgValue: "bg-yellow-500" },
  { name: "Green", value: "text-green-500", bgValue: "bg-green-500" },
  { name: "Emerald", value: "text-emerald-500", bgValue: "bg-emerald-500" },
  { name: "Teal", value: "text-teal-500", bgValue: "bg-teal-500" },
  { name: "Cyan", value: "text-cyan-500", bgValue: "bg-cyan-500" },
  { name: "Sky", value: "text-sky-500", bgValue: "bg-sky-500" },
  { name: "Blue", value: "text-blue-500", bgValue: "bg-blue-500" },
  { name: "Indigo", value: "text-indigo-500", bgValue: "bg-indigo-500" },
  { name: "Violet", value: "text-violet-500", bgValue: "bg-violet-500" },
  { name: "Fuschia", value: "text-fuchsia-500", bgValue: "bg-fuchsia-500" },
  { name: "Purple", value: "text-purple-500", bgValue: "bg-purple-500" },
  { name: "Pink", value: "text-pink-500", bgValue: "bg-pink-500" },
];

export default function Custom() {
  const [formConfig, setFormConfig] = useState({
    title: "Sign Up for Alerts",
    fields: [
      {
        id: "name",
        label: "Name",
        type: "text",
        required: true,
        included: true,
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        required: true,
        included: true,
      },
      {
        id: "phone",
        label: "Phone",
        type: "tel",
        required: false,
        included: true,
      },
    ],
    conditions: [],
    buttonText: "Subscribe",
    backgroundColor: "bg-white",
    textColor: "text-black",
    buttonColor: "bg-red-500",
    buttonTextColor: "text-white",
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

  const addCondition = () => {
    const newCondition = {
      id: Date.now(),
      name: `Condition ${formConfig.conditions.length + 1}`,
      type: "input",
      options: ["Option 1", "Option 2"],
      included: true,
      required: false,
    };
    setFormConfig((prev) => ({
      ...prev,
      conditions: [...prev.conditions, newCondition],
    }));
    setSaved(false);
  };

  const updateCondition = (id, key, value) => {
    setFormConfig((prev) => ({
      ...prev,
      conditions: prev.conditions.map((condition) => {
        if (condition.id === id) {
          if (key === "included" && value === false) {
            return { ...condition, [key]: value, required: false };
          } else {
            return { ...condition, [key]: value };
          }
        }
        return condition;
      }),
    }));
    setSaved(false);
  };

  const removeCondition = (id) => {
    setFormConfig((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((condition) => condition.id !== id),
    }));
    setSaved(false);
  };

  const resetCondition = (id) => {
    setFormConfig((prev) => ({
      ...prev,
      conditions: prev.conditions.map((condition) =>
        condition.id === id
          ? { ...condition, options: [...condition.options, "Option"] }
          : condition
      ),
    }));
    setSaved(false);
  };

  const addOption = (conditionId) => {
    setFormConfig((prev) => ({
      ...prev,
      conditions: prev.conditions.map((condition) =>
        condition.id === conditionId
          ? { ...condition, options: [...condition.options, "Option"] }
          : condition
      ),
    }));
    setSaved(false);
  };

  const updateOption = (conditionId, index, value) => {
    setFormConfig((prev) => ({
      ...prev,
      conditions: prev.conditions.map((condition) =>
        condition.id === conditionId
          ? {
              ...condition,
              options: condition.options.map((option, i) =>
                i === index ? value : option
              ),
            }
          : condition
      ),
    }));
    setSaved(false);
  };

  const removeOption = (conditionId, index) => {
    setFormConfig((prev) => ({
      ...prev,
      conditions: prev.conditions.map((condition) =>
        condition.id === conditionId
          ? {
              ...condition,
              options: condition.options.filter((_, i) => i !== index),
            }
          : condition
      ),
    }));
    setSaved(false);
  };

  const toggleField = (id) => {
    setFormConfig((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === id ? { ...field, included: !field.included } : field
      ),
    }));
    setSaved(false);
  };

  return (
    <div className="flex p-0 h-screen">
      <div
        className={`w-2/3 p-4 ${formConfig.backgroundColor} ${formConfig.textColor}`}
      >
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
            {formConfig.fields
              .filter((field) => field.included)
              .map((field) => (
                <div key={field.id}>
                  <div className="flex items-center mb-1">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    {field.required && <span className="ml-1">*</span>}
                  </div>
                  <Input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    required={field.required}
                  />
                </div>
              ))}
            {formConfig.conditions
              .filter((condition) => condition.included)
              .map((condition) => (
                <div key={condition.id} className="mb-4">
                  <Label htmlFor={`condition-${condition.id}`}>
                    {condition.name}
                  </Label>
                  {condition.type === "input" ? (
                    <Input
                      type="text"
                      id={`condition-${condition.id}`}
                      name={`condition-${condition.id}`}
                    />
                  ) : (
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${condition.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {condition.options.map((option, index) => (
                          <SelectItem key={index} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            <Button
              type="submit"
              className={`${formConfig.buttonColor} ${formConfig.buttonTextColor}`}
            >
              {formConfig.buttonText}
            </Button>
          </form>
        </div>
      </div>
      <div className="w-1/3 border-l border-neutral-200 flex flex-col h-full">
        <div className="flex items-center justify-between gap-2 p-6 shadow-sm">
          <h2 className="text-xl font-bold">Customize Form</h2>
          <Badge
            className={`${saved ? "bg-green-500" : "bg-yellow-500"} text-white`}
            variant="outline"
          >
            {saved ? "Saved" : "Unsaved Changes"}
          </Badge>
        </div>
        <div className="flex-grow overflow-y-auto px-8 border-t border-neutral-200 mt-0 mb-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.id}>{field.label}</Label>
                </div>

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
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`enabled-${field.id}`}
                      checked={field.included}
                      onCheckedChange={(checked) =>
                        updateField(field.id, "included", checked)
                      }
                    />
                    <Label htmlFor={`enabled-${field.id}`}>Enabled</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`required-${field.id}`}
                      checked={field.required && field.included}
                      onCheckedChange={(checked) =>
                        updateField(field.id, "required", checked)
                      }
                      disabled={!field.included}
                    />
                    <Label htmlFor={`required-${field.id}`}>Required</Label>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <Label>Conditions</Label>
              {formConfig.conditions
                .filter((condition) => condition.included)
                .map((condition) => (
                  <div
                    key={condition.id}
                    className="flex flex-col gap-2 border p-2 rounded-md bg-gray-100"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-2 w-full">
                        <Input
                          type="text"
                          value={condition.name}
                          onChange={(e) =>
                            updateCondition(
                              condition.id,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder={`Condition ${formConfig.conditions.length}`}
                          className="w-full"
                        />
                        <Select
                          value={condition.type}
                          onValueChange={(value) =>
                            updateCondition(condition.id, "type", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="input">Input</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${condition.id}`}
                          checked={condition.required}
                          onCheckedChange={(checked) =>
                            updateCondition(condition.id, "required", checked)
                          }
                        />
                        <Label htmlFor={`required-${condition.id}`}>
                          Required
                        </Label>
                      </div>
                    </div>
                    {condition.type === "select" && (
                      <div className="space-y-2 p-2 bg-white rounded-md border border-gray-200">
                        <Label className="text-sm font-medium text-gray-700">
                          Options
                        </Label>
                        <div className="space-y-2">
                          {condition.options.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div className="flex-grow flex items-center bg-gray-50 rounded-md border border-gray-200">
                                <div className="flex items-center justify-center px-2 py-1 bg-gray-100 h-10 w-6 text-gray-500 text-sm rounded-l-md border-r border-gray-200">
                                  {index + 1}
                                </div>
                                <Input
                                  type="text"
                                  value={option}
                                  onChange={(e) =>
                                    updateOption(
                                      condition.id,
                                      index,
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Option ${index + 1}`}
                                  className="flex-grow border-none bg-transparent focus:ring-0"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeOption(condition.id, index)
                                }
                                className="p-1 hover:bg-red-100 hover:text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(condition.id)}
                          className="w-full mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Option
                        </Button>
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetCondition(condition.id)}
                      >
                        Reset
                      </Button>
                      <Button
                        className="bg-black/80 hover:bg-black/70"
                        size="sm"
                        onClick={() => removeCondition(condition.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              <Button variant="outline" onClick={addCondition}>
                <Plus className="w-4 h-4 mr-2" /> Add Condition
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <div
                      className={`mr-2 h-4 w-4 rounded ${formConfig.backgroundColor} border border-neutral-200`}
                    ></div>
                    <span>
                      {BG_COLORS.find(
                        (c) => c.value === formConfig.backgroundColor
                      )?.name || "Select color"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px]">
                  <div className="grid grid-cols-5 gap-2">
                    {BG_COLORS.map((color) => (
                      <button
                        key={color.value}
                        className={`h-8 w-8 rounded-full ${color.value} border border-neutral-200`}
                        onClick={() => {
                          setFormConfig((prev) => ({
                            ...prev,
                            backgroundColor: color.value,
                          }));
                          setSaved(false);
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="textColor">Text Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <div
                      className={`mr-2 h-4 w-4 rounded ${formConfig.textColor.replace(
                        "text-",
                        "bg-"
                      )} border border-neutral-200`}
                    ></div>
                    <span>
                      {TEXT_COLORS.find((c) => c.value === formConfig.textColor)
                        ?.name || "Select color"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px]">
                  <div className="grid grid-cols-5 gap-2">
                    {TEXT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        className={`h-8 w-8 rounded-full ${color.bgValue} border border-neutral-200`}
                        onClick={() => {
                          setFormConfig((prev) => ({
                            ...prev,
                            textColor: color.value,
                          }));
                          setSaved(false);
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="buttonColor">Button Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <div
                      className={`mr-2 h-4 w-4 rounded ${formConfig.buttonColor} border border-neutral-200`}
                    ></div>
                    <span>
                      {BG_COLORS.find((c) => c.value === formConfig.buttonColor)
                        ?.name || "Select color"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px]">
                  <div className="grid grid-cols-5 gap-2">
                    {BG_COLORS.map((color) => (
                      <button
                        key={color.value}
                        className={`h-8 w-8 rounded-full ${color.value} border border-neutral-200`}
                        onClick={() => {
                          setFormConfig((prev) => ({
                            ...prev,
                            buttonColor: color.value,
                          }));
                          setSaved(false);
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="buttonTextColor">Button Text Color</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <div
                      className={`mr-2 h-4 w-4 rounded ${formConfig.buttonTextColor.replace(
                        "text-",
                        "bg-"
                      )} border border-neutral-200`}
                    ></div>
                    <span>
                      {TEXT_COLORS.find(
                        (c) => c.value === formConfig.buttonTextColor
                      )?.name || "Select color"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px]">
                  <div className="grid grid-cols-5 gap-2">
                    {TEXT_COLORS.map((color) => (
                      <button
                        key={color.bgValue}
                        className={`h-8 w-8 rounded-full ${color.bgValue} border border-neutral-200`}
                        onClick={() => {
                          setFormConfig((prev) => ({
                            ...prev,
                            buttonTextColor: color.value,
                          }));
                          setSaved(false);
                        }}
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
                onChange={(e) => {
                  setFormConfig((prev) => ({
                    ...prev,
                    buttonText: e.target.value,
                  }));
                  setSaved(false);
                }}
                placeholder="Button Text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
