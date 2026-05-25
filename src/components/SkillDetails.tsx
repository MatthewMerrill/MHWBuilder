import { useMHWSkill } from "../hooks/usemhw";
import { SkillRank } from "../lib/MHWApi";

interface SkillDetailsProps {
    skillRank: SkillRank,
}
export default function SkillDetails({skillRank}: SkillDetailsProps) {
    const {data: skill, isPending, error} = useMHWSkill(skillRank.skill.id);

    const skillRankDesc = (rankOfSkill: SkillRank) => {
        let ret = <li key={rankOfSkill.id}>{rankOfSkill.level}: {rankOfSkill.description}</li>;
        return (rankOfSkill.id == skillRank.id)
            ? <strong>{ret}</strong>
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

    return <details>
        <summary>{skillRank.skill.name} (Lv {skillRank.level})</summary>
        {blurb()}
    </details>
}