import {ResourceTypes} from "@contentScript/types/resourceTypes";

export enum RecyclerTypes {
  furnace = 6,
  NPZ = 10,
  cityRecycler = 11,
  banditRecycler = 12,
  carrierStones = 14,
  carrierSulfur = 15,
  carrierOre = 16,
  plant = 17,
  barn = 18,
  carrierBig = 19,
}

export type VariationItem = {
  from: {
    itemID: ResourceTypes;
    time: number;
  };
  to: {
    itemID: ResourceTypes;
    quantity: number;
  }[];
}

export type Variation = {
  fuel: null | VariationItem & { slotID: number };
  items: null | VariationItem[];
}

export type loadedItem = {
  slotID: number;
  itemID: ResourceTypes | null;
  quantity: number | null;
}

export type RecyclerInfo = {
  status: string;
  message: string;
  data: {
    status: 1 | 0;
    startTime: number | null;
    variations: Variation[];
    in: loadedItem[];
    out: loadedItem[];
  };
}