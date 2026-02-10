const Arrow = ({
  className,
  width = 24,
  height = 24,
  color = "currentColor",
}: {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className={`lucide lucide-undo-icon lucide-undo ${className}`}
    viewBox="0 0 24 24"
  >
    <path d="M3 7v6h6"></path>
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
  </svg>
);

export default Arrow;
