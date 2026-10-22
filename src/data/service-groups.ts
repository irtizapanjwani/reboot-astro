// Groups every service in services-fallback.ts under a heading for the
// navbar Services dropdown. Order here is the order shown; the most asked-for
// services come first in each group. Titles must match services-fallback.ts.
import { SERVICES_FALLBACK } from './services-fallback';

const groups = [
  {
    name: 'Repairs',
    blurb: 'Computers, laptops, Macs and consoles, fixed in our workshop or at your place.',
    mark: 'screen',
    services: [
      'Computer Repairs',
      'Laptop Repairs',
      'Apple Mac Repairs',
      'Laptop Screen Replacement',
      'Laptop Battery Replacement',
      'Laptop Screen Hinge Repairs',
      'Hardware Repair & Diagnostics',
      'Operating System Install & Repair',
      'General Troubleshooting',
      'Insurance Reports',
      'Console Repairs',
      'Robot Vacuum Cleaner Repairs',
    ],
  },
  {
    name: 'Tune-ups & Security',
    blurb: 'Slow, cluttered or compromised computers cleaned up and locked down.',
    mark: 'shield',
    services: [
      'Virus & Spyware Removal',
      'Computer Tune-up',
      'Windows De-bloat and Customisation Service',
      'Windows 11 Upgrade',
      'OneDrive Removal',
      'Preventative Maintenance and General Computer Care',
      'Password Manager Setup and Training',
      'Facebook, Instagram, Google, Microsoft Account Recovery Services',
      'Family Safety and Screen Time Solutions',
    ],
  },
  {
    name: 'Setup & Installs',
    blurb: 'New computers, devices and software set up the way you want them.',
    mark: 'setup',
    services: [
      'New Computer Setup',
      'New Computer Build',
      'New Hardware Installs and Upgrades',
      'Software Install & Setup',
      'Setup New Equipment',
      'Mobile Device Setup',
      'Email Setup and Problems',
      'Smart TV and Streaming Services Setups',
      'Plex / Media Server Setups and Configuration',
      'UPS & Power Protection Installation',
      '3D Printer Setup, Calibration',
      'Accessibility & Assistive Tech Setup for Seniors / Low-Vision Users',
    ],
  },
  {
    name: 'Networks & Cameras',
    blurb: 'Wi-Fi, NBN, Starlink, data cabling and CCTV for homes and offices.',
    mark: 'network',
    services: [
      'Wireless Networks and Network Setups',
      'Network Optimisation & Wi-Fi Mesh Design',
      'NBN Setup and Installation',
      'Starlink Installation Brisbane',
      'Data & Ethernet Installation',
      'CCTV & Security Camera Installation',
      'Security Camera and Alarm Installation',
      'Help You Get Better Deals on Your ISP',
    ],
  },
  {
    name: 'Data & Backup',
    blurb: 'Getting lost files back, and making sure you don’t lose them again.',
    mark: 'files',
    services: [
      'Data Recovery',
      'Data Backup & Transfer',
      'Cloud Backup / Storage Solutions',
      'NAS / Home or Small Office File Server Setup (Synology/QNAP)',
      'Photo Organisation / VHS and Slide Restoration',
    ],
  },
  {
    name: 'Business & Web',
    blurb: 'IT support, servers, Microsoft 365, websites and hosting for small businesses.',
    mark: 'browser',
    services: [
      'Business IT Support and Services',
      'Server Support',
      'Google Workspace / Office 365 Business Solutions',
      'AI Receptionist and Answering Services',
      'New Websites',
      'Redesigns / Updates to Websites',
      'Web Hosting',
      'Domain / Custom Emails',
      'Search Engine Optimisation (SEO)',
      'Logos / Pamphlets / Business Card Design',
      'Software Sales and Solutions',
    ],
  },
  {
    name: 'Advice & Training',
    blurb: 'One-on-one help to understand, buy and get more out of your tech.',
    mark: 'advice',
    services: [
      'Computer Training',
      'General Advice for All Your Tech Questions',
      'Laptop & Computer Buying Service',
      'Learn About AI',
      'Get Started with Cryptocurrency',
    ],
  },
];

// Fail the build rather than let the dropdown quietly drop or repeat a service.
const descriptions = new Map(SERVICES_FALLBACK.map((s) => [s.title, s.description]));
const grouped = groups.flatMap((g) => g.services);
const unknown = grouped.filter((t) => !descriptions.has(t));
const missing = [...descriptions.keys()].filter((t) => !grouped.includes(t));
const repeated = grouped.filter((t, i) => grouped.indexOf(t) !== i);
if (unknown.length || missing.length || repeated.length) {
  throw new Error(
    `service-groups.ts is out of step with services-fallback.ts.` +
      (unknown.length ? ` Unknown: ${unknown.join('; ')}.` : '') +
      (missing.length ? ` Not in any group: ${missing.join('; ')}.` : '') +
      (repeated.length ? ` Listed twice: ${repeated.join('; ')}.` : ''),
  );
}

export const serviceGroups = groups.map((g) => ({
  ...g,
  services: g.services.map((title) => ({ title, description: descriptions.get(title) ?? '' })),
}));

export const serviceCount = grouped.length;
