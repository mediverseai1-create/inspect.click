import { z } from "zod";

export const inspectionSchema = z.object({
  title: z.string().trim().min(2, "Enter a title for this inspection"),
  templateId: z.string().uuid().optional().or(z.literal("")),
  locationId: z.string().uuid().optional().or(z.literal("")),
  assignedTo: z.string().uuid().optional().or(z.literal("")),
  scheduledFor: z.string().optional().or(z.literal("")),
});
export type InspectionInput = z.infer<typeof inspectionSchema>;

export const newLocationSchema = z.object({
  name: z.string().trim().min(2, "Enter a location name"),
  address: z.string().trim().optional(),
});
export type NewLocationInput = z.infer<typeof newLocationSchema>;
