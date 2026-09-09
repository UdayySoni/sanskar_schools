type IconName =
  | "arrow"
  | "award"
  | "book"
  | "brain"
  | "calendar"
  | "camera"
  | "check"
  | "chevron"
  | "clock"
  | "compass"
  | "external"
  | "graduation"
  | "heart"
  | "location"
  | "mail"
  | "menu"
  | "phone"
  | "play"
  | "quote"
  | "shield"
  | "spark"
  | "sport"
  | "star"
  | "target"
  | "users"
  | "wallet"
  | "x";

export default function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    award: <><circle cx="12" cy="8" r="5"/><path d="m8.5 12-1 9 4.5-2.5 4.5 2.5-1-9"/><path d="m12 5 1 2 2 .3-1.5 1.5.4 2.2-1.9-1-1.9 1 .4-2.2L9 7.3 11 7l1-2Z"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>,
    brain: <><path d="M9.5 4.5A3 3 0 0 0 4 6v1.5a3 3 0 0 0 0 5V14a3 3 0 0 0 5.5 1.5V4.5Z"/><path d="M14.5 4.5A3 3 0 0 1 20 6v1.5a3 3 0 0 1 0 5V14a3 3 0 0 1-5.5 1.5V4.5Z"/><path d="M9.5 8H8m6.5 0H16M9.5 12H7m7.5 0H17"/></>,
    calendar: <><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    camera: <><path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3h5Z"/><circle cx="12" cy="13" r="3"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/></>,
    external: <><path d="M15 4h5v5"/><path d="m10 14 10-10"/><path d="M20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6"/></>,
    graduation: <><path d="m2 10 10-5 10 5-10 5L2 10Z"/><path d="M6 12.5V17c3 2.5 9 2.5 12 0v-4.5M22 10v6"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
    location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    mail: <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 6L2 7"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>,
    play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/></>,
    quote: <><path d="M9 11H5a4 4 0 0 0-4 4v3h8v-7Zm14 0h-4a4 4 0 0 0-4 4v3h8v-7Z"/><path d="M5 11V8a3 3 0 0 1 3-3m11 6V8a3 3 0 0 1 3-3"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
    spark: <><path d="m12 3-1.3 4.2L7 9l3.7 1.8L12 15l1.3-4.2L17 9l-3.7-1.8L12 3Z"/><path d="m5 15-.7 2.3L2 18.5l2.3 1.2L5 22l.7-2.3 2.3-1.2-2.3-1.2L5 15Z"/></>,
    sport: <><circle cx="12" cy="12" r="9"/><path d="m8.5 4.8 2.8 2-.9 3.2H7l-1-3m10.2-2.2-2.8 2 .9 3.2h3.4l1-3M7 10l-1.2 3.5L8.5 16l3.5-2.2L15.5 16l2.7-2.5L17 10M8.5 16l.5 3.5m6.5-3.5-.5 3.5"/></>,
    star: <path d="m12 2 3 6.1 6.7 1-4.8 4.7 1.1 6.7-6-3.2-6 3.2 1.1-6.7-4.8-4.7 6.7-1L12 2Z"/>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>,
    wallet: <><path d="M4 5h14a2 2 0 0 1 2 2v2H6a3 3 0 0 0 0 6h14v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M18 9h4v6h-4a3 3 0 0 1 0-6Z"/><circle cx="18" cy="12" r=".5"/></>,
    x: <><path d="m6 6 12 12M18 6 6 18"/></>,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
