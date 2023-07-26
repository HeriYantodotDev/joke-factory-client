import { ButtonProps } from './Button.types';

export default function Button({
  onClick,
  disabled,
  buttonLabel,
  children,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
      rounded-md" 
        mx-auto mt-4
        bg-blue-500 
        px-4 
        py-2 text-white hover:bg-blue-600
        hover:text-white 
      `}
    >
      {children || buttonLabel}
    </button>
  );
}
