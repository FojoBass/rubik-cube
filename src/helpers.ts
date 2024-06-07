export const genRandomNum = (
  limit: number,
  isLower: boolean = true
): number => {
  return isLower
    ? Math.floor(Math.random() * limit)
    : Math.ceil(Math.random() * limit);
};
