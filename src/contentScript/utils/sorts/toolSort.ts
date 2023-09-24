import {filteredTool} from "../../types/tools";

export const toolSortFn = (a: filteredTool, b: filteredTool) => {
  if (+a.type!.slice(-1) < +b.type!.slice(-1))
    return -1;
  if (+a.type!.slice(-1) > +b.type!.slice(-1))
    return 1;
  return a.durability - b.durability
}