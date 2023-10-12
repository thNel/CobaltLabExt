import {ResourceTypes} from "@/types/resourceTypes";

export type WorkerSettings = {
  acs: {
    autoSelectTool: boolean,
    autoRepairTool: boolean,
    autoDeleteTool: boolean,
    delay: number,
    deleteList: ResourceTypes[],
  };
}