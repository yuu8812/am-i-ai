export const extractToken = (bearerToken: string) => {
  const token = bearerToken.split('Bearer ')[1];
  return token;
};
