import { customAlphabet } from "nanoid";

export const newPubId = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  12,
);
