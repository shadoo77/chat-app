import { describe, expect, it } from "vitest";
import { AVATAR_SPEC_VERSION, generateAvatarSvg, type AvatarAnswers } from "./index";

const answers: AvatarAnswers = { mood: "sage", openness: 5, energy: 5, interests: ["music"] };

describe("avatar stub", () => {
  it("is deterministic for the same input", () => {
    expect(generateAvatarSvg("seed-1", answers)).toBe(generateAvatarSvg("seed-1", answers));
  });

  it("emits spec version and input metadata", () => {
    const svg = generateAvatarSvg("seed-1", answers, 2);
    expect(svg).toContain(`data-version="${AVATAR_SPEC_VERSION}"`);
    expect(svg).toContain('data-seed="seed-1"');
    expect(svg).toContain('data-level="2"');
  });

  it("defaults to level 0", () => {
    expect(generateAvatarSvg("seed-1", answers)).toContain('data-level="0"');
  });
});
