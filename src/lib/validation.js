/**
 * Validation utilities for auth forms
 */

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};

// Phone validation (basic)
export const validatePhone = (phone) => {
  if (!phone) return "Phone number is required";
  const phoneRegex = /^[\d\s\-+()]{10,}$/;
  if (!phoneRegex.test(phone)) return "Please enter a valid phone number";
  return null;
};

// Name validation
export const validateName = (name) => {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  return null;
};

// Business name validation
export const validateBusinessName = (name) => {
  if (!name) return "Business name is required";
  if (name.length < 2) return "Business name must be at least 2 characters";
  return null;
};

// Category validation
export const validateCategory = (category) => {
  if (!category) return "Please select an industry";
  return null;
};

// Validate all fields at once
export const validateSignupForm = (data) => {
  const errors = {};
  
  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate business registration form
export const validateBusinessForm = (data) => {
  const errors = {};
  
  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  const businessNameError = validateBusinessName(data.businessName);
  if (businessNameError) errors.businessName = businessNameError;
  
  const categoryError = validateCategory(data.category);
  if (categoryError) errors.category = categoryError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
