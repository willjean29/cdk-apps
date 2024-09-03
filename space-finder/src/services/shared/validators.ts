import { SpaceModel } from "../models/space.model";

export class MissingFieldError extends Error {
  constructor(field: string) {
    super(`Missing field: ${field}`);
  }
}

export function validateAsSpaceModel(data: SpaceModel) {
  if (!data.id) {
    throw new MissingFieldError("id");
  }
  if (!data.name) {
    throw new MissingFieldError("name");
  }
  if (!data.location) {
    throw new MissingFieldError("location");
  }
}
