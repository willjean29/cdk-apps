import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
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

export function hasAdminGroup(event: APIGatewayProxyEvent) {
  const groups = event.requestContext.authorizer?.claims["cognito:groups"];
  if (groups) {
    return groups?.includes("admins");
  }
  return false;
}

export function addCorsHeader(arg: APIGatewayProxyResult) {
  if (!arg.headers) {
    arg.headers = {};
  }
  arg.headers["Access-Control-Allow-Origin"] = "*";
  arg.headers["Access-Control-Allow-Methods"] = "*";
}
