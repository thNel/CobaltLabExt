export enum ResourceTypes {
  stones = 1,
  metalFragments = 2,
  wood = 3,
  hqmOre = 4,
  sulfur = 5,
  scrap = 6,
  fuelLowQuality = 7,
  crudeOil = 8,
  greenCard = 9,
  blueCard = 10,
  redCard = 11,
  canOfTuna = 12,
  pickles = 13,
  waterJug = 14,
  tarp = 15,
  ropes = 16,
  roadSigns = 17,
  rifleBody = 18,
  smgBody = 19,
  semiAutomaticBody = 20,
  metalSheet = 21,
  springs = 22,
  pipes = 23,
  metalBlade = 24,
  sewingKit = 25,
  propaneTank = 26,
  techTrash = 27,
  gears = 28,
  electricFuse = 29,
  rock = 43,
  pickaxe1 = 44,
  axe1 = 45,
  pickaxe2 = 46,
  pickaxe3 = 47,
  axe3 = 48,
  axe4 = 49,
  pickaxe4 = 50,
  diesel = 51,
  cloth = 52,
  sulfurOre = 53,
  metalOre = 54,
  coal = 55,
  hqm = 59,
  axe2 = 60,
  shit = 61,
  axe5 = 62,
  pickaxe6 = 63,
  pickaxe5 = 64,
  pickaxe8 = 65,
  pickaxe7 = 66,
  c4 = 68,
}

export const stackSize = (itemID: ResourceTypes) => {
  if (itemID === ResourceTypes.scrap) return 5000;

  if (
    [
      ResourceTypes.stones,
      ResourceTypes.cloth,
      ResourceTypes.metalFragments,
      ResourceTypes.metalOre,
      ResourceTypes.sulfurOre,
      ResourceTypes.sulfur,
      ResourceTypes.wood,
      ResourceTypes.coal
    ].includes(itemID)
  )
    return 3000;

  if (itemID === ResourceTypes.fuelLowQuality) return 750;

  if (itemID === ResourceTypes.crudeOil) return 250;

  if (
    [
      ResourceTypes.hqm,
      ResourceTypes.hqmOre,
    ].includes(itemID)
  )
    return 100;

  if (itemID === ResourceTypes.shit) return 96;

  if (
    [
      ResourceTypes.pipes,
      ResourceTypes.tarp,
    ].includes(itemID)
  )
    return 50;

  if (itemID === ResourceTypes.pickles) return 48;

  if (itemID === ResourceTypes.canOfTuna) return 34;

  if (
    [
      ResourceTypes.roadSigns,
      ResourceTypes.sewingKit,
      ResourceTypes.ropes,
    ].includes(itemID)
  )
    return 30;

  if (
    [
      ResourceTypes.metalBlade,
      ResourceTypes.metalSheet,
      ResourceTypes.springs,
      ResourceTypes.gears,

    ].includes(itemID)
  )
    return 20;

  if (
    [
      ResourceTypes.techTrash,
      ResourceTypes.propaneTank,
      ResourceTypes.rifleBody,
      ResourceTypes.smgBody,
      ResourceTypes.semiAutomaticBody,
      ResourceTypes.diesel,
    ].includes(itemID)
  )
    return 10;

  if (
    [
      ResourceTypes.electricFuse,
      ResourceTypes.axe1,
      ResourceTypes.axe2,
      ResourceTypes.axe3,
      ResourceTypes.axe4,
      ResourceTypes.axe5,
      ResourceTypes.pickaxe1,
      ResourceTypes.pickaxe2,
      ResourceTypes.pickaxe3,
      ResourceTypes.pickaxe4,
      ResourceTypes.pickaxe5,
      ResourceTypes.pickaxe6,
      ResourceTypes.pickaxe7,
      ResourceTypes.pickaxe8,
      ResourceTypes.greenCard,
      ResourceTypes.blueCard,
      ResourceTypes.redCard,
      ResourceTypes.waterJug,
      ResourceTypes.c4,
    ].includes(itemID)
  )
    return 1;

  return 10000;
}