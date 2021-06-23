// eslint-disable-next-line import/no-mutable-exports
export let SETTINGS = {
  nextID: 0,
  locale: "en",
  theme: "light",
  sort: "creationdate",
  showDone: true,
};

export function loadSettings() {
  SETTINGS = JSON.parse(localStorage.getItem("DoNotes_settings")) || SETTINGS;
  console.log("SETTINGS from store: ");
  console.log(SETTINGS);
  return this;
}

export function saveSettings() {
  localStorage.setItem("DoNotes_settings", JSON.stringify(SETTINGS));
}
