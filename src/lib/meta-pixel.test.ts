import { describe, it, expect } from "vitest";
import { permitsAdvertising, PIXEL_ID } from "./meta-pixel";
describe("Meta advertising permission", () => {
  it("uses the requested pixel", () => expect(PIXEL_ID).toBe("2623259094801410"));
  it("blocks unresolved regions", () => expect(permitsAdvertising("")).toBe(false));
  it("requires consent in regulated regions", () => expect(permitsAdvertising("FR")).toBe(false));
  it("allows acceptance", () => expect(permitsAdvertising("FR", "accepted")).toBe(true));
  it("allows ordinary tracking outside consent regions", () => expect(permitsAdvertising("US")).toBe(true));
  it("respects explicit refusal everywhere", () => expect(permitsAdvertising("US", "rejected")).toBe(false));
  it("GPC overrides acceptance", () => expect(permitsAdvertising("US", "accepted", true)).toBe(false));
});