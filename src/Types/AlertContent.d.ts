declare interface AlertContent {
  type: "info" | "success" | "error";
  timestamp: number;
  content: string;
}