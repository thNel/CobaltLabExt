export enum RecyclerTypes {
  'forge' = 6,
  'NPZ' = 10,
  'cityRecycler' = 11,
  'banditRecycler' = 12,
  'barn' = 18,
  'plant' = 17,
}

export type RecyclerInfo = {
  status: string;
  message: string;
  data: {
    status: 1 | 0;
    startTime: number | null;
    variations: [
      {
        fuel: null | {
          slotID: number;
          from: {
            "itemID": number;
            "time": number;
          };
          to:
            {
              itemID: number;
              quantity: number;
            }[];
        };
        items:
          {
            from: {
              itemID: number;
              time: number;
            };
            to: {
              itemID: number;
              quantity: number;
            }[];
          }[];
      },
    ];
    in: {
      slotID: number;
      itemID: number | null;
      quantity: number | null;
    }[];
    out: {
      slotID: number;
      itemID: number | null;
      quantity: number | null;
    }[];
  };
}