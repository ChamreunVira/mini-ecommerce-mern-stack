import { nanoid } from "@reduxjs/toolkit";
import { Banner } from "@/types";
import { commit, FieldErrors, isBlank, outOfRange } from "./support";

export interface BannerInput {
  title: string;
  description: string;
  order: number;
  status: string;
  imageColor: string;
}

export const EMPTY_BANNER: BannerInput = {
  title: "",
  description: "",
  order: 1,
  status: "Active",
  imageColor: "#111827",
};

export function validateBanner(input: BannerInput): FieldErrors<BannerInput> {
  const errors: FieldErrors<BannerInput> = {};

  if (isBlank(input.title)) errors.title = "Title is required.";
  if (outOfRange(input.order, 1)) errors.order = "Order must be 1 or greater.";
  if (input.description.length > 120) {
    errors.description = "Keep the description under 120 characters.";
  }

  return errors;
}

function normalize(input: BannerInput) {
  return {
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
  };
}

export const bannerService = {
  create(input: BannerInput): Promise<Banner> {
    return commit(validateBanner(input), () => ({
      id: nanoid(),
      ...normalize(input),
    }));
  },

  update(id: string, input: BannerInput): Promise<Banner> {
    return commit(validateBanner(input), () => ({
      id,
      ...normalize(input),
    }));
  },

  remove(id: string): Promise<string> {
    return commit<BannerInput, string>({}, () => id);
  },

  toggleStatus(id: string): Promise<string> {
    return commit<BannerInput, string>({}, () => id);
  },
};

export function toBannerInput(banner: Banner): BannerInput {
  const { id: _id, ...rest } = banner;
  return rest;
}
