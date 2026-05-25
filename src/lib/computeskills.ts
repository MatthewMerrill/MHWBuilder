import { ArmorItem, SkillRank } from "./MHWApi";

/**
 * For multi-component-requiring skills...
 * 
 * How many do we need and how many do we have
 */
export interface SkillEffect {
    skillRank: SkillRank
    applying: ArmorItem[],
    required: number,
}

export class ArmorEffects {
    armorSkills: SkillEffect[] = [];
    setSkills: SkillEffect[] = [];
    groupSkills: SkillEffect[] = [];
}

export default function computeSkills(armorItems: ArmorItem[]) {
    const fx = new ArmorEffects();

    function addTo(skillRank: SkillRank, item: ArmorItem, l: SkillEffect[]) {
        l.push({
            skillRank,
            applying: [item],
            required: skillRank.setPiecesRequired ?? 1
        })
    }

    for (let item of armorItems) {
        for (let skillRank of item.skills) {
            if (skillRank.skill.kind === 'armor') {
                addTo(skillRank, item, fx.armorSkills);
            } else if (skillRank.skill.kind === 'set') {
                addTo(skillRank, item, fx.setSkills);
            } else if (skillRank.skill.kind === 'group') {
                addTo(skillRank, item, fx.groupSkills);
            }
        }
    }

    function mergeSkills(l: SkillEffect[]) {
        if (l.length === 0) {
            return [];
        }

        l = l.sort((a, b) => {
            if (a.skillRank.level !== b.skillRank.level) {
                // largest first
                return b.skillRank.level - a.skillRank.level;
            }
            if (a.skillRank.skill.name !== b.skillRank.skill.name) {
                return a.skillRank.skill.name.localeCompare(b.skillRank.skill.name);
            }
            return a.applying[0].id - b.applying[0].id;
        });

        let idx = 1;
        let res = [l[0]];
        while (idx < l.length) {
            if (l[idx].skillRank.id === l[idx-1].skillRank.id) {
                res[res.length-1].applying.push(l[idx].applying[0])
            } else {
                // deep clone (not really necessary but oh well)
                res.push({...l[idx], applying: [...l[idx].applying]});
            }
            idx += 1;
        }
        return res;
    }

    fx.armorSkills = mergeSkills(fx.armorSkills);
    fx.setSkills = mergeSkills(fx.setSkills);
    fx.groupSkills = mergeSkills(fx.groupSkills);

    return fx;
} 