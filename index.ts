import { Item, RARITY } from "./item"
import { IInventory, Booster, LuckBooster, UniformBooster, CollectionBooster } from "./boosters";

const playerInventory: IInventory = {
    1: 1000,
    2: 1000,
    9: 1000,
    10: 1000, 
    18: 1000,
    25: 1000,
    26: 1000,
    19: 1000,
}

// коллекция экземпляров бустерпаков, ключ - ID бустерпака 
let boostersBase: { [ID: number]: Booster } = {
  1: new Booster({ rarity: RARITY.RARE, n1: 3, n2: 2 }),
  2: new Booster({ rarity: RARITY.LEGENDARY, n1: 1, n2: 3 }),
  3: new LuckBooster({ rarity: RARITY.RARE, n1: 3, n2: 2, c: 0.1 }),
  4: new LuckBooster({ rarity: RARITY.LEGENDARY, n1: 1, n2: 3, c: 0.45 }),
  5: new UniformBooster({ rarity: RARITY.RARE, n1: 3, n2: 2, c: 0.1 }),
  6: new UniformBooster({ rarity: RARITY.LEGENDARY, n1: 1, n2: 3, c: 0.45 }),
  7: new CollectionBooster({ rarity: RARITY.RARE, n1: 3, n2: 2, c: 0.1 }),
  8: new CollectionBooster({ rarity: RARITY.LEGENDARY, n1: 1, n2: 3, c: 0.45 }),
}; 

// API 
// функция открытия бустерпака 
function getBoosterLoot(boosterID: number, playerInventory: IInventory): Item[] {
    return boostersBase[boosterID].getBoosterLoot(playerInventory);
}

// TEST
Object.keys(boostersBase).forEach(boosterID => console.log('Booster', boosterID, getBoosterLoot(+boosterID, playerInventory)));
