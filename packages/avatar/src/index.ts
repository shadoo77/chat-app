export const AVATAR_SPEC_VERSION = 1;

export type AvatarAnswers = {
  mood: string;
  openness: number;
  energy: number;
  interests: string[];
};

export type AvatarLevel = 0 | 1 | 2 | 3;

export function generateAvatarSvg(
  seed: string,
  _answers: AvatarAnswers,
  level: AvatarLevel = 0,
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" data-seed="${seed}" data-level="${level}" data-version="${AVATAR_SPEC_VERSION}"></svg>`;
}
