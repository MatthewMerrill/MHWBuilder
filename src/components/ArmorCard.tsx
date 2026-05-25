import { ArmorItem, SkillRank } from "../lib/MHWApi";
import ResistancesViewer from "./Resistances";
import SkillDetails from "./SkillDetails";


interface ArmorCardProps {
    item: ArmorItem,
    onClick: Function,
}
const armorCardStyle: React.CSSProperties = {
    backgroundColor: '#efe',
    outline: '1px solid black',
    boxShadow: '4px 4px 4px #676',
    margin: '2ch',
    padding: '.5ch',
    width: '40ch',

    fontSize: '1rem',

    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    
    flexGrow: 1,
};
export default function ArmorCard({item, onClick}: ArmorCardProps) {

    const armorSkills = item.skills.filter(skillRank => skillRank.skill.kind === 'armor');
    const setSkills = item.skills.filter(skillRank => skillRank.skill.kind === 'set');
    const groupSkills = item.skills.filter(skillRank => skillRank.skill.kind === 'group');

    return <div key={item.id} style={armorCardStyle} title={item.description}>
        <div style={{textAlign: 'center'}}>
            <span style={{fontSize: '1.1rem', fontWeight: 'bold'}}>{item.name} </span>
            <span style={{fontSize: '.7rem'}}>({item.kind.toString().toLocaleUpperCase()})</span>
        </div>
        <ResistancesViewer {...item.resistances} />
        <hr style={{width: '20ch'}}/>
        <div>
            {armorSkills.length > 0 &&
                <div style={{marginTop: '.5ch'}}>
                    {armorSkills.map((skillRank: SkillRank) => 
                        <SkillDetails key={skillRank.id} skillRank={skillRank} />
                    )}
                </div>}
            {setSkills.length > 0 &&
                <div style={{marginTop: '.5ch'}}>
                    <span><strong>Set Skills:</strong></span>
                    {setSkills.map((skillRank: SkillRank) => 
                        <SkillDetails key={skillRank.id} skillRank={skillRank} required={skillRank.setPiecesRequired} />
                    )}
                </div>}
            {groupSkills.length > 0 &&
                <div style={{marginTop: '.5ch'}}>
                    <span><strong>Group Skills:</strong></span>
                    {groupSkills.map((skillRank: SkillRank) => 
                        <SkillDetails key={skillRank.id} skillRank={skillRank} required={skillRank.setPiecesRequired} />
                    )}
                </div>}
        </div>
        <button style={{marginTop:'auto'}} onClick={() => onClick(item)}>+</button>
    </div>
}