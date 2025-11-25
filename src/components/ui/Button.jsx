import React, { forwardRef } from "react";
import { cx } from "../../utils/ui-helpers.js";
import {
  BUTTON_APPEARANCES,
  BUTTON_INTENTS,
  BUTTON_SIZES,
  BUTTON_SHAPES,
  BUTTON_WIDTHS,
  BUTTON_ALIGNS,
  BUTTON_ELEVATIONS,
  BUTTON_ICON_PLACEMENTS,
  DEFAULT_BUTTON_OPTIONS,
  BUTTON_LEGACY_VARIANTS,
} from "../../config/ui-tokens.js";

/* -------------------------------------------------------------------------- */
/* Configuración y constantes                                                 */
/* -------------------------------------------------------------------------- */

const BUTTON_BASE_CLASS = "btn";

const BLEED_VALUE = "var(--spacing-sm)";
const BLEED_MAP = {
  x: ["marginLeft", "marginRight"],
  y: ["marginTop", "marginBottom"],
  top: ["marginTop"],
  bottom: ["marginBottom"],
  left: ["marginLeft"],
  right: ["marginRight"],
  all: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
};

const MOTION_CLASSNAMES = {
  lift: "motion-lift",
  underline: "motion-underline",
  "icon-slide": "motion-icon-slide",
  expand: "motion-expand",
  ripple: "motion-ripple",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function ensureOption(value, allowed, fallback) {
  if (value && allowed.includes(value)) {
    return value;
  }
  return fallback;
}

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") return value.split(/[\s,]+/).filter(Boolean);
  return [value];
}

function mergeMotionProps(baseMotion, overrideMotion) {
  const merged = [...toArray(baseMotion), ...toArray(overrideMotion)];
  return merged.length ? merged : undefined;
}

function buildMotionClassNames(motion, ripple) {
  const tokens = new Set(toArray(motion).map((token) => `${token}`.trim()).filter(Boolean));
  if (ripple) tokens.add("ripple");
  return Array.from(tokens)
    .map((token) => MOTION_CLASSNAMES[token])
    .filter(Boolean);
}

function resolveWidthAttr(widthValue, fullWidth) {
  const candidate = widthValue ?? (fullWidth ? "full" : undefined) ?? DEFAULT_BUTTON_OPTIONS.width;
  if (candidate === "fit") return "auto";
  if (candidate === "auto" || candidate === "full" || candidate === "stretch") return candidate;
  return DEFAULT_BUTTON_OPTIONS.width === "fit" ? "auto" : DEFAULT_BUTTON_OPTIONS.width;
}

function applyBleedToStyle(inlineStyle = {}, bleed) {
  if (!bleed || bleed === "none") return inlineStyle;
  const style = { ...inlineStyle };
  const entries = Array.isArray(bleed)
    ? bleed
    : `${bleed}`
        .split(/[\s,]+/)
        .map((entry) => entry.trim())
        .filter(Boolean);

  entries.forEach((entry) => {
    const key = entry.toLowerCase();
    const directions = BLEED_MAP[key];
    if (!directions) return;
    directions.forEach((prop) => {
      style[prop] = `calc(${BLEED_VALUE} * -1)`;
    });
  });

  return style;
}

function createPresetButton(displayName, { defaultProps = {}, presetClasses = [] } = {}) {
  const PresetButton = forwardRef(function PresetButton(
    { className, motion, ...rest },
    ref
  ) {
    const mergedMotion = mergeMotionProps(defaultProps.motion, motion);

    return (
      <Button
        ref={ref}
        {...defaultProps}
        {...rest}
        motion={mergedMotion}
        className={cx(...presetClasses, className)}
      />
    );
  });

  PresetButton.displayName = displayName;
  return PresetButton;
}

/* Componente base-------------------------------------------------------------------------- */

export const Button = forwardRef(function Button(
  {
    appearance,
    intent,
    size,
    shape,
    width,
    fullWidth,
    align,
    elevation,
    motion,
    ripple = false,
    bleed,

    icon,
    iconTrailing,
    leadingIcon,
    trailingIcon,
    leftIcon,
    rightIcon,
    iconPlacement = DEFAULT_BUTTON_OPTIONS.iconPlacement,
    iconOnly: iconOnlyProp,

    loading = false,
    disabled: disabledProp,

    as,
    href,
    type,
    className,
    style,
    children,
    "aria-label": ariaLabel,

    // Props legacy ------------------------------------------------------
    variant: legacyVariant,
    tone: legacyTone,

    ...rest
  },
  ref
) {
  const legacyPreset = legacyVariant ? BUTTON_LEGACY_VARIANTS[legacyVariant] : null;

  const resolvedAppearance = ensureOption(
    appearance ?? legacyPreset?.appearance,
    BUTTON_APPEARANCES,
    DEFAULT_BUTTON_OPTIONS.appearance
  );
  const resolvedIntent = ensureOption(
    intent ?? legacyPreset?.intent ?? legacyTone,
    BUTTON_INTENTS,
    DEFAULT_BUTTON_OPTIONS.intent
  );
  const resolvedSize = ensureOption(
    size ?? legacyPreset?.size,
    BUTTON_SIZES,
    DEFAULT_BUTTON_OPTIONS.size
  );
  const resolvedShape = ensureOption(
    shape ?? legacyPreset?.shape,
    BUTTON_SHAPES,
    DEFAULT_BUTTON_OPTIONS.shape
  );
  const resolvedAlign = ensureOption(
    align ?? legacyPreset?.align,
    BUTTON_ALIGNS,
    DEFAULT_BUTTON_OPTIONS.align
  );
  const resolvedElevation = ensureOption(
    elevation ?? legacyPreset?.elevation,
    BUTTON_ELEVATIONS,
    DEFAULT_BUTTON_OPTIONS.elevation
  );
  const resolvedWidthAttr = resolveWidthAttr(width ?? legacyPreset?.width, Boolean(fullWidth));
  const resolvedIconPlacement = ensureOption(
    iconPlacement ?? legacyPreset?.iconPlacement,
    BUTTON_ICON_PLACEMENTS,
    DEFAULT_BUTTON_OPTIONS.iconPlacement
  );

  const mergedMotion = mergeMotionProps(legacyPreset?.motion, motion);
  const motionClasses = buildMotionClassNames(mergedMotion, ripple || legacyPreset?.ripple);
  const inlineStyle = applyBleedToStyle(style, bleed ?? legacyPreset?.bleed);
  const computedStyle = inlineStyle && Object.keys(inlineStyle).length > 0 ? inlineStyle : undefined;

  const directIcon = icon ?? legacyPreset?.icon ?? null;
  const trailingIconProp = iconTrailing ?? legacyPreset?.iconTrailing ?? null;

  let startIcon = leadingIcon ?? leftIcon ?? legacyPreset?.leadingIcon ?? null;
  let endIcon =
    trailingIcon ?? rightIcon ?? legacyPreset?.trailingIcon ?? trailingIconProp ?? null;

  if (directIcon) {
    if (resolvedIconPlacement === "end") {
      endIcon = directIcon;
    } else if (resolvedIconPlacement === "only") {
      startIcon = directIcon;
      endIcon = null;
    } else {
      startIcon = directIcon;
    }
  }

  const fallbackIconOnly =
    (resolvedIconPlacement === "only" && (startIcon || endIcon)) ||
    (!children && (startIcon || endIcon));

  const derivedIconOnly = Boolean(
    iconOnlyProp ?? legacyPreset?.iconOnly ?? fallbackIconOnly
  );

  const disabled = Boolean(disabledProp || loading);
  const Comp = as || (href ? "a" : "button");
  const isButtonElement = Comp === "button";

  const sharedProps = {
    ref,
    href,
    type: isButtonElement ? type || "button" : undefined,
    disabled: isButtonElement ? disabled : undefined,
    "aria-disabled": !isButtonElement ? disabled : undefined,
    tabIndex: disabled ? -1 : rest.tabIndex,
    "data-appearance": resolvedAppearance,
    "data-intent": resolvedIntent,
    "data-size": resolvedSize,
    "data-shape": resolvedShape,
    "data-width": resolvedWidthAttr,
    "data-align": resolvedAlign,
    "data-elevation": resolvedElevation,
    "data-loading": loading ? "true" : undefined,
    "data-disabled": disabled ? "true" : undefined,
    "data-icon-only": derivedIconOnly ? "true" : undefined,
    className: cx(BUTTON_BASE_CLASS, ...motionClasses, legacyPreset?.className, className),
    style: computedStyle,
    ...(disabled && !isButtonElement
      ? {
          onClick: (event) => event.preventDefault(),
        }
      : null),
    ...rest,
  };

  const showSpinner = loading;

  if (derivedIconOnly) {
    const iconNode = startIcon || endIcon || children;

    return (
      <Comp
        {...sharedProps}
        aria-label={ariaLabel}
      >
        {showSpinner ? (
          <span className="btn-spinner" aria-hidden="true" />
        ) : (
          <span className="btn-icon" aria-hidden="true">
            {iconNode}
          </span>
        )}
      </Comp>
    );
  }

  return (
    <Comp
      {...sharedProps}
      aria-label={ariaLabel}
    >
      {showSpinner && (
        <span
          className={cx("btn-spinner", children && "mr-2")}
          aria-hidden="true"
        />
      )}

      {!showSpinner && startIcon && (
        <span className="btn-icon btn-icon-left" aria-hidden="true">
          {startIcon}
        </span>
      )}

      {children && <span className="btn-label">{children}</span>}

      {!showSpinner && endIcon && (
        <span className="btn-icon btn-icon-right" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </Comp>
  );
});

/* Derivados-------------------------------------------------------------------------- */

export function IconButton({
  icon,
  "aria-label": ariaLabel,
  size = "sm",
  appearance = "ghost",
  intent = "neutral",
  shape = "circle",
  className,
  motion = "lift",
  ...rest
}) {
  return (
    <Button
      appearance={appearance}
      intent={intent}
      size={size}
      shape={shape}
      icon={icon}
      iconPlacement="only"
      aria-label={ariaLabel}
      motion={motion}
      className={className}
      {...rest}
    />
  );
}

export function ButtonGroup({
  children,
  className,
  gap = "0.5rem",
  attached = false,
  orientation = "horizontal",
  justify = "start",
  wrap = false,
}) {
  const orientationClass = orientation === "vertical" ? "flex-col" : "items-center";
  const justifyClass = justify === "center" ? "justify-center" : justify === "end" ? "justify-end" : "justify-start";

  return (
    <div
      className={cx(
        "inline-flex",
        orientationClass,
        justifyClass,
        wrap && "flex-wrap",
        attached && "btn-group-attached",
        className
      )}
      style={attached ? undefined : { gap }}
      data-orientation={orientation}
    >
      {children}
    </div>
  );
}

export const LiftButton = createPresetButton("LiftButton", {
  defaultProps: { motion: "lift" },
});

export const UnderlineButton = createPresetButton("UnderlineButton", {
  defaultProps: { appearance: "link", motion: "underline" },
});

export const IconSlideButton = createPresetButton("IconSlideButton", {
  defaultProps: { motion: ["lift", "icon-slide"] },
});

export const AnimatedCTAButton = function AnimatedCTAButton({
  icon,
  label,
  className,
  children,
  motion = ["lift", "icon-slide"],
  ...rest
}) {
  return (
    <Button
      appearance="ghost"
      intent="inverse"
      motion={motion}
      className={cx("btn-animated", className)}
      {...rest}
    >
      {icon && (
        <span className="btn-animated-icon" aria-hidden="true">
          {icon}
        </span>
      )}

      {children && <span className="btn-label">{children}</span>}

      {label && (
        <span className="btn-animated-label">
          {label}
        </span>
      )}
    </Button>
  );
};
