export function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-4 ${className}`}>
      {children}
    </div>
  );
}
