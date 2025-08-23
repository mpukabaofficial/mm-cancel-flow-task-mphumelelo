import CheckedIcon from "./ui/CheckedIcon";

const OptionItem = ({
  checked,
  text,
  onClick,
}: {
  checked: boolean;
  text: string;
  onClick?: () => void;
}) => (
  <div
    className={`flex gap-3 items-center ${onClick ? "cursor-pointer" : ""}`}
    onClick={onClick}
  >
    <CheckedIcon checked={checked} />
    <span className="text-normal">{text}</span>
  </div>
);

export default OptionItem;
