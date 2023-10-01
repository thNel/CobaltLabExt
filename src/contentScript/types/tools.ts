import {ResourceTypes} from "@contentScript/types/resourceTypes";

export type InventoryItem = {
  availableAfter: number | null;
  durability: number | null;
  itemID: ResourceTypes | null;
  quantity: number | null;
  slotID: number;
};

export type filteredTool = {
  availableAfter: number | null;
  durability: number;
  itemID: ResourceTypes;
  quantity: number;
  slotID: number;
  type: keyof typeof ResourceTypes;
}