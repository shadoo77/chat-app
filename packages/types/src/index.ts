export type Mode = "dating" | "friendship";

export type ConnectionState =
  | "requested"
  | "qna"
  | "accepted"
  | "voice_stage"
  | "quest_stage"
  | "reveal_ready"
  | "revealed"
  | "declined"
  | "expired"
  | "blocked";
