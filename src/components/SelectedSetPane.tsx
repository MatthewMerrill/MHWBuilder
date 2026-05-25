import { useMHWArmorSetsById } from "../hooks/usemhw";
import computeSkills from "../lib/computeskills";
import { ArmorItem, ArmorSet, ResistanceStats, Skill } from "../lib/MHWApi";
import ResistancesViewer from "./Resistances";
import SkillDetails from "./SkillDetails";

interface SelectedItemCardProps {
    slot: string,
    item: ArmorItem | null,
    onClear: Function,
}

const selectedItemCardStyle = {
    // width: '20ch',
    outline: '1px solid black',
    margin: '1ch',
    backgroundColor: '#f8fff8',
    padding: '.5ch',
};

function SelectedItemCard({slot, item, onClear}: SelectedItemCardProps) {
    return <div style={selectedItemCardStyle}>
        <div style={{display: 'flex', flexFlow: 'row nowrap'}}>
        <span style={{fontSize: '.8rem'}}>{slot.toLocaleUpperCase()}:</span>
        <button style={{fontSize: '.5rem', marginLeft: 'auto', display: item?'block':'none'}}
            onClick={()=>onClear(slot)}>X</button>
        </div>
        <div>
            {item != null ? item.name : 'None selected' }
        </div>
    </div>
}

interface SelectedSetPaneProps {
    head: ArmorItem | null,
    chest: ArmorItem | null,
    arms: ArmorItem | null,
    waist: ArmorItem | null,
    legs: ArmorItem | null,

    onClear: Function,
}

const selectedSetPaneStyle: React.CSSProperties = {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',

    padding: '1ch',
    backgroundColor: '#ded',

    minWidth: '40ch',
    // flexGrow: 1,
    // flexShrink: 0,
};

export default function SelectedSetPane({head, chest, arms, waist, legs, onClear}: SelectedSetPaneProps){
    const combinedResistances: ResistanceStats = {
        fire: 0,
        water: 0,
        ice: 0,
        thunder: 0,
        dragon: 0,
    };

    for (let item of [head, chest, arms, waist, legs]) {
        if (!item) {
            continue;
        }
        combinedResistances.fire += item.resistances.fire;
        combinedResistances.water += item.resistances.water;
        combinedResistances.ice += item.resistances.ice;
        combinedResistances.thunder += item.resistances.thunder;
        combinedResistances.dragon += item.resistances.dragon;
    }

    const armorItems: ArmorItem[] = [head, chest, arms, waist, legs].filter((i): i is ArmorItem => i !== null);
    const armorFx = computeSkills(armorItems);
    
    const armorSkillsFrag = armorFx.armorSkills.length > 0
        ? <div>
            <hr></hr>
            <span style={{fontSize:"1.2rem", fontWeight:'bold'}}>Skills (Armor):</span>
            {/* <ul>
                {armorFx.armorSkills.map((skillRank, index) => <li key={index}>
                    {skillRank.skill.name} (Level: {skillRank.level})
                    <ul><li>{skillRank.description}</li></ul>
                </li>)}
            </ul> */}
            {armorFx.armorSkills.map(skillRank => <SkillDetails key={skillRank.id} skillRank={skillRank}/>)}
            </div>
        : <></>;

    return <div style={selectedSetPaneStyle}>
        <SelectedItemCard slot='head' item={head} onClear={onClear} />
        <SelectedItemCard slot='chest' item={chest} onClear={onClear} />
        <SelectedItemCard slot='arms' item={arms} onClear={onClear} />
        <SelectedItemCard slot='waist' item={waist} onClear={onClear} />
        <SelectedItemCard slot='legs' item={legs} onClear={onClear} />

        <div>
            <hr></hr>
            <ResistancesViewer {...combinedResistances}></ResistancesViewer>
        </div>
        {armorSkillsFrag}

        <div style={{marginTop: 'auto'}}>
            <hr></hr>
            <strong>NOTE:</strong>
            <p>Listed skills are limited to 'armor'-kind skills.</p>
            <p>Support for 'set' and 'group' skills coming soon.</p>
        </div>
        <div>
            <hr></hr>
            <p>Thank you <a href="https://docs.wilds.mhdb.io/#introduction">MHDB.io</a> for API support.</p>
            <p>MattMerr 2026 <a href="https://github.com/MatthewMerrill/MHWBuilder">GitHub</a></p>
        </div>
    </div>
}
