export type GhlPipelineStage =
  | "new_inbound"
  | "scoring_enrichment"
  | "active_sequence"
  | "engaged_objection"
  | "appointment_booked"
  | "opportunity_won"
  | "cold_nurture";

export type IcpFitTier =
  | "A+ (Unicorn)"
  | "A (Prime)"
  | "B (Standard)"
  | "C (Low Priority)"
  | "D (Disqualified)";

export interface ScoreBreakdown {
  intent: number;
  authority: number;
  budget: number;
  timing: number;
  need: number;
}

export interface ConversationMessage {
  id: string;
  sender: "lead" | "agent" | "system";
  channel: "email" | "sms" | "ghl_chat";
  text: string;
  timestamp: string;
  metadata?: {
    subject?: string;
    agentName?: string;
    objectionType?: string;
    confidence?: number;
  };
}

export interface SequenceStep {
  step_num: number;
  channel: "email" | "sms";
  delay_days: number;
  subject: string;
  body: string;
  status: "pending" | "sent" | "opened" | "clicked" | "replied";
  sent_at?: string;
  ai_generated_notes?: string;
}

export interface LeadActivity {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  details: string;
  sentiment?: "positive" | "neutral" | "high_intent" | "critical";
}

export interface Lead {
  id: string;
  ghl_contact_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  website?: string;
  industry: string;
  company_size: string;
  source: string;
  budget_range: string;
  pain_points: string[];
  ghl_pipeline_stage: GhlPipelineStage;
  deal_value: number;
  ai_score: number;
  icp_fit: IcpFitTier;
  score_breakdown: ScoreBreakdown;
  tags: string[];
  outreach_status: "pending" | "step_1_sent" | "step_2_sent" | "replied" | "booked" | "paused";
  created_at: string;
  last_contacted?: string;
  suggested_strategy?: string;
  conversation_history: ConversationMessage[];
  sequence_steps: SequenceStep[];
  activity_log: LeadActivity[];
  appointment?: {
    date: string;
    time: string;
    timezone: string;
    meeting_link: string;
    status: "scheduled" | "confirmed" | "completed" | "rescheduled";
    calendar_id: string;
    notes?: string;
  };
}

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  brain: "Claude 3.7 Sonnet (Reasoning)" | "Claude 3.5 Haiku" | "GPT-4o Omnichannel" | "LangGraph Router";
  avatar: string;
  badgeColor: string;
  description: string;
  status: "idle" | "evaluating" | "executing" | "looping";
  total_actions: number;
  last_active: string;
  system_prompt: string;
  active_tools: string[];
}

export interface LangGraphNode {
  id: string;
  label: string;
  agent_id: string;
  type: "entry" | "agent_eval" | "conditional_router" | "sequence_generator" | "dispatch_channel" | "conversation_loop" | "calendar_booker" | "sink";
  status: "idle" | "active" | "success" | "evaluating";
  x: number;
  y: number;
  description: string;
  state_keys: string[];
  downstream_edges: Array<{
    target: string;
    condition?: string;
    label?: string;
  }>;
}

export interface LangGraphExecutionTrace {
  id: string;
  timestamp: string;
  lead_id: string;
  lead_name: string;
  node_id: string;
  agent_name: string;
  action: string;
  state_before: string;
  state_after: string;
  thought_trace: string;
  duration_ms: number;
  tool_calls?: Array<{
    tool: string;
    args: Record<string, any>;
    result: Record<string, any>;
  }>;
}

export interface AutomationRoutine {
  id: string;
  name: string;
  trigger_event: string;
  condition: string;
  loop_interval_sec: number;
  description: string;
  enabled: boolean;
  priority: "Critical (SLA < 1m)" | "High" | "Standard" | "Low";
  stats: {
    triggered_count: number;
    converted_count: number;
    success_rate: number;
  };
}

export interface GHLConfig {
  api_key: string;
  location_id: string;
  pipeline_id: string;
  calendar_id: string;
  webhook_endpoint: string;
  is_connected: boolean;
  sync_mode: "autonomous_loop" | "semi_autonomous" | "manual_approval";
  stats: {
    total_synced_leads: number;
    webhooks_processed: number;
    appointments_booked: number;
    pipeline_value_generated: number;
  };
}
