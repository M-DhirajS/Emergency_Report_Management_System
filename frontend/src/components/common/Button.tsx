interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
}

/**
 * Reusable Button component with variants and loading/disabled state support.
 */
function Button({
  text,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}: ButtonProps) {

  const baseStyle = "px-6 py-3 rounded-lg font-semibold transition duration-300";

  const variantStyle = variant === "primary"
    ? disabled
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-red-600 text-white hover:bg-red-700"
    : disabled
      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
      : "bg-gray-300 text-black hover:bg-gray-400";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} w-full ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;

