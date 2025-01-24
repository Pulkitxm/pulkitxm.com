export const GITHUB_START_CONTRIBUTION_YEAR = 2020;
export const GITHUB_DEFAULT_VIEW_YEAR = 2024;
export const GITHUB_JOINED_DATE = new Date(2020, 4, 20);
export const IGNORED_CONTRIBUTION_YEARS = [2021, 2022];

export const TODAY = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
export const CURRENT_YEAR = TODAY.getFullYear();

export const AVAILABLE_YEARS = Array.from(
  { length: CURRENT_YEAR - GITHUB_START_CONTRIBUTION_YEAR + 1 },
  (_, i) => CURRENT_YEAR - i
).filter((year) => !IGNORED_CONTRIBUTION_YEARS.includes(year));

export const FEATURE_FLAGS = {
  FLOATING_CTA: true,
  SHORTCUT_NAVIGATION: true
};
