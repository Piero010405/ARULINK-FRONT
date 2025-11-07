export default function IndigenousPattern() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="indigenous" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#C11012" />
          <path d="M5 5 L15 5 L15 15 L5 15 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
          <circle cx="10" cy="10" r="2" fill="#FFFFFF" opacity="0.4" />
          <line x1="10" y1="5" x2="10" y2="15" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
          <line x1="5" y1="10" x2="15" y2="10" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#indigenous)" />
    </svg>
  )
}
