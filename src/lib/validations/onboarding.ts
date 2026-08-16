import { z } from "zod";

export const INDUSTRIES = [
  "Facilities & property management",
  "Manufacturing & production",
  "Warehousing & logistics",
  "Fleet & transportation",
  "Construction",
  "Healthcare",
  "Retail",
  "Other",
] as const;

export const STAFF_COUNTS = ["1-10", "11-50", "51-200", "201-1000", "1000+"] as const;

export const USE_CASES = [
  "Facility & safety inspections",
  "Vehicle & fleet inspections",
  "Equipment & maintenance checks",
  "Quality control inspections",
  "Compliance audits",
  "Other",
] as const;

export const onboardingSchema = z.object({
  companyName: z.string().trim().min(2, "Enter your company name"),
  industry: z.enum(INDUSTRIES, { message: "Select an industry" }),
  country: z.string().trim().min(2, "Enter your country"),
  staffCount: z.enum(STAFF_COUNTS, { message: "Select a company size" }),
  useCase: z.enum(USE_CASES, { message: "Select what you'll inspect" }),
});
export type OnboardingInput = z.infer<typeof onboardingSchema>;
