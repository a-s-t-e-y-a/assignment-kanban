export const formatError = (error) => {
  if (error.code === 11000) {
    return 'Email already exists';
  }
  if (error.name === 'ZodError') {
    return error.errors.map(e => e.message).join(', ');
  }
  return error.message;
};
