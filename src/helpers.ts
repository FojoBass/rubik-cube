export const genRandomNum = (
  limit: number,
  isLower: boolean = true
): number => {
  return isLower
    ? Math.floor(Math.random() * limit)
    : Math.ceil(Math.random() * limit);
};

export const formatDuration = (dur: number): string => {
  const hours = Math.floor(dur / 3600);
  const mins = Math.floor((dur % 3600) / 60);
  const secs = Math.floor(dur % 60);

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
