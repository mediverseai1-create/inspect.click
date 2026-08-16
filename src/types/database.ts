// Hand-written to match supabase/migrations/0001_init.sql.
// Once the Supabase project is linked, regenerate with:
//   npx supabase gen types typescript --project-id <ref> > src/types/database.ts

export type PlanTier = "free" | "starter" | "pro" | "scale";
export type MemberRole = "owner" | "admin" | "member";
export type InspectionStatus = "draft" | "in_progress" | "completed";
export type ItemType = "pass_fail" | "pass_fail_na" | "text" | "number";
export type ItemResult = "pass" | "fail" | "na";
export type Severity = "low" | "medium" | "high";
export type FindingStatus = "open" | "in_review" | "resolved";
export type ActionStatus = "open" | "in_progress" | "completed";
export type Priority = "low" | "medium" | "high";
export type CommentEntity = "inspection" | "finding" | "corrective_action";
export type AttachmentEntity = "inspection_item" | "finding" | "corrective_action";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string; email: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          industry: string | null;
          country: string | null;
          staff_count: string | null;
          use_case: string | null;
          plan: PlanTier;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["organizations"]["Row"]> & { name: string; slug: string };
        Update: Partial<Database["public"]["Tables"]["organizations"]["Row"]>;
        Relationships: [];
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: MemberRole;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["organization_members"]["Row"]> & {
          organization_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["organization_members"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey";
            columns: ["organization_id"];
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "organization_members_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          organization_id: string;
          plan: PlanTier;
          status: "active" | "canceled" | "past_due";
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]> & { organization_id: string };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
        Relationships: [];
      };
      locations: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          address: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["locations"]["Row"]> & { organization_id: string; name: string };
        Update: Partial<Database["public"]["Tables"]["locations"]["Row"]>;
        Relationships: [];
      };
      inspection_templates: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          category: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["inspection_templates"]["Row"]> & {
          organization_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["inspection_templates"]["Row"]>;
        Relationships: [];
      };
      template_items: {
        Row: {
          id: string;
          template_id: string;
          label: string;
          item_type: ItemType;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["template_items"]["Row"]> & {
          template_id: string;
          label: string;
        };
        Update: Partial<Database["public"]["Tables"]["template_items"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "template_items_template_id_fkey";
            columns: ["template_id"];
            referencedRelation: "inspection_templates";
            referencedColumns: ["id"];
          },
        ];
      };
      inspections: {
        Row: {
          id: string;
          organization_id: string;
          template_id: string | null;
          location_id: string | null;
          title: string;
          status: InspectionStatus;
          assigned_to: string | null;
          scheduled_for: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["inspections"]["Row"]> & {
          organization_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["inspections"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "inspections_location_id_fkey";
            columns: ["location_id"];
            referencedRelation: "locations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inspections_assigned_to_fkey";
            columns: ["assigned_to"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inspections_template_id_fkey";
            columns: ["template_id"];
            referencedRelation: "inspection_templates";
            referencedColumns: ["id"];
          },
        ];
      };
      inspection_items: {
        Row: {
          id: string;
          inspection_id: string;
          template_item_id: string | null;
          label: string;
          item_type: ItemType;
          result: ItemResult | null;
          notes: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["inspection_items"]["Row"]> & {
          inspection_id: string;
          label: string;
        };
        Update: Partial<Database["public"]["Tables"]["inspection_items"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "inspection_items_inspection_id_fkey";
            columns: ["inspection_id"];
            referencedRelation: "inspections";
            referencedColumns: ["id"];
          },
        ];
      };
      findings: {
        Row: {
          id: string;
          organization_id: string;
          inspection_id: string | null;
          inspection_item_id: string | null;
          location_id: string | null;
          title: string;
          description: string | null;
          severity: Severity;
          status: FindingStatus;
          identified_by: string | null;
          due_date: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["findings"]["Row"]> & {
          organization_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["findings"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "findings_inspection_id_fkey";
            columns: ["inspection_id"];
            referencedRelation: "inspections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "findings_inspection_item_id_fkey";
            columns: ["inspection_item_id"];
            referencedRelation: "inspection_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "findings_identified_by_fkey";
            columns: ["identified_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      corrective_actions: {
        Row: {
          id: string;
          organization_id: string;
          finding_id: string;
          title: string;
          description: string | null;
          assigned_to: string | null;
          priority: Priority;
          status: ActionStatus;
          due_date: string | null;
          evidence_notes: string | null;
          completed_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["corrective_actions"]["Row"]> & {
          organization_id: string;
          finding_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["corrective_actions"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "corrective_actions_finding_id_fkey";
            columns: ["finding_id"];
            referencedRelation: "findings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "corrective_actions_assigned_to_fkey";
            columns: ["assigned_to"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      comments: {
        Row: {
          id: string;
          organization_id: string;
          entity_type: CommentEntity;
          entity_id: string;
          author_id: string | null;
          body: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["comments"]["Row"]> & {
          organization_id: string;
          entity_type: CommentEntity;
          entity_id: string;
          body: string;
        };
        Update: Partial<Database["public"]["Tables"]["comments"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey";
            columns: ["author_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      attachments: {
        Row: {
          id: string;
          organization_id: string;
          entity_type: AttachmentEntity;
          entity_id: string;
          storage_path: string;
          file_name: string;
          content_type: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["attachments"]["Row"]> & {
          organization_id: string;
          entity_type: AttachmentEntity;
          entity_id: string;
          storage_path: string;
          file_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["attachments"]["Row"]>;
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          organization_id: string;
          inspection_id: string | null;
          title: string;
          generated_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reports"]["Row"]> & {
          organization_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["reports"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "reports_inspection_id_fkey";
            columns: ["inspection_id"];
            referencedRelation: "inspections";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_org_member: {
        Args: { target_org: string };
        Returns: boolean;
      };
      is_org_admin: {
        Args: { target_org: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
