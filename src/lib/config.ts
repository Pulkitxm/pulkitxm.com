export const GITHUB_START_CONTRIBUTION_YEAR = 2020;
export const GITHUB_JOINED_DATE = new Date(2020, 4, 20);
export const IGNORED_CONTRIBUTION_YEARS = [2021, 2022];

export const getToday = () => {
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};
export const getCurrentYear = () => getToday().getFullYear();

export const getAvailableYears = () =>
  Array.from({ length: getCurrentYear() - GITHUB_START_CONTRIBUTION_YEAR + 1 }, (_, i) => getCurrentYear() - i).filter(
    (year) => !IGNORED_CONTRIBUTION_YEARS.includes(year)
  );

export const FEATURE_FLAGS = {
  FLOATING_CTA: true,
  SHORTCUT_NAVIGATION: true
};

export const MAX_LENGTH_MESSAGE_GUESTBOOK = 500;
export const MAX_NUMBER_MESSAGE_GUESTBOOK_PER_USER = 5;
