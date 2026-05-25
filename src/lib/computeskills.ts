import { ArmorItem, SkillRank } from "./MHWApi";

function dedup(arr: SkillRank[]): SkillRank[] {
    if (arr.length == 0) {
        return [];
    }
    let idx = 1;
    let res = [arr[0]];
    while (idx < arr.length) {
        if (arr[idx].id != arr[idx-1].id) {
            res.push(arr[idx]);
        }
        idx += 1;
    }
    return res;
}

export class ArmorEffects {

    armorSkills: SkillRank[] = [];
    // setSkills: Skill[]


}

export default function computeSkills(armorItems: ArmorItem[]) {

    const fx = new ArmorEffects();

    for (let item of armorItems) {

        for (let skillRank of item.skills) {
            if (skillRank.skill.kind == 'armor') {
                fx.armorSkills.push(skillRank);
            }
        }
    }

    fx.armorSkills = dedup(fx.armorSkills.sort((a, b) => {
        if (a.level != b.level) {
            // largest first
            return b.level - a.level;
        }
        return a.skill.name.localeCompare(b.skill.name);
    }));

    return fx;
} 