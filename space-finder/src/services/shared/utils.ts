import { randomUUID } from "crypto";

export class JSONParseError extends Error {
  constructor() {
    super(`Failed to parse JSON`);
  }
}

export function createRandomId(): string {
  return randomUUID();
}
export function parseJSON<T>(jsonString: string): T {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new JSONParseError();
  }
}
