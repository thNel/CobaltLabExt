export const sortByCell = (a: {
  id: string | undefined,
  label: string,
  isUser: boolean,
  type: "ore" | "road" | "wood" | undefined
}, b: {
  id: string | undefined,
  label: string,
  isUser: boolean,
  type: "ore" | "road" | "wood" | undefined
}) => {
  if (a.label[0] > b.label[0]) {
    return 1
  }
  if (a.label[0] < b.label[0]) {
    return -1
  }
  return +a.label.slice(1) - +b.label.slice(1);
}