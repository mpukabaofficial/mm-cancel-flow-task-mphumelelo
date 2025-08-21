import React from "react";

interface HorizontalLineProps {
  className?: string;
  color?: "gray-warm-300" | "gray-warm-700" | "gray-warm-800";
  thickness?: "1" | "2" | "4";
}

const HorizontalLine = ({
  className = "",
  color = "gray-warm-300",
  thickness = "1",
}: HorizontalLineProps) => {
  const borderClass = `border-${color}`;
  const thicknessClass =
    thickness === "1" ? "border-t" : `border-t-${thickness}`;

  return (
    <div className={`w-full ${thicknessClass} ${borderClass} ${className}`} />
  );
};

export default HorizontalLine;
