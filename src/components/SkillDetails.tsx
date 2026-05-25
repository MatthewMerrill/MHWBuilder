import { useMHWSkill } from "../hooks/usemhw";
import { ArmorItem, SkillRank } from "../lib/MHWApi";

interface SkillDetailsProps {
    skillRank: SkillRank,
    applying?: ArmorItem[],
    required?: number,
}
export default function SkillDetails({skillRank, applying=undefined, required=undefined}: SkillDetailsProps) {
    const {data: skill, isPending, error} = useMHWSkill(skillRank.skill.id);

    const skillRankDesc = (rankOfSkill: SkillRank) => {
        let ret = <li key={rankOfSkill.id}>{rankOfSkill.level}: {rankOfSkill.description}</li>;
        return (rankOfSkill.id === skillRank.id)
            ? <strong key={rankOfSkill.id}>{ret}</strong>
            : ret;
    }

    const blurb = () => {
        if (error) {
            return 'Could not load details.';
        }
        if (isPending) {
            return 'Loading skill details...';
        }
        return <div style={{background: '#f8fff8', border: '1px solid #aca', padding: '.5ch'}}>
            {skill.description}
            <ul style={{marginTop: '.5ch'}}>
                {skill.ranks.map(rankOfSkill => skillRankDesc(rankOfSkill))}
            </ul>
        </div>
    };

    const fromArmors = applying !== undefined
        ? <ul style={{margin:0}}>{applying.map(item => <li key={item.id}>{item.name}</li>)}</ul>
        : <></>;
    let ofRequired = '';
    if (required) ofRequired = ` (${applying?.length ?? ''}/${required})`;
    // else if (required) ofRequired = ' needs ' + required;

    return <details>
        <summary>{skillRank.skill.name} Lv{skillRank.level}{ofRequired ? ofRequired : ''}
            {fromArmors}
        </summary>
        {blurb()}
    </details>
}