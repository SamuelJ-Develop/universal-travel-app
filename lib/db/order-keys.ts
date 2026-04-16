import {
  generateKeyBetween,
  generateNKeysBetween,
} from "fractional-indexing";

export function getOrderKeyBetween(
  previousOrderKey: string | null,
  nextOrderKey: string | null,
) {
  return generateKeyBetween(previousOrderKey, nextOrderKey);
}

export function getOrderKeysBetween(
  previousOrderKey: string | null,
  nextOrderKey: string | null,
  count: number,
) {
  return generateNKeysBetween(previousOrderKey, nextOrderKey, count);
}
