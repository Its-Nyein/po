interface PoLogoProps {
  size?: number;
  className?: string;
}

export function PoLogo({ size = 32, className }: PoLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 0 3px currentColor)" }}
    >
      <circle
        cx="16"
        cy="16"
        r="14.5"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.35"
      />

      <path
        d="M11 25V7h5a6 6 0 0 1 0 12h-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="11" cy="7" r="1.5" fill="currentColor" />
      <circle cx="11" cy="19" r="1.5" fill="currentColor" />
      <circle cx="11" cy="25" r="1.5" fill="currentColor" />

      <circle cx="22" cy="13" r="1" fill="currentColor" opacity="0.5" />

      <line
        x1="11"
        y1="25"
        x2="5"
        y2="25"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.25"
        strokeLinecap="round"
      />
      <line
        x1="22"
        y1="13"
        x2="30"
        y2="13"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
