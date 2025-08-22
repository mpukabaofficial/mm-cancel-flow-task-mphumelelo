import { ReactNode, MouseEventHandler } from "react";

interface Props {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  isSelected?: boolean;
}

const Button = ({ children, onClick, disabled, isSelected = false }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex w-full h-8 sm:h-10 py-2 sm:py-3 px-4 justify-center items-center gap-[10px]
        rounded-lg border-2 text-center text-xs sm:text-sm font-semibold leading-[100%] tracking-[-0.32px]
        transition-all ease-in-out duration-150 shadow-sm
        ${
          disabled
            ? "bg-gray-warm-300 text-gray-warm-500 border-gray-warm-300"
            : isSelected
            ? "bg-Theme-Success text-white border-Theme-Success hover:border-green-600"
            : "bg-white border-gray-warm-300 text-gray-warm-700 hover:bg-gray-50 hover:border-gray-400"
        }
      `}
    >
      {children}
    </button>
  );
};

export default Button;
