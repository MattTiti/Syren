"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

// Mock function to get org data - replace with actual API call
async function getOrgData(organization) {
  // This is where you'd fetch the organization's data and form configuration
  const orgs = {
    "acme-corp": {
      name: "Acme Corporation",
      formConfig: {
        title: "Contact Acme Corp",
        fields: [
          { id: "name", label: "Name", type: "text", required: true },
          { id: "email", label: "Email", type: "email", required: true },
          { id: "message", label: "Message", type: "textarea", required: true },
        ],
        buttonText: "Send Message",
      },
    },
    globex: {
      name: "Globex Corporation",
      formConfig: {
        title: "Globex Contact Form",
        fields: [
          { id: "fullName", label: "Full Name", type: "text", required: true },
          {
            id: "email",
            label: "Email Address",
            type: "email",
            required: true,
          },
          { id: "phone", label: "Phone Number", type: "tel", required: false },
          { id: "inquiry", label: "Inquiry", type: "textarea", required: true },
        ],
        buttonText: "Submit Inquiry",
      },
    },
  };
  return new Promise((resolve) => {
    setTimeout(() => resolve(orgs[organization] || null), 100); // Simulating API delay
  });
}

export default function OrgFormPage() {
  const params = useParams();
  const [orgData, setOrgData] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    async function fetchOrgData() {
      const data = await getOrgData(params.organization);
      setOrgData(data);
    }
    fetchOrgData();
  }, [params.organization]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would send the form data to your API
    console.log("Form submitted:", formData);
    toast.success("Form submitted!");
  };

  if (!orgData) {
    return <div>Loading...</div>;
  }

  const { name, formConfig } = orgData;

  return (
    <div className="container max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{formConfig.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {formConfig.fields.map((field) => (
          <div key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              type={field.type}
              id={field.id}
              name={field.id}
              required={field.required}
              onChange={handleInputChange}
            />
          </div>
        ))}
        <Button type="submit">{formConfig.buttonText}</Button>
      </form>
    </div>
  );
}
