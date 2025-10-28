export const formatError = (error) => {
  if (error.code === 11000) {
    return 'Email already exists';
  }
  if (error.name === 'ZodError' && error.issues && Array.isArray(error.issues)) {
    return error.issues.map(e => e.message).join(', ');
  }
  return error.message || 'An error occurred';
};
