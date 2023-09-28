import {RecyclerTypes} from "@contentScript/types/recyclerTypes";

export const recyclerStrings: Record<RecyclerTypes, { title: string; gender: string }> = {
  [RecyclerTypes.furnace]: {
    title: 'Печка',
    gender: 'a',
  },
  [RecyclerTypes.barn]: {
    title: 'Конюшня',
    gender: 'a',
  },
  [RecyclerTypes.plant]: {
    title: 'Плантация',
    gender: 'a',
  },
  [RecyclerTypes.cityRecycler]: {
    title: 'Переработчик (город)',
    gender: '',
  },
  [RecyclerTypes.NPZ]: {
    title: 'НПЗ',
    gender: '',
  },
  [RecyclerTypes.banditRecycler]: {
    title: 'Переработчик (бандитка)',
    gender: '',
  },
  [RecyclerTypes.carrierBig]: {
    title: 'Экскаватор"',
    gender: '',
  },
  [RecyclerTypes.carrierStones]: {
    title: 'Карьер (камень)',
    gender: '',
  },
  [RecyclerTypes.carrierOre]: {
    title: 'Карьер (метал. руда)',
    gender: '',
  },
  [RecyclerTypes.carrierSulfur]: {
    title: 'Карьер (сера)',
    gender: '',
  },
}