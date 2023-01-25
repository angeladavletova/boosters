// Редкость 
export enum RARITY {
    COMMON,
    RARE,
    EPIC,
    LEGENDARY
}
  
// Тип предмета 
export enum ITEMTYPE {
    HELMET,
    WEAPON,
    SHIELD,
    ARMOR
}
  
// Настройки предмета 
interface IItemSettings {
    name: string;
    rarity: RARITY;
    itemType: ITEMTYPE;
}

export const allItemTypes = Object.keys(ITEMTYPE).filter(type => !isNaN(Number(type))).map(type => Number(type));
  
// Класс предмета 
export class Item {
    id: number;
    name: string;
    rarity: RARITY;
    itemType: ITEMTYPE;

    constructor(id: number, settings: IItemSettings) {
        this.id = id;
        this.name = settings.name;
        this.rarity = settings.rarity;
        this.itemType = settings.itemType;
    }
} 