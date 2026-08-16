import { z } from "zod";

export const findingSchema = z.object({
  title: z.string().trim().min(2, "Enter a finding title"),
  description: z.string().trim().optional(),
  severity: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional().or(z.literal("")),
});
export type FindingInput = z.infer<typeof findingSchema>;

export const correctiveActionSchema = z.object({
  title: z.string().trim().min(2, "Enter what needs to be done"),
  description: z.string().trim().optional(),
  assignedTo: z.string().uuid().optional().or(z.literal("")),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional().or(z.literal("")),
});
export type CorrectiveActionInput = z.infer<typeof correctiveActionSchema>;
