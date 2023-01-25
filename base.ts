import { RARITY, ITEMTYPE, Item } from "./item";

// База предметов, ключ - ID предмета.
export let itemsBase: { [ID: number]: Item } = {
    1: new Item(1, { name: "Common Helm", rarity: RARITY.COMMON, itemType: ITEMTYPE.HELMET }),
    2: new Item(2, { name: "Common Mask", rarity: RARITY.COMMON, itemType: ITEMTYPE.HELMET }),
    3: new Item(3, { name: "Rare Helm", rarity: RARITY.RARE, itemType: ITEMTYPE.HELMET }),
    4: new Item(4, { name: "Rare Mask", rarity: RARITY.RARE, itemType: ITEMTYPE.HELMET }),
    5: new Item(5, { name: "Epic Helm", rarity: RARITY.EPIC, itemType: ITEMTYPE.HELMET }),
    6: new Item(6, { name: "Epic Mask", rarity: RARITY.EPIC, itemType: ITEMTYPE.HELMET }),
    7: new Item(7, { name: "Legendary Helm", rarity: RARITY.LEGENDARY, itemType: ITEMTYPE.HELMET }),
    8: new Item(8, { name: "Legendary Mask", rarity: RARITY.LEGENDARY, itemType: ITEMTYPE.HELMET }),

    9: new Item(9, { name: "Common Nunchacku", rarity: RARITY.COMMON, itemType: ITEMTYPE.WEAPON }),
    10: new Item(10, { name: "Common Sword", rarity: RARITY.COMMON, itemType: ITEMTYPE.WEAPON }),
    11: new Item(11, { name: "Rare Nunchacku", rarity: RARITY.RARE, itemType: ITEMTYPE.WEAPON }),
    12: new Item(12, { name: "Rare Sword", rarity: RARITY.RARE, itemType: ITEMTYPE.WEAPON }),
    13: new Item(13, { name: "Epic Nunchacku", rarity: RARITY.EPIC, itemType: ITEMTYPE.WEAPON }),
    14: new Item(14, { name: "Epic Sword", rarity: RARITY.EPIC, itemType: ITEMTYPE.WEAPON }),
    15: new Item(15, { name: "Legendary Nunchacku", rarity: RARITY.LEGENDARY, itemType: ITEMTYPE.WEAPON }),
    16: new Item(16, { name: "Legendary Sword", rarity: RARITY.LEGENDARY, itemType: ITEMTYPE.WEAPON }),

    17: new Item(17, { name: "Common Bubble Shield", rarity: RARITY.COMMON, itemType: ITEMTYPE.SHIELD }),
    18: new Item(18, { name: "Common Metal Shield", rarity: RARITY.COMMON, itemType: ITEMTYPE.SHIELD }),
    19: new Item(19, { name: "Rare Bubble Shield", rarity: RARITY.RARE, itemType: ITEMTYPE.SHIELD }),
    20: new Item(20, { name: "Rare Metal Shield", rarity: RARITY.RARE, itemType: ITEMTYPE.SHIELD }),
    21: new Item(21, { name: "Epic Bubble Shield", rarity: RARITY.EPIC, itemType: ITEMTYPE.SHIELD }),
    22: new Item(22, { name: "Epic Metal Shield", rarity: RARITY.EPIC, itemType: ITEMTYPE.SHIELD }),
    23: new Item(23, { name: "Legendary Bubble Shield", rarity: RARITY.LEGENDARY, itemType: ITEMTYPE.SHIELD }),
    24: new Item(24, { name: "Legendary Metal Shield", rarity: RARITY.LEGENDARY, itemType: ITEMTYPE.SHIELD }),

    25: new Item(25, { name: "Common Jacket", rarity: RARITY.COMMON, itemType: ITEMTYPE.ARMOR }),
    26: new Item(26, { name: "Common Chain Mail", rarity: RARITY.COMMON, itemType: ITEMTYPE.ARMOR }),
    27: new Item(27, { name: "Rare Jacket", rarity: RARITY.RARE, itemType: ITEMTYPE.ARMOR }),
    28: new Item(28, { name: "Rare Chain Mail", rarity: RARITY.RARE, itemType: ITEMTYPE.ARMOR }),
    29: new Item(29, { name: "Epic Jacket", rarity: RARITY.EPIC, itemType: ITEMTYPE.ARMOR }),
    30: new Item(30, { name: "Epic Chain Mail", rarity: RARITY.EPIC, itemType: ITEMTYPE.ARMOR }),
    31: new Item(31, { name: "Legendary Jacket", rarity: RARITY.LEGENDARY, itemType: ITEMTYPE.ARMOR }),
    32: new Item(32, { name: "Legendary Chain Mail", rarity: RARITY.LEGENDARY, itemType: ITEMTYPE.ARMOR }),
};

function initIndexes() {
    for (let [id, item] of Object.entries(itemsBase)) {
        if (!rarityIndex.has(item.rarity))
            rarityIndex.set(item.rarity, []);
        rarityIndex.get(item.rarity)!.push(+id);

        const key = makeRerityTypeKey(item.rarity, item.itemType);
        if (!rarityTypeIndex.has(key))
            rarityTypeIndex.set(key, []);
        rarityTypeIndex.get(key)!.push(+id);
    }
}

export function makeRerityTypeKey(rarity: RARITY, itemType: ITEMTYPE) {
    return `${rarity},${itemType}`;
}

export function getItemsByRarityAndType(rarity: RARITY, type: ITEMTYPE): number[] {
    return rarityTypeIndex.get(makeRerityTypeKey(rarity, type)) || [];
}

export const rarityIndex = new Map<RARITY, number[]>();
export const rarityTypeIndex = new Map<string, number[]>();
initIndexes();
