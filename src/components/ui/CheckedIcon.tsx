interface Props {
  checked: boolean;
}

const CheckedIcon = ({ checked }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    {checked ? (
      // ✅ Checked: outer black circle + inner white circle
      <>
        <circle cx="12" cy="12" r="10" fill="black" />
        <circle cx="12" cy="12" r="3" fill="white" />
      </>
    ) : (
      // ⭕ Unchecked: white circle with black outline
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="white"
        stroke="black"
        strokeWidth={1}
      />
    )}
  </svg>
);

export default CheckedIcon;
