import { SettingsState } from "@/types";
import { commit, FieldErrors, isBlank, isEmail, outOfRange } from "./support";

export function validateSettings(input: SettingsState): FieldErrors<SettingsState> {
  const errors: FieldErrors<SettingsState> = {};

  if (isBlank(input.storeName)) errors.storeName = "Store name is required.";

  if (isBlank(input.contactEmail)) {
    errors.contactEmail = "Contact email is required.";
  } else if (!isEmail(input.contactEmail)) {
    errors.contactEmail = "Enter a valid email address.";
  }

  if (outOfRange(input.shippingFee, 0)) {
    errors.shippingFee = "Shipping fee cannot be negative.";
  }
  if (outOfRange(input.taxRate, 0, 100)) {
    errors.taxRate = "Tax rate must be between 0 and 100.";
  }
  if (input.storeDescription.length > 200) {
    errors.storeDescription = "Keep the description under 200 characters.";
  }

  return errors;
}

export const settingsService = {
  save(input: SettingsState): Promise<SettingsState> {
    return commit(validateSettings(input), () => ({
      ...input,
      storeName: input.storeName.trim(),
      contactEmail: input.contactEmail.trim(),
      contactPhone: input.contactPhone.trim(),
      storeDescription: input.storeDescription.trim(),
    }));
  },
};
