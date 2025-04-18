export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type Suggestion = string;

export type ChatResponse = {
  answer?: string;
  error?: string;
};

export type SuggestionsResponse = string[];
