const ScreenShareIcon = ({ className, width = 24, height = 24, color = "currentColor" }: { className?: string, width?: number, height?: number, color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className={`lucide lucide-screen-share-icon lucide-screen-share ${className}`}
    viewBox="0 0 24 24"
  >
    <path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3M8 21h8M12 17v4M17 8l5-5M17 3h5v5"></path>
  </svg>
);

export default ScreenShareIcon;
