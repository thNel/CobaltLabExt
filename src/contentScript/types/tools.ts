export type inventoryItem = {
  availableAfter: number | null;
  durability: number | null;
  itemID: number | null;
  quantity: number | null;
  slotID: number;
};

export type filteredTool = {
  availableAfter: number | null;
  durability: number;
  itemID: number;
  quantity: number;
  slotID: number;
  type: string | undefined;
}