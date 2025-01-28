export const isTokenExpired = (expiry: number | null): boolean => {
  if (!expiry) return true;
  return Date.now() > expiry;
};
