/**
 * Minimal validation tests for UI tokens.
 * Run with: node frontend/src/config/__tests__/ui-tokens.test.js
 * 
 * Purpose:
 * - Ensure all variant keys exist across Badge/Pill components.
 * - Validate Button configuration arrays have no duplicates.
 * - Check that legacy variants map to valid appearances/intents.
 */

/* eslint-env node */

import {
  PILL_STYLES,
  BADGE_VARIANTS,
  BADGE_SIZES,
  BUTTON_APPEARANCES,
  BUTTON_INTENTS,
  BUTTON_SIZES,
  BUTTON_SHAPES,
  BUTTON_WIDTHS,
  BUTTON_ALIGNS,
  BUTTON_ELEVATIONS,
  BUTTON_ICON_PLACEMENTS,
  DEFAULT_BUTTON_OPTIONS,
  BUTTON_MOTION_EFFECTS,
  BUTTON_LEGACY_VARIANTS,
} from "../ui-tokens.js";

function validateObject(name, obj, expectedKeys = []) {
  const errors = [];
  const keys = Object.keys(obj);

  if (keys.length === 0) {
    errors.push(`${name}: object is empty`);
  }

  // Check each value is truthy (non-empty string or object)
  for (const [key, value] of Object.entries(obj)) {
    if (!value) {
      errors.push(`${name}.${key}: value is null/undefined/empty`);
    }
  }

  // Validate expected keys if provided
  if (expectedKeys.length > 0) {
    for (const expected of expectedKeys) {
      if (!keys.includes(expected)) {
        errors.push(`${name}: missing expected key '${expected}'`);
      }
    }
  }

  return errors;
}

function validateArray(name, arr, minLength = 1) {
  const errors = [];

  if (!Array.isArray(arr)) {
    errors.push(`${name}: not an array`);
    return errors;
  }

  if (arr.length < minLength) {
    errors.push(`${name}: array has ${arr.length} items, expected at least ${minLength}`);
  }

  // Check for duplicates
  const seen = new Set();
  for (const item of arr) {
    if (seen.has(item)) {
      errors.push(`${name}: duplicate value '${item}'`);
    }
    seen.add(item);
  }

  return errors;
}

function validateLegacyVariants() {
  const errors = [];

  for (const [key, config] of Object.entries(BUTTON_LEGACY_VARIANTS)) {
    if (!config) {
      errors.push(`BUTTON_LEGACY_VARIANTS.${key}: config is null/undefined`);
      continue;
    }

    // Validate appearance if present
    if (config.appearance && !BUTTON_APPEARANCES.includes(config.appearance)) {
      errors.push(
        `BUTTON_LEGACY_VARIANTS.${key}: invalid appearance '${config.appearance}'`
      );
    }

    // Validate intent if present
    if (config.intent && !BUTTON_INTENTS.includes(config.intent)) {
      errors.push(`BUTTON_LEGACY_VARIANTS.${key}: invalid intent '${config.intent}'`);
    }

    // Validate shape if present
    if (config.shape && !BUTTON_SHAPES.includes(config.shape)) {
      errors.push(`BUTTON_LEGACY_VARIANTS.${key}: invalid shape '${config.shape}'`);
    }

    // Validate width if present
    if (config.width && !BUTTON_WIDTHS.includes(config.width)) {
      errors.push(`BUTTON_LEGACY_VARIANTS.${key}: invalid width '${config.width}'`);
    }
  }

  return errors;
}

function validateDefaultOptions() {
  const errors = [];

  if (!BUTTON_APPEARANCES.includes(DEFAULT_BUTTON_OPTIONS.appearance)) {
    errors.push(
      `DEFAULT_BUTTON_OPTIONS.appearance: invalid value '${DEFAULT_BUTTON_OPTIONS.appearance}'`
    );
  }

  if (!BUTTON_INTENTS.includes(DEFAULT_BUTTON_OPTIONS.intent)) {
    errors.push(
      `DEFAULT_BUTTON_OPTIONS.intent: invalid value '${DEFAULT_BUTTON_OPTIONS.intent}'`
    );
  }

  if (!BUTTON_SIZES.includes(DEFAULT_BUTTON_OPTIONS.size)) {
    errors.push(`DEFAULT_BUTTON_OPTIONS.size: invalid value '${DEFAULT_BUTTON_OPTIONS.size}'`);
  }

  if (!BUTTON_SHAPES.includes(DEFAULT_BUTTON_OPTIONS.shape)) {
    errors.push(`DEFAULT_BUTTON_OPTIONS.shape: invalid value '${DEFAULT_BUTTON_OPTIONS.shape}'`);
  }

  if (!BUTTON_WIDTHS.includes(DEFAULT_BUTTON_OPTIONS.width)) {
    errors.push(`DEFAULT_BUTTON_OPTIONS.width: invalid value '${DEFAULT_BUTTON_OPTIONS.width}'`);
  }

  if (!BUTTON_ALIGNS.includes(DEFAULT_BUTTON_OPTIONS.align)) {
    errors.push(`DEFAULT_BUTTON_OPTIONS.align: invalid value '${DEFAULT_BUTTON_OPTIONS.align}'`);
  }

  if (!BUTTON_ELEVATIONS.includes(DEFAULT_BUTTON_OPTIONS.elevation)) {
    errors.push(
      `DEFAULT_BUTTON_OPTIONS.elevation: invalid value '${DEFAULT_BUTTON_OPTIONS.elevation}'`
    );
  }

  if (!BUTTON_ICON_PLACEMENTS.includes(DEFAULT_BUTTON_OPTIONS.iconPlacement)) {
    errors.push(
      `DEFAULT_BUTTON_OPTIONS.iconPlacement: invalid value '${DEFAULT_BUTTON_OPTIONS.iconPlacement}'`
    );
  }

  return errors;
}

function runTests() {
  const results = [];

  // Pill Styles
  results.push(...validateObject("PILL_STYLES", PILL_STYLES, ["primary", "success", "warning", "error", "info", "neutral"]));

  // Badge Variants
  results.push(...validateObject("BADGE_VARIANTS", BADGE_VARIANTS, ["primary", "secondary", "accent", "neutral", "success", "warning", "error"]));

  // Badge Sizes
  results.push(...validateObject("BADGE_SIZES", BADGE_SIZES, ["sm", "md", "lg"]));

  // Button Arrays
  results.push(...validateArray("BUTTON_APPEARANCES", BUTTON_APPEARANCES, 5));
  results.push(...validateArray("BUTTON_INTENTS", BUTTON_INTENTS, 5));
  results.push(...validateArray("BUTTON_SIZES", BUTTON_SIZES, 3));
  results.push(...validateArray("BUTTON_SHAPES", BUTTON_SHAPES, 3));
  results.push(...validateArray("BUTTON_WIDTHS", BUTTON_WIDTHS, 2));
  results.push(...validateArray("BUTTON_ALIGNS", BUTTON_ALIGNS, 2));
  results.push(...validateArray("BUTTON_ELEVATIONS", BUTTON_ELEVATIONS, 2));
  results.push(...validateArray("BUTTON_ICON_PLACEMENTS", BUTTON_ICON_PLACEMENTS, 2));
  results.push(...validateArray("BUTTON_MOTION_EFFECTS", BUTTON_MOTION_EFFECTS, 3));

  // Default Options
  results.push(...validateDefaultOptions());

  // Legacy Variants
  results.push(...validateLegacyVariants());

  return results;
}

// Run validation
const errors = runTests();

if (errors.length === 0) {
  console.log("✅ All UI tokens are valid!");
  // eslint-disable-next-line no-undef
  if (typeof process !== "undefined") process.exit(0);
} else {
  console.error("❌ UI tokens validation failed:");
  errors.forEach((err) => console.error(`  - ${err}`));
  // eslint-disable-next-line no-undef
  if (typeof process !== "undefined") process.exit(1);
  throw new Error("UI tokens validation failed");
}
