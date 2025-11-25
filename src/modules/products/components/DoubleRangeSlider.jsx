import { useCallback, useEffect, useRef } from "react";
import { clamp } from "../../../utils/math.js";

export function DoubleRangeSlider({
  min = 0,
  max = 100,
  valueMin,
  valueMax,
  onChange,
  step = 1,
}) {
  const trackRef = useRef(null);
  const valuesRef = useRef({ min: valueMin ?? min, max: valueMax ?? max });

  useEffect(() => {
    valuesRef.current = {
      min: valueMin ?? min,
      max: valueMax ?? max,
    };
  }, [valueMin, valueMax, min, max]);

  const percent = useCallback(
    (value) => ((value - min) / (max - min || 1)) * 100,
    [min, max]
  );

  const handlePointer = useCallback(
    (activeHandle) => (event) => {
      event.preventDefault();
      event.stopPropagation();

      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();

      const updateFromClientX = (clientX) => {
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
        const rawValue = min + ratio * (max - min);
        const stepped = Math.round(rawValue / step) * step;
        const rounded = clamp(stepped, min, max);

        const current = valuesRef.current;

        if (activeHandle === "min") {
          const nextMin = Math.min(rounded, current.max);
          valuesRef.current = { min: nextMin, max: current.max };
          onChange?.(nextMin, current.max);
        } else {
          const nextMax = Math.max(rounded, current.min);
          valuesRef.current = { min: current.min, max: nextMax };
          onChange?.(current.min, nextMax);
        }
      };

      updateFromClientX(event.clientX);

      const pointerMove = (moveEvent) => updateFromClientX(moveEvent.clientX);
      const pointerUp = () => {
        document.removeEventListener("pointermove", pointerMove);
        document.removeEventListener("pointerup", pointerUp);
      };

      document.addEventListener("pointermove", pointerMove);
      document.addEventListener("pointerup", pointerUp, { once: true });
    },
    [min, max, onChange, step]
  );

  const adjustValue = useCallback(
    (handle, delta) => {
      const current = valuesRef.current;
      if (handle === "min") {
        const nextMin = clamp(current.min + delta, min, current.max);
        valuesRef.current = { min: nextMin, max: current.max };
        onChange?.(nextMin, current.max);
      } else {
        const nextMax = clamp(current.max + delta, current.min, max);
        valuesRef.current = { min: current.min, max: nextMax };
        onChange?.(current.min, nextMax);
      }
    },
    [min, max, onChange]
  );

  const handleKeyDown = useCallback(
    (handle) => (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();
        adjustValue(handle, -step);
      }
      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();
        adjustValue(handle, step);
      }
      if (event.key === "Home") {
        event.preventDefault();
        if (handle === "min") adjustValue(handle, min - valuesRef.current.min);
        else adjustValue(handle, min - valuesRef.current.max);
      }
      if (event.key === "End") {
        event.preventDefault();
        if (handle === "min") adjustValue(handle, max - valuesRef.current.min);
        else adjustValue(handle, max - valuesRef.current.max);
      }
    },
    [adjustValue, min, max, step]
  );

  return (
    <div className="relative h-10">
      <div
        ref={trackRef}
        className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-neutral-200"
      >
        <div
          className="absolute h-full rounded-full bg-(--color-primary1,#6B5444)"
          style={{
            left: `${percent(valueMin ?? min)}%`,
            right: `${100 - percent(valueMax ?? max)}%`,
          }}
        />
      </div>

      <button
        type="button"
        className="slider-handle absolute top-1/2 -translate-y-1/2"
        style={{ left: `calc(${percent(valueMin ?? min)}% - 9px)` }}
        onPointerDown={handlePointer("min")}
        aria-label="Precio mínimo"
        onKeyDown={handleKeyDown("min")}
        tabIndex={0}
      />

      <button
        type="button"
        className="slider-handle absolute top-1/2 -translate-y-1/2"
        style={{ left: `calc(${percent(valueMax ?? max)}% - 9px)` }}
        onPointerDown={handlePointer("max")}
        aria-label="Precio máximo"
        onKeyDown={handleKeyDown("max")}
        tabIndex={0}
      />
    </div>
  );
}
