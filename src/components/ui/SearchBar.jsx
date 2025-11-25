import { Search } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import { Button } from './Button.jsx';

export function SearchBar({
  isOpen,
  value,
  onChange,
  onSubmit,
  onClose,
  placeholder = '¿Qué estás buscando hoy?',
  buttonLabel = 'Buscar',
}) {
  const inputRef = useRef(null);
  const bodyOverflowRef = useRef('');
  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  useEffect(() => {
    if (!isOpen) return undefined;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!portalTarget) return undefined;
    if (isOpen) {
      bodyOverflowRef.current = portalTarget.style.overflow;
      portalTarget.style.overflow = 'hidden';
    } else {
      portalTarget.style.overflow = bodyOverflowRef.current || '';
    }
    return () => {
      portalTarget.style.overflow = bodyOverflowRef.current || '';
    };
  }, [isOpen, portalTarget]);

  if (!isOpen || !portalTarget) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-60 flex items-start justify-center px-4">
      <button
        type="button"
        aria-label="Cerrar buscador"
        className="absolute inset-0 z-10 bg-black/30"
        onClick={() => onClose?.()}
      />

      <form
        onSubmit={onSubmit}
        className="relative z-20 mt-32 flex w-full max-w-2xl items-center gap-3 rounded-full bg-white px-6 py-3 shadow-2xl"
      >
        <Search className="h-5 w-5 text-neutral-400" />
        <input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          className="w-full border-none bg-transparent text-base text-neutral-700 placeholder:text-neutral-400 focus:outline-none"
          value={value}
          onChange={onChange}
        />
        <Button
          type="submit"
          shape="pill"
          size="sm"
          motion="lift"
          className="font-semibold"
        >
          {buttonLabel}
        </Button>
      </form>
    </div>,
    portalTarget
  );
}
