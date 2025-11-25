/**
 * Accessibility test: Color contrast validation
 * Run with: node frontend/src/config/__tests__/accessibility.test.js
/* eslint-env node */

// Color contrast calculation utilities
function hexToRgb(hex) {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return { r, g, b };
}

function relativeLuminance(rgb) {
  const { r, g, b } = rgb;
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

function contrastRatio(color1Hex, color2Hex) {
  const lum1 = relativeLuminance(hexToRgb(color1Hex));
  const lum2 = relativeLuminance(hexToRgb(color2Hex));
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

function checkContrast(foreground, background, level = "AA", largeText = false) {
  const ratio = contrastRatio(foreground, background);
  
  let minRatio;
  if (level === "AAA") {
    minRatio = largeText ? 4.5 : 7;
  } else {
    minRatio = largeText ? 3 : 4.5;
  }
  
  return {
    ratio: ratio.toFixed(2),
    passes: ratio >= minRatio,
    minRatio,
    level,
    largeText,
  };
}

// Test color pairs from design system
const COLOR_TESTS = [
  // Primary colors on light backgrounds
  { name: "Primary1 on Neutral1", fg: "#6B5444", bg: "#FAF8F5" },
  { name: "Primary2 on Neutral2", fg: "#52443A", bg: "#FEFCFA" },
  { name: "Primary3 on White", fg: "#A67B5B", bg: "#FFFFFF" },
  
  // Text on backgrounds
  { name: "Text on Neutral1", fg: "#52443A", bg: "#FAF8F5" },
  { name: "Text Secondary on Neutral2", fg: "#9B8F82", bg: "#FEFCFA" },
  { name: "Text on Dark on Primary1", fg: "#ccc7be", bg: "#6B5444" },
  
  // Status colors
  { name: "Success on White", fg: "#7A8B6F", bg: "#FFFFFF" },
  { name: "Warning on White", fg: "#B8956A", bg: "#FFFFFF" },
  { name: "Error on White", fg: "#B8836B", bg: "#FFFFFF" },
  
  // Button combinations (primary on white)
  { name: "Primary1 Button BG on White", fg: "#6B5444", bg: "#FFFFFF" },
  { name: "White Text on Primary1 Button", fg: "#FFFFFF", bg: "#6B5444" },
  
  // Badge combinations
  { name: "White on Primary3 Badge", fg: "#FFFFFF", bg: "#A67B5B" },
  { name: "White on Success Badge", fg: "#FFFFFF", bg: "#7A8B6F" },
  { name: "Dark on Warning Badge", fg: "#3A3632", bg: "#B8956A" },
  { name: "White on Error Badge", fg: "#FFFFFF", bg: "#B8836B" },
];

function runAccessibilityTests() {
  const results = [];
  let failures = 0;

  console.log("🎨 WCAG 2.1 Color Contrast Validation\n");
  console.log("=" .repeat(80));
  
  for (const test of COLOR_TESTS) {
    const aaResult = checkContrast(test.fg, test.bg, "AA", false);
    const aaaResult = checkContrast(test.fg, test.bg, "AAA", false);
    const aaLargeResult = checkContrast(test.fg, test.bg, "AA", true);
    
    results.push({
      name: test.name,
      fg: test.fg,
      bg: test.bg,
      aa: aaResult,
      aaa: aaaResult,
      aaLarge: aaLargeResult,
    });
    
    const status = aaResult.passes ? "✅ PASS" : "❌ FAIL";
    console.log(`\n${status} ${test.name}`);
    console.log(`  Foreground: ${test.fg}`);
    console.log(`  Background: ${test.bg}`);
    console.log(`  Contrast Ratio: ${aaResult.ratio}:1`);
    console.log(`  AA Normal Text (4.5:1):  ${aaResult.passes ? "✅" : "❌"}`);
    console.log(`  AA Large Text (3:1):     ${aaLargeResult.passes ? "✅" : "❌"}`);
    console.log(`  AAA Normal Text (7:1):   ${aaaResult.passes ? "✅" : "❌"}`);
    
    if (!aaResult.passes) {
      failures++;
      console.log(`  ⚠️  Recommendation: Adjust colors to meet AA standards`);
    }
  }
  
  console.log("\n" + "=".repeat(80));
  console.log(`\n📊 Summary:`);
  console.log(`   Total tests: ${COLOR_TESTS.length}`);
  console.log(`   Passed: ${COLOR_TESTS.length - failures}`);
  console.log(`   Failed: ${failures}`);
  
  if (failures > 0) {
    console.log(`\n⚠️  ${failures} color combination(s) do not meet WCAG AA standards`);
    console.log(`   Consider adjusting colors or using them only for large text`);
  } else {
    console.log(`\n✅ All color combinations meet WCAG AA standards!`);
  }
  
  return failures;
}

// Run tests
const failures = runAccessibilityTests();

// Exit with appropriate code
/* eslint-disable no-undef */
if (typeof process !== "undefined") {
  process.exit(failures > 0 ? 1 : 0);
}
/* eslint-enable no-undef */
