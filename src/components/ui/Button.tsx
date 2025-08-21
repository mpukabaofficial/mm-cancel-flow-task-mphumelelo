import { MouseEventHandler, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const Button = ({ children, onClick, disabled }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="hover:bg-gray-50 transition-colors ease-in-out duration-150 flex w-full h-8 sm:h-10 py-2 sm:py-3 px-4 sm:px-6 justify-center items-center gap-[10px] self-stretch rounded-lg border-2 border-gray-warm-300 text-gray-warm-700 text-center text-xs sm:text-sm font-semibold leading-[100%] tracking-[-0.32px]"
    >
      {children}
    </button>
  );
};

export default Button;
