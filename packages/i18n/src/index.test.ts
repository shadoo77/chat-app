import { describe, expect, it } from "vitest";
import { defaultLocale, isLocale, isRtl, locales } from "./index";

describe("i18n config", () => {
  it("supports the five launch locales with en as default", () => {
    expect([...locales]).toEqual(["en", "nl", "ar", "fr", "es"]);
    expect(defaultLocale).toBe("en");
  });

  it("marks ar as rtl only", () => {
    expect(isRtl("ar")).toBe(true);
    expect(isRtl("en")).toBe(false);
    expect(isRtl("fr")).toBe(false);
  });

  it("validates locale strings", () => {
    expect(isLocale("nl")).toBe(true);
    expect(isLocale("de")).toBe(false);
  });
});
