export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const validatePassword = (password: string): boolean =>
  password.length >= 8

export const validateCardNumber = (cardNumber: string): boolean =>
  /^\d{16}$/.test(cardNumber)

export const validateExpiry = (expiry: string): boolean =>
  /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)

export const validateCVV = (cvv: string): boolean =>
  /^\d{3}$/.test(cvv)
