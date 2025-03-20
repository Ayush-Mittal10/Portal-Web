"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ContactDetails } from "../../../types/profile"
import { saveContactDetails } from "@/actions/profile"
import { Loader2 } from "lucide-react"

const contactSchema = z.object({
  contactName: z.string().min(2, "Contact Name is required"),
  phoneNumber: z
    .string()
    .min(10, "Phone Number must be 10 digits")
    .max(10, "Phone Number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Invalid phone number format"),
  emailId: z.string().email("Invalid email address"),
  pickupTime: z.string().min(1, "Pickup Time is required"),
})

export function ContactForm({ initialData }: { initialData?: ContactDetails }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)

  const form = useForm<ContactDetails>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialData || {
      contactName: "",
      phoneNumber: "",
      emailId: "",
      pickupTime: "",
    },
  })

  // Watch form values for auto-save
  const formValues = form.watch()

  // Auto-save functionality
  useEffect(() => {
    // Clear previous timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }

    // Don't auto-save if form is pristine
    if (!form.formState.isDirty) return

    // Set a new timer for auto-save
    const timer = setTimeout(() => {
      autoSave()
    }, 3000) // Auto-save after 3 seconds of inactivity

    setAutoSaveTimer(timer)

    // Cleanup on unmount
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [formValues])

  const autoSave = async () => {
    try {
      if (!form.formState.isDirty) return

      setAutoSaveStatus("saving")

      // Get current form data
      const data = form.getValues()

      // Create FormData object
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
      formData.append("isAutoSave", "true")

      // Call the server action
      await saveContactDetails(formData)

      setAutoSaveStatus("saved")

      // Reset after a few seconds
      setTimeout(() => {
        setAutoSaveStatus("idle")
      }, 2000)
    } catch (error) {
      console.error("Auto-save error:", error)
      setAutoSaveStatus("idle")
    }
  }

  async function onSubmit(data: ContactDetails) {
    try {
      setIsSubmitting(true)

      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })

      console.log("Submitting contact form data:", data)
      const result = await saveContactDetails(formData)

      if (result.success) {
        toast.success(result.message || "Contact details saved successfully")
        // Force a page reload to update the UI with the latest progress
        window.location.reload()
      } else {
        toast.error(result.error || "Failed to save contact details")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form id="contact-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          {autoSaveStatus === "saving" && <span className="text-sm text-amber-600 animate-pulse">Auto-saving...</span>}
          {autoSaveStatus === "saved" && <span className="text-sm text-green-600">Auto-saved</span>}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Contact Name<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone Number<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 9876543210"
                    {...field}
                    maxLength={10}
                    onChange={(e) => {
                      // Allow only numbers
                      const value = e.target.value.replace(/[^0-9]/g, "")
                      e.target.value = value
                      field.onChange(e)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="emailId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email ID<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pickupTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pickup Time</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selected Option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="11:00-14:00">11:00 AM - 02:00 PM</SelectItem>
                    <SelectItem value="14:00-17:00">02:00 PM - 05:00 PM</SelectItem>
                    <SelectItem value="17:00-20:00">05:00 PM - 08:00 PM</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </Form>
  )
}

