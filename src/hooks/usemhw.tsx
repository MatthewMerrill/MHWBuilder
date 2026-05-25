import { dataTagErrorSymbol, useQuery } from "@tanstack/react-query";
import { ArmorItem, ArmorSet, Skill, SkillRank } from "../lib/MHWApi";
import { isParenthesizedExpression } from "typescript";
import { use } from "react";

const BASE_URL = 'https://wilds.mhdb.io/en';

export function useMHWArmorItems() {
    return useQuery<ArmorItem[]>({
        queryKey: ['mhw-armors'],
        queryFn: async () => {
            const res = await fetch(BASE_URL + '/armor');
            if (!res.ok) {
                throw new Error('Failed to load /armor');
            }
            return res.json();
        },
        staleTime: 'static',
    });
}

export function useMHWArmorSets() {
    return useQuery<ArmorSet[]>({
        queryKey: ['mhw-armor-sets'],
        queryFn: async () => {
            const res = await fetch(BASE_URL + '/armor/sets');
            if (!res.ok) {
                throw new Error('Failed to load /armor/sets');
            }
            return res.json();
        },
        staleTime: 'static',
    });
}

export function useMHWArmorSetsById() {
    const {data: setsArr} = useMHWArmorSets();

    return useQuery({
        queryKey: ['mhw-armor-sets', 'by-id', setsArr],
        queryFn: async () => {
            const byId = new Map<number, ArmorSet>();
                for (let set of setsArr!) {
                    byId.set(set.id, set);
                }
                return byId;
        },
        enabled: !!setsArr,
    })
    
    
}

export function useMHWSkills() {
    return useQuery<Skill[]>({
        queryKey: ['mhw-skills'],
        queryFn: async () => {
            const res = await fetch(BASE_URL + '/skills');
            if (!res.ok) {
                throw new Error('Failed to load /skills');
            }
            return res.json();
        },
        staleTime: 'static',
    });
}

export function useMHWSkill(skillId: number) {
    let {data: skills} = useMHWSkills();

    return useQuery<Skill>({
        queryKey: ['mhw-skills', skillId],
        queryFn: async () => {
            for (let skill of skills!) {
                if (skill.id === skillId) {
                    return skill;
                }
            }
            throw new Error('No such skill ' + skillId);
        },
        staleTime: 'static',
        enabled: !!skills,
    });
}

// export function useMHWArmorSet(setId: number) {
//     const { data: armorSets } = useMHWArmorSets();

//     if (!!)
    

// }