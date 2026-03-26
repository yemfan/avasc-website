import { randomUUID } from "node:crypto";

export function newRowId(): string {
  return randomUUID();
}
