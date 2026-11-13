export const THEME_STORAGE_KEY = "forme-theme";

// Run before paint so returning visitors never see the opposite theme flash.
export const THEME_INIT_SCRIPT = `
  const savedTheme = localStorage.getItem("${THEME_STORAGE_KEY}");
  document.documentElement.dataset.theme =
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
`;
