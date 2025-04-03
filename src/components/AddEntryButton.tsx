interface AddEntryButtonProps {
  onClick: () => void;
}

export default function AddEntryButton({ onClick }: AddEntryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#018A08] rounded-full flex items-center justify-center shadow-lg hover:bg-[#016A06] transition-colors"
      aria-label="Add new entry"
    >
      <svg
        className="w-8 h-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
} 