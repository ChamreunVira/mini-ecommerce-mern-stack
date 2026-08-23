import { nanoid } from "@reduxjs/toolkit";
import { Collection } from "@/types";
import { commit, FieldErrors, isBlank } from "./support";

export interface CollectionInput {
  name: string;
  description: string;
  status: string;
  imageColor: string;
}

export const EMPTY_COLLECTION: CollectionInput = {
  name: "",
  description: "",
  status: "Active",
  imageColor: "#374151",
};

export function validateCollection(
  input: CollectionInput,
  existingNames: string[] = [],
): FieldErrors<CollectionInput> {
  const errors: FieldErrors<CollectionInput> = {};

  if (isBlank(input.name)) {
    errors.name = "Collection name is required.";
  } else if (existingNames.some((n) => n.toLowerCase() === input.name.trim().toLowerCase())) {
    errors.name = "A collection with that name already exists.";
  }

  return errors;
}

function normalize(input: CollectionInput) {
  return {
    ...input,
    name: input.name.trim(),
    description: input.description.trim(),
  };
}

export const collectionService = {
  create(input: CollectionInput, existingNames: string[]): Promise<Collection> {
    return commit(validateCollection(input, existingNames), () => ({
      id: nanoid(),
      ...normalize(input),
    }));
  },

  update(id: string, input: CollectionInput, existingNames: string[]): Promise<Collection> {
    return commit(validateCollection(input, existingNames), () => ({
      id,
      ...normalize(input),
    }));
  },

  remove(id: string): Promise<string> {
    return commit<CollectionInput, string>({}, () => id);
  },

  toggleStatus(id: string): Promise<string> {
    return commit<CollectionInput, string>({}, () => id);
  },
};

export function toCollectionInput(collection: Collection): CollectionInput {
  const { id: _id, ...rest } = collection;
  return rest;
}
