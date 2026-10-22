// Hand-drawn service marks (24x24 path data), shared by the homepage
// "What we fix" boxes and the /home-old/ service cards. Keyed by service
// title; unknown services fall back to the screen mark.
const marks: Record<string, string> = {
  popups: 'M9 3.5h11.5v9.5h-3M9 6.5h11.5M3.5 8h11.5v11.5H3.5zM3.5 11h11.5',
  files: 'M3.5 7.5v10.75a1.25 1.25 0 0 0 1.25 1.25h14.5a1.25 1.25 0 0 0 1.25-1.25V9.25A1.25 1.25 0 0 0 19.25 8h-7.1L10.4 5.5H4.75A1.25 1.25 0 0 0 3.5 6.75zM12 16.75v-5.5M9.6 13.6l2.4-2.4 2.4 2.4',
  screen: 'M3.5 4.5h17v11.5h-17zM8.5 20h7M12 16v4M13.2 4.6l-2.1 3.9 2.9 2.1-2.1 5.3',
  setup: 'M5 5.5h14v9.5H5zM3 18.5h18M12 7.8v4.9M9.55 10.25h4.9',
  // Group marks for the navbar Services dropdown.
  shield: 'M12 3.5l7.25 2.9v5.35c0 4.4-3.05 7.5-7.25 8.75-4.2-1.25-7.25-4.35-7.25-8.75V6.4zM8.9 12.1l2.15 2.15 4.1-4.3',
  network: 'M3.25 9.4a12.4 12.4 0 0 1 17.5 0M6.2 12.75a8.2 8.2 0 0 1 11.6 0M9.15 16.05a4 4 0 0 1 5.7 0M12 19.4v.05',
  browser: 'M3.5 4.75h17v14.5h-17zM3.5 8.75h17M6.4 6.75h.05M8.9 6.75h.05M7.5 12.5h5M7.5 15.5h9',
  advice: 'M4 5h16v10.25h-9.4L6.5 18.9v-3.65H4zM7.75 8.9h8.5M7.75 11.75h5.25',
};

export const markPath = (key: string) => marks[key] ?? marks.screen;
const markFor: Record<string, string> = {
  'Virus & Malware': 'popups',
  'Data Recovery': 'files',
  'Laptop & Mac Hardware': 'screen',
  'Setup & Migration': 'setup',
};

export const serviceMark = (title: string) => marks[markFor[title] ?? 'screen'];
