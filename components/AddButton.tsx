interface AddButtonProps {
  onClick?: () => void;
  label?: string;
}

export default function AddButton({ onClick, label = "Add" }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="ml-4 bg-[#DFCDC1] hover:bg-[#C8A893] text-white px-4 py-2 rounded-lg"
    >
      {label}
    </button>
  );
}
