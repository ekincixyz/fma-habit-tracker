interface AddEntryButtonProps {
  onClick: () => void;
}

export default function AddEntryButton({ onClick }: AddEntryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-green-600 hover:bg-green-500 text-white flex items-center justify-center shadow-lg transition-colors"
      aria-label="Add new entry"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  );
} 