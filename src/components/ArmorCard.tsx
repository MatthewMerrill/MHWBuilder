import { skipPartiallyEmittedExpressions } from "typescript";
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
    width: '36ch',
    // maxWidth: '50ch',

    fontSize: '1rem',

    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    // justifyContent: 'stretch',
    
    flexGrow: 1,
};
export default function ArmorCard({item, onClick}: ArmorCardProps) {
    return <div key={item.id} style={armorCardStyle} title={item.description} onClick={() => onClick(item)}>
        <div style={{textAlign: 'center'}}>
            <span style={{fontSize: '1.1rem', fontWeight: 'bold'}}>{item.name} </span>
            <span style={{fontSize: '.7rem'}}>({item.kind.toString().toLocaleUpperCase()})</span>
        </div>
        <ResistancesViewer {...item.resistances} />
        <hr style={{width: '20ch'}}/>
        <div>
            <ul style={{marginTop: '.5ch'}}>
                {item.skills.filter(skillRank => skillRank.skill.kind === 'armor').map((skillRank: SkillRank) => 
                    <SkillDetails key={skillRank.id} skillRank={skillRank}/>
                )}
            </ul>
        </div>
    </div>
}