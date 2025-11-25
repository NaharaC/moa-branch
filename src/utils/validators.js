// EMAIL (validación básica)
function validateEmail(value) {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

// PASSWORD (mínimo 'min' caracteres, con letras y números)
function validatePassword(value, min = 8) {
  if (typeof value !== 'string') return false;
  const v = value;
  const long = v.length >= min;
  const hasLetter = /[A-Za-z]/.test(v);
  const hasDigit  = /\d/.test(v);
  return long && hasLetter && hasDigit;
}

export { validateEmail, validatePassword };