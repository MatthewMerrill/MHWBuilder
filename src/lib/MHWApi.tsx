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
    description: string,
    kind: string,
    ranks: SkillRank[],
}

export interface SkillRank {
    id: number,
    level: number,
    name: string,
    description: string,
    skill: Skill,
    setPiecesRequired: number,
}

export interface ArmorSet {
    id: number,
    name: string,
    pieces: ArmorItem[],
    setBonusSkill: Skill,
    groupBonusSkill: Skill,
}

export interface ArmorItem {
    id: number,
    kind: ArmorItemKind,
    name: string,
    description: string,
    rank: string,
    rarity: number,
    resistances: ResistanceStats,
    skills: SkillRank[],
    armorSet: ArmorSet,
}