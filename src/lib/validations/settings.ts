import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const organizationSettingsSchema = z.object({
  name: z.string().trim().min(2, "Enter a company name"),
  industry: z.string().trim().optional(),
  country: z.string().trim().optional(),
});
export type OrganizationSettingsInput = z.infer<typeof organizationSettingsSchema>;
