// Shared library of small brand-colored tech logo SVGs, used anywhere a
// recognizable icon is preferable to a plain text tag (Tech Library shelf,
// Projects tool tags, etc). Add new logos here rather than duplicating them
// in individual components.

export const HTML5Logo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M4 2L5.5 19.5L12 21.5L18.5 19.5L20 2H4Z" fill="#E34F26" />
    <path d="M12 21.3V3.6H18.4L17.2 17.8L12 19.3" fill="#F06529" />
    <path d="M12 11.2H8.6L8.4 8.6H12V6.1H5.7L6.2 13.8H12V11.2ZM12 16.4L9.3 15.6L9.1 13.8H6.5L7 18.2L12 19.6V16.4Z" fill="#EBEBEB" />
    <path d="M12 11.2V13.8H15.1L14.8 15.6L12 16.4V19.6L17 18.2L17.5 11.2H12ZM12 6.1V8.6H15.6L15.9 6.1H12Z" fill="#FFFFFF" />
  </svg>
);

export const CSS3Logo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M4 2L5.5 19.5L12 21.5L18.5 19.5L20 2H4Z" fill="#1572B6" />
    <path d="M12 21.3V3.6H18.4L17.2 17.8L12 19.3" fill="#33A9DC" />
    <path d="M12 11.2H6.4L6.1 8.6H12V6.1H3.5L4 13.8H12V11.2ZM12 16.4L9.3 15.6L9.1 13.8H6.5L7 18.2L12 19.6V16.4Z" fill="#EBEBEB" />
    <path d="M12 11.2V13.8H15.1L14.8 15.6L12 16.4V19.6L17 18.2L17.5 11.2H12ZM12 6.1V8.6H15.6L15.9 6.1H12Z" fill="#FFFFFF" />
  </svg>
);

export const JSLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0 rounded" fill="none">
    <rect width="24" height="24" fill="#F7DF1E" rx="4" />
    <path d="M18.1 18.2C17.3 18.2 16.7 17.9 16.3 17.2C16 16.6 15.9 15.6 15.9 14.2H17.7C17.7 15.1 17.8 15.7 18 16.1C18.2 16.4 18.5 16.6 18.9 16.6C19.4 16.6 19.7 16.4 19.9 16C20.1 15.6 20.2 14.8 20.2 13.6V6.3H22V13.6C22 15.5 21.7 16.8 21 17.5C20.3 18.2 19.3 18.2 18.1 18.2ZM11.1 18.2C9.8 18.2 8.8 17.8 8.1 17C7.4 16.2 7 15 7 13.3V12.7H8.8V13.4C8.8 14.5 9 15.3 9.3 15.8C9.6 16.3 10.2 16.6 10.9 16.6C11.5 16.6 12 16.4 12.3 16C12.6 15.6 12.7 14.9 12.7 14C12.7 13.1 12.5 12.5 12.1 12C11.7 11.5 10.9 11 9.8 10.4C8.4 9.6 7.4 8.9 6.8 8.1C6.2 7.3 5.9 6.1 5.9 4.6C5.9 3 6.3 1.8 7.1 1C7.9 0.2 9 0 10.5 0C11.8 0 12.8 0.4 13.5 1.1C14.2 1.8 14.5 3 14.5 4.6V5.2H12.7V4.5C12.7 3.5 12.5 2.8 12.2 2.4C11.9 2 11.3 1.8 10.6 1.8C10 1.8 9.6 2 9.3 2.4C9 2.8 8.9 3.4 8.9 4.2C8.9 5 9.1 5.6 9.5 6C9.9 6.4 10.6 6.9 11.6 7.4C13 8.1 14 8.9 14.7 9.8C15.4 10.7 15.7 11.9 15.7 13.6C15.7 15.2 15.3 16.4 14.5 17.2C13.7 18 12.6 18.2 11.1 18.2Z" fill="#000000" />
  </svg>
);

export const TypeScriptLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0 rounded bg-[#3178C6]" fill="none">
    <text x="3.5" y="16.5" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">TS</text>
  </svg>
);

export const ReactLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0 animate-[spin_20s_linear_infinite]" fill="none">
    <ellipse cx="12" cy="12" rx="3" ry="11" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(30 12 12)" />
    <ellipse cx="12" cy="12" rx="3" ry="11" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(90 12 12)" />
    <ellipse cx="12" cy="12" rx="3" ry="11" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(150 12 12)" />
    <circle cx="12" cy="12" r="1.5" fill="#61DAFB" />
  </svg>
);

export const TailwindLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M12 6C9 6 7 7.5 6.5 10.5C8 8.5 9.8 7.8 12 8.5C13.8 9.1 15.1 10.5 16.5 12C18.9 14.4 21.7 15.7 26.5 15.7C29.5 15.7 31.5 14.2 32 11.2C30.5 13.2 28.7 13.9 26.5 13.2C24.7 12.6 23.4 11.2 22 9.7C19.6 7.3 16.8 6 12 6ZM6.5 15.7C3.5 15.7 1.5 17.2 1 20.2C2.5 18.2 4.3 17.5 6.5 18.2C8.3 18.8 9.6 20.2 11 21.7C13.4 24.1 16.2 25.4 21 25.4C24 25.4 26 23.9 26.5 20.9C25 22.9 23.2 23.6 21 22.9C19.2 22.3 17.9 20.9 16.5 19.4C14.1 17 11.3 15.7 6.5 15.7Z" fill="#38BDF8" transform="scale(0.7) translate(2, 0)" />
  </svg>
);

export const BootstrapLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0 rounded bg-[#7952B3] p-1.5" fill="none">
    <path d="M4 4H12C14.2 4 16 5.8 16 8C16 9.4 15.2 10.7 14.1 11.4C15.2 12.1 16 13.4 16 14.8C16 17 14.2 18.8 12 18.8H4V4ZM6.5 6.5V9.1H11.4C12.1 9.1 12.7 8.5 12.7 7.8C12.7 7.1 12.1 6.5 11.4 6.5H6.5ZM6.5 11.7V16.3H12C12.7 16.3 13.3 15.7 13.3 15C13.3 14.3 12.7 13.7 12 13.7H6.5V11.7Z" fill="white" />
  </svg>
);

export const SassLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM15.4 14.2C15.4 15.9 14 17 12 17C10.4 17 9.1 16.2 8.7 15.2L9.9 14.5C10.2 15.1 10.9 15.6 12 15.6C12.9 15.6 13.8 15.1 13.8 14.2C13.8 13.5 13.2 13 12 12.6C10.2 12 9 11.3 9 9.6C9 8.1 10.3 7 12 7C13.4 7 14.5 7.7 14.9 8.7L13.7 9.4C13.4 8.8 12.8 8.4 12 8.4C11.2 8.4 10.6 8.8 10.6 9.6C10.6 10.2 11.1 10.6 12.3 11C14.1 11.6 15.4 12.3 15.4 14.2Z" fill="#CC6699" />
  </svg>
);

export const ViteLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M19.8 3L12 16.5L4.2 3H19.8Z" fill="url(#vite-grad)" />
    <path d="M12.5 6L7.5 14H11.5L10.5 19.5L16.5 11H12.5L13.5 6H12.5Z" fill="#FFD600" />
    <defs>
      <linearGradient id="vite-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#41D1FF" />
        <stop offset="1" stopColor="#BD34FE" />
      </linearGradient>
    </defs>
  </svg>
);

export const NodejsLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M12 2L4 6.5V15.5L12 20L20 15.5V6.5L12 2Z" stroke="#339933" strokeWidth="1.5" />
    <path d="M12 5.5L6.5 8.7V14.8L12 18L17.5 14.8V8.7L12 5.5Z" fill="#339933" opacity="0.15" />
    <path d="M12 9V15M9 11.5H15" stroke="#339933" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ExpressLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <rect width="24" height="24" fill="#333333" rx="4" />
    <text x="4" y="15" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="monospace">EX</text>
  </svg>
);

export const PythonLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M12.1 2C10.7 2 9.4 2.1 8.8 2.5C7.5 3.3 7.5 4.6 7.5 6.1H12.2V6.7H5.6C4.1 6.7 2.8 7.5 2.1 8.8C1.4 10.1 1.4 11.4 2.1 12.7C2.8 14 4.1 14.1 5.6 14.1H7V12.7C7 10.9 8.2 9.7 10 9.7H14.7C16.1 9.7 17.4 9.6 18 9.2C19.3 8.4 19.3 7.1 19.3 5.6C19.3 4.1 19.2 2.8 18 2.1C16.8 1.4 14.1 2 12.1 2Z" fill="#3776AB" />
    <path d="M11.9 22C13.3 22 14.6 21.9 15.2 21.5C16.5 20.7 16.5 19.4 16.5 17.9H11.8V17.3H18.4C19.9 17.3 21.2 16.5 21.9 15.2C22.6 13.9 22.6 12.6 21.9 11.3C21.2 10 19.9 9.9 18.4 9.9H17V11.3C17 13.1 15.8 14.3 14 14.3H9.3C7.9 14.3 6.6 14.4 6 14.8C4.7 15.6 4.7 16.9 4.7 18.4C4.7 19.9 4.8 21.2 6 21.9C7.2 22.6 9.9 22 11.9 22Z" fill="#FFE052" />
  </svg>
);

export const FastAPILogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M12 2L3 7L12 12L21 7L12 2Z" fill="#009688" />
    <path d="M3 12L12 17L21 12" stroke="#009688" strokeWidth="2" strokeLinecap="round" />
    <path d="M3 16L12 21L21 16" stroke="#009688" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DjangoLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0 rounded bg-[#092E20] p-1" fill="none">
    <text x="4" y="16" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="serif">dj</text>
  </svg>
);

export const PostgreSQLLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 15.58 3.82 18.73 6.58 20.6L7.1 19.2C5.1 17.6 4 15.2 4 12C4 7.6 7.6 4 12 4C16.4 4 20 7.6 20 12C20 15.2 18.9 17.6 16.9 19.2L17.42 20.6C20.18 18.73 22 15.58 22 12C22 6.48 17.52 2 12 2Z" fill="#336791" />
    <path d="M12 6C8.7 6 6 8.7 6 12C6 14.2 7.2 15.8 8.6 16.8L12 8L15.4 16.8C16.8 15.8 18 14.2 18 12C18 8.7 15.3 6 12 6Z" fill="#336791" />
  </svg>
);

export const MongoDBLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M12 2C12 2 7.5 6.5 7.5 12C7.5 17.5 12 22 12 22C12 22 16.5 17.5 16.5 12C16.5 6.5 12 2 12 2Z" fill="#47A248" />
    <path d="M12 4C12 4 9.5 8 9.5 12C9.5 16 12 20 12 20" stroke="#3F3F3F" strokeWidth="1" />
  </svg>
);

export const RedisLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#D82C20" />
    <path d="M2 12L12 17L22 12M2 17L12 22L22 17" stroke="#D82C20" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const OpenCVLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <circle cx="12" cy="7" r="4" stroke="#FF0000" strokeWidth="2" />
    <circle cx="7" cy="16" r="4" stroke="#00FF00" strokeWidth="2" />
    <circle cx="17" cy="16" r="4" stroke="#0000FF" strokeWidth="2" />
  </svg>
);

export const MediaPipeLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <rect width="24" height="24" fill="#0072C6" rx="4" />
    <path d="M6 12H18M12 6V18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="3" fill="#0072C6" stroke="#FFFFFF" strokeWidth="1.5" />
  </svg>
);

export const PyTorchLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M12 2L4 12L12 22L20 12L12 2Z" fill="#EE4C2C" />
    <circle cx="12" cy="12" r="4" fill="white" />
  </svg>
);

export const TensorFlowLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" fill="#FF6F00" />
    <path d="M12 2V22M3 17L12 12M21 17L12 12" stroke="white" strokeWidth="1.5" />
  </svg>
);

export const GitLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12Z" fill="#F05032" />
    <path d="M12 7V13M12 13C11.5 13.5 10.5 13.5 10 13M12 13V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="7" r="1.5" fill="white" />
    <circle cx="9" cy="13" r="1.5" fill="white" />
    <circle cx="12" cy="17" r="1.5" fill="white" />
  </svg>
);

export const DockerLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M2 13.5H22C22 18.5 17 21 12 21C7 21 2 18.5 2 13.5Z" fill="#2496ED" />
    <rect x="6" y="9" width="3" height="3" fill="#2496ED" rx="0.5" />
    <rect x="10" y="9" width="3" height="3" fill="#2496ED" rx="0.5" />
    <rect x="14" y="9" width="3" height="3" fill="#2496ED" rx="0.5" />
  </svg>
);

export const GeminiLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill="url(#gemini-grad)" />
    <defs>
      <linearGradient id="gemini-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4285F4" />
        <stop offset="0.5" stopColor="#9B72CB" />
        <stop offset="1" stopColor="#D96570" />
      </linearGradient>
    </defs>
  </svg>
);

export const FirebaseLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M4 18L12 3L20 18L12 22L4 18Z" fill="#FFCA28" />
    <path d="M12 3L18.5 15.5L12 22V3Z" fill="#F57C00" />
  </svg>
);

export const FlutterLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M14 2L4 12L8 16L18 6L14 2Z" fill="#42A5F5" />
    <path d="M14 22L8 16L12 12L18 18L14 22Z" fill="#0D47A1" />
    <path d="M12 12L18 6L18 18L12 12Z" fill="#42A5F5" opacity="0.65" />
  </svg>
);

export const DartLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <path d="M3 15L9 3L21 9L15 21L3 15Z" fill="#00BCD4" />
    <path d="M9 3L21 9L15 21L9 3Z" fill="#0097A7" opacity="0.55" />
  </svg>
);

export const BluetoothLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0 rounded bg-[#0082FC]" fill="none">
    <path
      d="M12 6L16 9.5L12.5 12L16 14.5L12 18V13.5L9.5 15.5L8.5 14.5L11.5 12L8.5 9.5L9.5 8.5L12.5 10.5V6Z"
      fill="white"
    />
  </svg>
);

export const LinuxLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0 rounded bg-[#1a1a1a] p-0.5" fill="none">
    <ellipse cx="12" cy="13" rx="5" ry="7" fill="#0a0a0a" stroke="#FFFFFF" strokeWidth="1" />
    <circle cx="10" cy="10.5" r="1" fill="#FFCC00" />
    <circle cx="14" cy="10.5" r="1" fill="#FFCC00" />
    <path d="M9 15.5 Q12 17.5 15 15.5" stroke="#FFCC00" strokeWidth="1" fill="none" strokeLinecap="round" />
  </svg>
);

export const CryptographyLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="none">
    <rect x="5" y="11" width="14" height="10" rx="2" fill="#F97316" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#F97316" strokeWidth="2" fill="none" />
    <circle cx="12" cy="16" r="1.5" fill="#1a1a1a" />
  </svg>
);
