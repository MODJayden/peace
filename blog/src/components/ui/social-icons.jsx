// lucide-react removed trademarked brand/logo icons; these small inline SVGs
// fill that gap for footer/profile social links without adding a new dependency.

export function TwitterIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.1-9.3L0.9 2h7.4l5.1 6.7L18.9 2Zm-1.3 18h2L6.5 4H4.4l13.2 16Z" />
    </svg>
  );
}

export function FacebookIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14 9h3V5h-3c-2.2 0-4 1.8-4 4v2H7v4h3v9h4v-9h3l1-4h-4V9c0-.6.4-1 1-1Z" />
    </svg>
  );
}

export function LinkedinIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM21 21v-6.9c0-3.3-1.8-4.9-4.2-4.9-1.9 0-2.8 1.1-3.3 1.8V8.5H10V21h3.5v-6.4c0-1.7 1-2.6 2.3-2.6 1.3 0 2.2.9 2.2 2.6V21H21Z" />
    </svg>
  );
}

export function YoutubeIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12s0-3.4-.4-5a2.9 2.9 0 0 0-2-2C17.9 4.5 12 4.5 12 4.5s-5.9 0-7.6.5a2.9 2.9 0 0 0-2 2C2 8.6 2 12 2 12s0 3.4.4 5a2.9 2.9 0 0 0 2 2c1.7.5 7.6.5 7.6.5s5.9 0 7.6-.5a2.9 2.9 0 0 0 2-2c.4-1.6.4-5 .4-5ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}
