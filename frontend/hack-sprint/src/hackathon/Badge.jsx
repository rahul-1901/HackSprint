export function Badge({ children, className = "" }) {
  return (
    <span
      // REMOVED: Conflicting default styles `bg-gray-200 text-gray-800`
      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${className}`}
    >
      {children}
    </span>
  );
}