"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import type { CommentEntity } from "@/types/database";

export interface CommentData {
  id: string;
  body: string;
  created_at: string;
  author_label: string;
}

export function CommentsPanel({
  organizationId,
  entityType,
  entityId,
  initialComments,
}: {
  organizationId: string;
  entityType: CommentEntity;
  entityId: string;
  initialComments: CommentData[];
}) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!body.trim()) return;
    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("comments")
      .insert({ organization_id: organizationId, entity_type: entityType, entity_id: entityId, body: body.trim(), author_id: user?.id })
      .select("id, body, created_at")
      .single();

    setSubmitting(false);
    if (!error && data) {
      setComments((prev) => [...prev, { ...data, author_label: "You" }]);
      setBody("");
      router.refresh();
    }
  };

  return (
    <Card className="p-5.5">
      <h4 className="text-[14px] mb-3.5">Notes</h4>
      <div className="flex flex-col gap-3 mb-4">
        {comments.length === 0 && <p className="text-[13px] text-ink-55">No notes yet.</p>}
        {comments.map((c) => (
          <div key={c.id} className="text-[13.5px] border-b border-paper-dim pb-3 last:border-b-0">
            <p>{c.body}</p>
            <div className="text-[11.5px] text-ink-55 mt-1">{c.author_label} · {formatDateTime(c.created_at)}</div>
          </div>
        ))}
      </div>
      <Textarea placeholder="Add a note…" value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[70px] text-[13.5px] mb-2.5" />
      <Button type="button" variant="ghost" className="px-4 py-2 text-[13px]" onClick={submit} disabled={submitting || !body.trim()}>
        {submitting ? "Posting…" : "Post note"}
      </Button>
    </Card>
  );
}
