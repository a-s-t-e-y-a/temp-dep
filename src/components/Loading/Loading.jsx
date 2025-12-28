
const SIZE_MAP = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-4',
  lg: 'w-16 h-16 border-4',
};

export default function Loading({
  size = 'md',
  text = '',
  variant = 'inline',
  className = '',
}) {
  const spinnerSize = SIZE_MAP[size] || SIZE_MAP.md;

  // wrapper variants
  const variantClass =
    variant === 'fullscreen'
      ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm'
      : variant === 'card'
      ? 'inline-flex items-center gap-4 p-6 rounded-2xl shadow-md bg-white'
      : 'inline-flex items-center gap-3';

  return (
    <div className={`${variantClass} ${className}`.trim()} role="status" aria-live="polite">
      <svg
        className={`${spinnerSize} animate-spin text-primary-600`} 
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>

      {text ? (
        <div className="flex flex-col">
          <span className="font-medium text-sm text-gray-700">{text}</span>
          {/* optional tiny hint */}
          <span className="text-xs text-gray-500">Please wait…</span>
        </div>
      ) : null}
    </div>
  );
}

