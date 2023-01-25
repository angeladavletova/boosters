import { rarityIndex, itemsBase, getItemsByRarityAndType } from "./base";
import { ITEMTYPE, Item, RARITY, allItemTypes } from "./item"
import { getRandomInt, getRandomFloat } from "./helpers"

interface IWeights {
    [id: number]: number
}

// Интерфейс инвентаря. Ключ - ID предмета, значение - количество экземпляров этого предмета в инвентаре 
export interface IInventory {
    [key: number]: number
}

// Настройки простого бустерпака 
interface IBoosterSettings {
    rarity: RARITY;
    n1: number;
    n2: number;
}

// Класс простого бустерпака 
export class Booster {
    rarity: RARITY;
    n1: number;
    n2: number;

    constructor(settings: IBoosterSettings) {
        this.rarity = settings.rarity;
        this.n1 = settings.n1;
        this.n2 = settings.n2;
    }

    getRandomItemId(itemIds: number[], weights?: IWeights): number {
        if (!itemIds || !itemIds.length)
            return -1;

        if (!weights)
            return itemIds[getRandomInt(itemIds.length)];

        const weightsSum = itemIds.reduce((partialSum, id) => partialSum + weights[id] || 0, 0);
        const random = getRandomFloat(weightsSum);
        let rightBound = 0;
        for (let i = 0; i < itemIds.length; i++) {
            const id = itemIds[i];
            rightBound += weights[id] || 0;
            if (random < rightBound)
                return id;
        }
        return itemIds[0];
    }

    getBoosterLootWithWeights(weights?: IWeights): Item[] {
        const items: Item[] = new Array(this.n1 + this.n2);
        items.length = 0;

        [[this.rarity, this.n1], [this.rarity - 1, this.n2]].forEach(([rarity, n]) => {
            const sameRarityItems = rarityIndex.get(rarity);
            if (!sameRarityItems || !sameRarityItems.length)
                return;

            for (let i = 0; i < n; i++) {
                const id = this.getRandomItemId(sameRarityItems, weights);
                if (id >= 0)
                    items.push(itemsBase[id]);
            }
        })

        return items;
    }

    getBoosterLoot(playerInventory: IInventory): Item[] {
        return this.getBoosterLootWithWeights();
    }
}


// Настройки бустерпака удачи 
interface ILuckBoosterSettings extends IBoosterSettings {
    c: number
}

// Класс бустерпака удачи 
export class LuckBooster extends Booster {
    c: number;

    constructor(settings: ILuckBoosterSettings) {
        super(settings);
        this.c = Math.min(settings.c, 1);
    }

    increaseRarity(rarity: RARITY): RARITY {
        const probability = Math.random();
        let currentProbability = this.c;
        let rightBound = currentProbability;
        let k = 1;
        while (RARITY[rarity + k]) {
            if (probability < rightBound)
                return rarity + k;
            currentProbability *= this.c;
            rightBound += currentProbability;
            k++;
        }
        return rarity;
    }

    getBoosterLootWithWeights(weights?: IWeights): Item[] {
        const items: Item[] = super.getBoosterLootWithWeights(weights);
        items.forEach((item, i) => {
            const increasedRarity = this.increaseRarity(item.rarity);
            if (item.rarity === increasedRarity)
                return;
            
            const itemIds = getItemsByRarityAndType(increasedRarity, item.itemType);
            const improvedItemId = super.getRandomItemId(itemIds, weights);
            if (improvedItemId >= 0)
                items[i] = itemsBase[improvedItemId];
        })
        return items;
    }

    getBoosterLoot(playerInventory: IInventory): Item[] {
        return this.getBoosterLootWithWeights();
    }
}

// Настройки равномерного бустерпака. Пока пусто
interface IUniformBooster extends ILuckBoosterSettings {}

// Класс равномерного бустерпака
export class UniformBooster extends LuckBooster {
    constructor(settings: IUniformBooster) {
        // Если предметов суммарно меньше 4, то увеличиваем n1, чтобы их стало 4
        const itemTypesCount = allItemTypes.length;
        if (settings.n1 + settings.n2 < itemTypesCount)
            settings.n1 = itemTypesCount - settings.n2;
        super(settings);
    }

    getBoosterLootWithWeights(weights?: IWeights): Item[] {
        const items: Item[] = super.getBoosterLootWithWeights(weights);
        const extraItemIndexes: number[] = [];
        const existingTypes = new Set<ITEMTYPE>();
        items.forEach((item, i) => {
            if (!existingTypes.has(item.itemType))
                existingTypes.add(item.itemType);
            else
                extraItemIndexes.push(i);
        });

        allItemTypes.forEach(type => {
            if (existingTypes.has(type) || !extraItemIndexes.length)
                return;

            const extraItemIndex = extraItemIndexes.pop() || 0;
            const extraItem = items[extraItemIndex];
            const itemIds = getItemsByRarityAndType(extraItem.rarity, type);
            const itemId = super.getRandomItemId(itemIds, weights);
            if (itemId >= 0)
                items[extraItemIndex] = itemsBase[itemId]; 
        })

        return items;
    }

    getBoosterLoot(playerInventory: IInventory): Item[] {
        return this.getBoosterLootWithWeights();
    }
}

// Настройки коллекционного бустерпака. Пока пусто
interface ICollectionBooster extends IUniformBooster {}

// Класс коллекционного бустерпака
export class CollectionBooster extends UniformBooster {
    constructor(settings: ICollectionBooster) {
        super(settings);
    }

    getItemWeights(playerInventory: IInventory): IWeights {
        const itemIds = Object.keys(itemsBase).map(id => +id);
        const weights: IWeights = {};
        // Считаем, что вероятность выпадения предмета, которого нет в инвентаре,
        // вдвое больше вероятности предмета, который есть в одном экземпляре.
        const missingItemVirtualCount = 0.5;
        itemIds.forEach((itemId, i) => {
            weights[itemId] = 1 / (playerInventory[itemId] || missingItemVirtualCount);
        });
        return weights;
    }

    getBoosterLoot(playerInventory: IInventory): Item[] {
        const weights = this.getItemWeights(playerInventory);
        return super.getBoosterLootWithWeights(weights);
    }
}
