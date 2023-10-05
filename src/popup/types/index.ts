import {ResourceTypes} from "@/types/resourceTypes";

export type BidType = [number, number, number, number, number];

export type ShopInfo = {
  itemID: number,
  from: {
    itemID: ResourceTypes,
    quantity: number
  },
  to: {
    itemID: ResourceTypes,
    quantity: number
  }
}