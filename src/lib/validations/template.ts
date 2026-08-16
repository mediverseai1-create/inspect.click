import { z } from "zod";

export const templateItemSchema = z.object({
  label: z.string().trim().min(1, "Enter a checklist item"),
  item_type: z.enum(["pass_fail", "pass_fail_na", "text", "number"]),
});

export const templateSchema = z.object({
  name: z.string().trim().min(2, "Enter a template name"),
  description: z.string().trim().optional(),
  category: z.string().trim().optional(),
  items: z.array(templateItemSchema).min(1, "Add at least one checklist item"),
});
export type TemplateInput = z.infer<typeof templateSchema>;
