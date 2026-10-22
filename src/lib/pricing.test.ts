import { describe, expect, it } from "vitest";
import { PRICE_FROM, PRICE_NOW, discountPercent, formatBRL } from "./pricing";

describe("pricing", () => {
  it("badge shows 90% off for 279,90 -> 27,99", () => {
    expect(discountPercent(PRICE_FROM, PRICE_NOW)).toBe(90);
  });
  it("formats prices in pt-BR", () => {
    expect(formatBRL(PRICE_FROM)).toBe("R$ 279,90");
    expect(formatBRL(PRICE_NOW)).toBe("R$ 27,99");
  });
});
