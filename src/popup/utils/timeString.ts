export const timeString = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  const sec = Math.floor(seconds % 60);
  return `${hours ? hours + 'ч ' : ''}${min || hours ? min + 'м ' : ''}${sec + 'c'}`;
}