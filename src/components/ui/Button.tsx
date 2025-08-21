import { ReactNode } from "react";

const Button = ({ children }: { children: ReactNode }) => {
  return (
    <button className="flex w-full h-8 sm:h-10 py-2 sm:py-3 px-4 sm:px-6 justify-center items-center gap-[10px] self-stretch rounded-lg border-2 border-gray-warm-300 text-gray-warm-700 text-center text-xs sm:text-sm font-semibold leading-[100%] tracking-[-0.32px]">
      {children}
    </button>
  );
};

export default Button;
