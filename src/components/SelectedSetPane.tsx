import computeSkills, { SkillEffect } from "../lib/computeskills";
import { ArmorItem, ResistanceStats } from "../lib/MHWApi";
import ResistancesViewer from "./Resistances";
import SkillDetails from "./SkillDetails";

interface SelectedItemCardProps {
    slot: string,
    item: ArmorItem | null,
    onClear: Function,
}

const selectedItemCardStyle = {
    outline: '1px solid black',
    margin: '0 1ch',
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
    
    function skillSetFrag(skillEffects: SkillEffect[], effectKind: string) {
        return skillEffects.length > 0
        ? <div>
            <span style={{fontSize:"1.2rem", fontWeight:'bold'}}>Skills ({effectKind}):</span>
            {skillEffects.map(skillEffect => <SkillDetails key={skillEffect.skillRank.id} {...skillEffect}/>)}
            </div>
        : <></>;
    }

    return <div style={selectedSetPaneStyle}>
        <SelectedItemCard slot='head' item={head} onClear={onClear} />
        <SelectedItemCard slot='chest' item={chest} onClear={onClear} />
        <SelectedItemCard slot='arms' item={arms} onClear={onClear} />
        <SelectedItemCard slot='waist' item={waist} onClear={onClear} />
        <SelectedItemCard slot='legs' item={legs} onClear={onClear} />

        <div>
            <hr></hr>
            <ResistancesViewer {...combinedResistances}></ResistancesViewer>
            <hr></hr>
        </div>
        <div style={{overflow: 'scroll', outline: '2px inset #676', padding: '.5ch'}}>
            {armorFx.armorSkills.length > 0 && skillSetFrag(armorFx.armorSkills, 'Armor')}
            {armorFx.setSkills.length > 0 && skillSetFrag(armorFx.setSkills, 'Set')}
            {armorFx.groupSkills.length > 0 && skillSetFrag(armorFx.groupSkills, 'Group')}
        </div>

        <div style={{marginTop: 'auto'}}>
            <hr></hr>
            <p>Thank you <a href="https://docs.wilds.mhdb.io/#introduction">MHDB.io</a> for API support.</p>
            <p>MattMerr 2026 <a href="https://github.com/MatthewMerrill/MHWBuilder">GitHub</a></p>
        </div>
    </div>
}
