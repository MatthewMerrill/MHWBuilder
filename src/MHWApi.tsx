export interface ResistanceStats {
    fire: number,
    water: number,
    ice: number,
    thunder: number,
    dragon: number,
}

export enum ArmorItemKind {
    head,
    chest,
    arms,
    waist,
    legs,
}

export interface Skill {
    id: number,
    gameId: number,
    name: string,
    kind: string,
}

export interface ArmorAppliedSkill {
    id: number,
    level: number,
    name: string,
    description: string,
    skill: Skill,
}

export interface ArmorItem {
    id: number,
    kind: ArmorItemKind,
    name: string,
    description: string,
    rank: string,
    rarity: number,
    resistances: ResistanceStats,
    skills: ArmorAppliedSkill[],
}