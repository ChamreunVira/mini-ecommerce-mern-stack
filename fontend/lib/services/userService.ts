import { nanoid } from "@reduxjs/toolkit";
import { UserItem } from "@/types";
import { commit, FieldErrors, isBlank, isEmail } from "./support";

export interface UserInput {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export const EMPTY_USER: UserInput = {
  name: "",
  email: "",
  phone: "",
  role: "ADMIN",
};

/**
 * `existingEmails` lets the service reject duplicates without owning the data —
 * callers pass the emails already in the store, excluding the record edited.
 */
export function validateUser(
  input: UserInput,
  existingEmails: string[] = [],
): FieldErrors<UserInput> {
  const errors: FieldErrors<UserInput> = {};

  if (isBlank(input.name)) errors.name = "Name is required.";

  if (isBlank(input.email)) {
    errors.email = "Email is required.";
  } else if (!isEmail(input.email)) {
    errors.email = "Enter a valid email address.";
  } else if (existingEmails.some((e) => e.toLowerCase() === input.email.trim().toLowerCase())) {
    errors.email = "That email is already in use.";
  }

  if (!isBlank(input.phone) && input.phone.trim().length < 6) {
    errors.phone = "Phone number looks too short.";
  }
  if (isBlank(input.role)) errors.role = "Role is required.";

  return errors;
}

function normalize(input: UserInput) {
  return {
    ...input,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
  };
}

export const userService = {
  create(input: UserInput, existingEmails: string[]): Promise<UserItem> {
    return commit(validateUser(input, existingEmails), () => ({
      id: nanoid(),
      avatar: null,
      ...normalize(input),
    }));
  },

  update(
    id: string,
    input: UserInput,
    existingEmails: string[],
    avatar: string | null,
  ): Promise<UserItem> {
    return commit(validateUser(input, existingEmails), () => ({
      id,
      avatar,
      ...normalize(input),
    }));
  },

  remove(id: string): Promise<string> {
    return commit<UserInput, string>({}, () => id);
  },
};

export function toUserInput(user: UserItem): UserInput {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}
