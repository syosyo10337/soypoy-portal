export interface NavItem {
  name: string;
  href: string;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    name: "About",
    href: "/about",
    children: [
      { name: "Member", href: "/about#member" },
      { name: "History", href: "/about#history" },
    ],
  },
  { name: "Events", href: "/events" },
  {
    name: "What's Up",
    href: "/whats-up",
    children: [
      { name: "ArtWorks", href: "/whats-up#artworks" },
      { name: "Radio", href: "/whats-up#radio" },
      { name: "Channel", href: "/whats-up#channel" },
    ],
  },
];
