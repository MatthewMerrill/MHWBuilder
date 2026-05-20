import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ArmorItem, ArmorItemKind, Skill } from "./MHWApi";
import ResistancesViewer from "./Resistances";
import { match } from "assert";
import { skipPartiallyEmittedExpressions } from "typescript";


const armorFilterStyle: React.CSSProperties = {
    backgroundColor: '#ded', padding: '1ch',

    display: 'flex',
    flexFlow: 'row nowrap',
}
const armorFilterInputStyle: React.CSSProperties = {
    border: '1px solid black', padding: '.2ch',
}
interface ArmorFilterConfig {
    namePattern: string,
    kind: string,
    skill: string,

    minFire: number | null,
    minWater: number | null,
    minIce: number | null,
    minThunder: number | null,
    minDragon: number | null,
}
const EMPTY_FILTERS: ArmorFilterConfig = {
    namePattern: '',
    kind: '',
    skill: '',

    minFire: null,
    minWater: null,
    minIce: null,
    minThunder: null,
    minDragon: null,
}
interface ArmorFilterProps {
    armors: ArmorItem[],
    onChange: Function,
}
function ArmorFilter({armors, onChange}: ArmorFilterProps) {
    const [filters, setFilters] = useState({...EMPTY_FILTERS});
    const skills = useMemo<Skill[]>(() => {
        let skills = new Map<number, Skill>();
        for (let item of armors) {
            for (let skill of item.skills) {
                skills.set(skill.skill.id, skill.skill);
            }
        }
        let skillsArr = Array.from(skills.values());
        skillsArr.sort(
            (a: Skill, b: Skill) => a.name.localeCompare(b.name));
        console.log(skillsArr);
        return skillsArr;
    }, [armors]);

    useEffect(() => {
        const matchedIds = new Set<number>();

        for (let item of armors) {
            if (item.name.toLowerCase().indexOf(filters.namePattern.toLowerCase()) < 0) {
                continue;
            }
            if (item.kind.toString().indexOf(filters.kind) < 0) {
                continue;
            }
            if (filters.skill !== '' && !item.skills.find(skill => skill.skill.id.toString() == filters.skill)) {
                continue;
            }
            matchedIds.add(item.id);
        }

        console.log(matchedIds)

        onChange(matchedIds);
    }, [armors, filters]);

    function handleChange(e: ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
        setFilters({...filters, [e.currentTarget.name]: e.currentTarget.value});
    }

    return <div style={armorFilterStyle}>
        <button onClick={()=>setFilters({...EMPTY_FILTERS})}>X</button>
        <div style={armorFilterInputStyle}>
            <label>Armor Item Name<br/>
                <input name="namePattern" type="text"
                    value={filters.namePattern} onChange={handleChange}/>
            </label>
        </div>
        <div style={armorFilterInputStyle}>
            <label>Armor Item Kind<br/>
                <select name="kind" onChange={handleChange} value={filters.kind}>
                    <option value="">Any</option>
                    <option value="head">Head</option>
                    <option value="chest">Chest</option>
                    <option value="arms">Arms</option>
                    <option value="waist">Waist</option>
                    <option value="legs">Legs</option>
                </select>
            </label>
        </div>
        <div style={armorFilterInputStyle}>
            <label>Desired Skill<br/>
                <select name="skill"
                        value={filters.skill}
                        onChange={handleChange}>
                    <option value="">---</option>
                    {skills.map(skill =>
                        <option
                            key={skill.id}
                            value={skill.id}>{skill.name} ({skill.id})</option>
                    )}
                </select>
            </label>
        </div>
    </div>
}

interface ArmorCardProps {
    item: ArmorItem,
    onClick: Function,
}
const armorCardStyle: React.CSSProperties = {
    backgroundColor: '#aca',
    outline: '1px solid black',
    margin: '2ch',
    padding: '.5ch',
    // width: '60ch',

    display: 'flex',
    flexFlow: 'row nowrap',
};
function ArmorCard({item, onClick}: ArmorCardProps) {
    return <div key={item.id} style={armorCardStyle} title={item.description} onClick={() => onClick(item)}>
        <div style={{flexGrow: 1, borderRight: '1px double black'}}>
            <div style={{fontSize: '.7rem'}}>({item.kind.toString().toLocaleUpperCase()})</div>
            <span style={{fontWeight: 'bold'}}>{item.name}</span>
        </div>
        <ResistancesViewer {...item.resistances} />
    </div>
}

interface ArmorSelectorProps {
    armors: ArmorItem[],
    onClick: Function,
}
const armorSelectorStyle: React.CSSProperties = {
    backgroundColor: '#252e25',
    flexGrow: '1',
    
    display: 'flex',
    flexFlow: 'column nowrap',
    overflow: 'scroll',
}
export default function ArmorSelector({armors, onClick}: ArmorSelectorProps) {
    const [matchedArmors, setMatched] = useState<ArmorItem[]>([]);

    function handleMatch(matchedArmors: Set<number>) {
        setMatched(armors.filter(item => matchedArmors.has(item.id)));
    }
    
    return <div style={armorSelectorStyle}>
        <div style={{backgroundColor: '#222', borderBottom: '2px solid #555', padding: '2ch'}}>
            <ArmorFilter armors={armors} onChange={handleMatch} />
        </div>
        <div>
            {matchedArmors.map(item =>
                <ArmorCard key={item.id} item={item} onClick={onClick} />
            )}
        </div>
    </div>
}