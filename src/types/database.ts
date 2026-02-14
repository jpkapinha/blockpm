export interface Project {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    blockchain_focus: string | null;
    created_at: string;
    updated_at: string;
}

export interface Document {
    id: string;
    project_id: string;
    title: string;
    doc_type: string;
    content: string | null;
    status: "draft" | "approved" | "archived";
    confidence_score: number | null;
    sources: Record<string, unknown> | null;
    created_by: "agent" | "user";
    approved_by: string | null;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Input {
    id: string;
    project_id: string;
    source_type: "slack" | "telegram" | "upload" | "note";
    source_meta: Record<string, unknown> | null;
    raw_content: string | null;
    storage_path: string | null;
    processed: boolean;
    created_at: string;
}

export interface Embedding {
    id: string;
    project_id: string;
    input_id: string | null;
    document_id: string | null;
    chunk_text: string;
    chunk_index: number | null;
    embedding: number[];
    metadata: Record<string, unknown> | null;
    created_at: string;
}

export interface ChatMessage {
    id: string;
    project_id: string;
    role: "user" | "assistant" | "system";
    content: string;
    metadata: Record<string, unknown> | null;
    created_at: string;
}

export interface AgentLog {
    id: string;
    project_id: string;
    agent_type: string;
    action: string;
    input_summary: string | null;
    output_summary: string | null;
    confidence_score: number | null;
    sources: Record<string, unknown> | null;
    approved: boolean;
    approved_by: string | null;
    created_at: string;
}

export interface Notification {
    id: string;
    user_id: string;
    project_id: string | null;
    title: string;
    body: string | null;
    read: boolean;
    action_url: string | null;
    created_at: string;
}

export interface Integration {
    id: string;
    project_id: string;
    provider: "slack" | "telegram";
    config: Record<string, unknown>;
    active: boolean;
    created_at: string;
    updated_at: string;
}
