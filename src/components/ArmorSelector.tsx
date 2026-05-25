import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useMHWSkills } from "../hooks/usemhw";
import { ArmorItem } from "../lib/MHWApi";
import ArmorCard from "./ArmorCard";


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
    const {data: skills} = useMHWSkills();

    useEffect(() => {
        const matchedIds = new Set<number>();

        for (let item of armors) {
            if (item.name.toLowerCase().indexOf(filters.namePattern.toLowerCase()) < 0) {
                continue;
            }
            if (item.kind.toString().indexOf(filters.kind) < 0) {
                continue;
            }
            if (filters.skill !== '' && !item.skills.find(skill => skill.skill.id.toString() === filters.skill)) {
                continue;
            }
            matchedIds.add(item.id);
        }

        onChange(matchedIds);
    }, [armors, filters, onChange]);

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
                    {skills && skills.filter(s => s.kind !== 'weapon').sort((a, b) => a.name.localeCompare(b.name)).map(skill =>
                        <option
                            key={skill.id}
                            value={skill.id}>{skill.name} ({skill.id})</option>
                    )}
                </select>
            </label>
        </div>
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

    const handleMatch = useCallback((matchedArmors: Set<number>) => {
        setMatched(armors.filter(item => matchedArmors.has(item.id)));
    }, [armors])
    
    return <div style={armorSelectorStyle}>
        <div style={{backgroundColor: '#222', borderBottom: '2px solid #555', padding: '2ch'}}>
            <ArmorFilter armors={armors} onChange={handleMatch} />
        </div>
        <div style={{display: 'flex', flexFlow: 'row wrap'}}>
            {matchedArmors.map(item =>
                <ArmorCard key={item.id} item={item} onClick={onClick} />
            )}
        </div>
    </div>
}