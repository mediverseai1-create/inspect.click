import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.AI_PROVIDER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      comingSoon: true,
      reply: "The AI Inspection Assistant is coming soon. Add an AI_PROVIDER_API_KEY to enable it for this workspace.",
    });
  }

  const { question } = await request.json();
  if (!question || typeof question !== "string") {
    return NextResponse.json({ error: "A question is required." }, { status: 400 });
  }

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ error: "No organization found." }, { status: 404 });
  }

  const orgId = membership.organization_id;

  const [{ data: openFindings }, { data: overdueActions }, { data: recentInspections }] = await Promise.all([
    supabase.from("findings").select("title, severity, status").eq("organization_id", orgId).in("status", ["open", "in_review"]).limit(25),
    supabase
      .from("corrective_actions")
      .select("title, due_date, status")
      .eq("organization_id", orgId)
      .neq("status", "completed")
      .lt("due_date", new Date().toISOString().slice(0, 10))
      .limit(25),
    supabase.from("inspections").select("title, status, updated_at").eq("organization_id", orgId).order("updated_at", { ascending: false }).limit(10),
  ]);

  const context = `Open or in-review findings (${openFindings?.length ?? 0}):
${(openFindings ?? []).map((f) => `- ${f.title} (${f.severity} severity, ${f.status})`).join("\n") || "None"}

Overdue corrective actions (${overdueActions?.length ?? 0}):
${(overdueActions ?? []).map((a) => `- ${a.title} (due ${a.due_date})`).join("\n") || "None"}

Recent inspections:
${(recentInspections ?? []).map((i) => `- ${i.title} (${i.status})`).join("\n") || "None"}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 500,
        system:
          "You are the AI Inspection Assistant inside InspectFlow, a B2B inspection and corrective-action platform. " +
          "Answer only using the inspection data provided below. Do not invent findings, numbers, or statistics that " +
          "aren't in the data. If the data doesn't answer the question, say so plainly.\n\n" +
          context,
        messages: [{ role: "user", content: question }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "The AI provider returned an error." }, { status: 502 });
    }

    const data = await response.json();
    const reply = data?.content?.[0]?.text ?? "I couldn't generate a response.";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Couldn't reach the AI provider." }, { status: 502 });
  }
}
