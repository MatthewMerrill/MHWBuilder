import React, {useState} from 'react';
import {useQuery} from '@tanstack/react-query';

import ResistancesViewer, {ResistanceStats} from './Resistances';

enum ArmorItemKind {
    head,
    chest,
    arms,
    waist,
    legs,
}

interface Skill {
    id: number,
    gameId: number,
    name: string,
    kind: string,
}

interface ArmorAppliedSkill {
    id: number,
    level: number,
    name: string,
    description: string,
    skill: Skill,
}

interface ArmorItem {
    id: number,
    kind: ArmorItemKind,
    name: string,
    description: string,
    rank: string,
    rarity: number,
    resistances: ResistanceStats,
    skills: ArmorAppliedSkill[],
}

const builderPaneStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'stretch',
    alignItems: 'stretch',
}

interface SelectedItemCardProps {
    slot: string,
    item: ArmorItem | null
}

const selectedItemCardStyle = {
    width: '20ch',
    outline: '1px solid black',
    margin: '1ch',
    backgroundColor: '#f8fff8',
    padding: '.5ch',
};

function SelectedItemCard({slot, item}: SelectedItemCardProps) {
    return <div style={selectedItemCardStyle}>
        <span style={{fontSize: '.8rem'}}>{slot.toLocaleUpperCase()}:</span>
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
}

const selectedSetPaneStyle: React.CSSProperties = {
    padding: '1ch',
    backgroundColor: '#ded',
};

function SelectedSetPane({head, chest, arms, waist, legs}: SelectedSetPaneProps){
    
    // const () => {};
    
    const combinedResistances: ResistanceStats = {
        fire: 0,
        water: 0,
        ice: 0,
        thunder: 0,
        dragon: 0,
    };

    for (let item of [head, chest, arms, waist, legs]) {
        if (item !== null) {
            combinedResistances.fire += item.resistances.fire;
            combinedResistances.water += item.resistances.water;
            combinedResistances.ice += item.resistances.ice;
            combinedResistances.thunder += item.resistances.thunder;
            combinedResistances.dragon += item.resistances.dragon;
        }
    }

    return <div style={selectedSetPaneStyle}>
        <SelectedItemCard slot='head' item={head} />
        <SelectedItemCard slot='chest' item={chest} />
        <SelectedItemCard slot='arms' item={arms} />
        <SelectedItemCard slot='waist' item={waist} />
        <SelectedItemCard slot='legs' item={legs} />

        <hr></hr>

        <ResistancesViewer {...combinedResistances}></ResistancesViewer>
    </div>
}

interface ArmorSelectorProps {
    armors: ArmorItem[],
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

function ArmorSelector({armors, onClick}: ArmorSelectorProps) {
    return <div style={{backgroundColor: '#252e25', flexGrow: '1', overflow: 'scroll'}}>
        {armors.map(
            item => <div key={item.id} style={armorCardStyle} title={item.description} onClick={() => onClick(item)}>
                <div style={{flexGrow: 1, borderRight: '1px double black'}}>
                    <div style={{fontSize: '.7rem'}}>({item.kind.toString().toLocaleUpperCase()})</div>
                    <span style={{fontWeight: 'bold'}}>{item.name}</span>
                </div>
                <ResistancesViewer {...item.resistances} />
            </div>
        )}
    </div>
}

interface BuilderPaneProps {}

export default function BuilderPane({}: BuilderPaneProps) {
    const {
        data: armorItems,
        isPending: armorsPending,
        error: armorsError
    } = useQuery<ArmorItem[]>({
        queryKey: ['api-armors'],
        queryFn: async () => {
            const res = await fetch('https://wilds.mhdb.io/en/armor');
            return res.json();
        },
    });

    const [head, setHead] = useState<ArmorItem|null>(null);
    const [chest, setChest] = useState<ArmorItem|null>(null);
    const [arms, setArms] = useState<ArmorItem|null>(null);
    const [waist, setWaist] = useState<ArmorItem|null>(null);
    const [legs, setLegs] = useState<ArmorItem|null>(null);

    function handleSelect(item: ArmorItem) {
        console.log(item);
        if (item.kind.toString() == 'head') {
            setHead(item);
        } else if (item.kind.toString() == 'chest') {
            setChest(item);
        } else if (item.kind.toString() == 'arms') {
            setArms(item);
        } else if (item.kind.toString() == 'waist') {
            setWaist(item);
        } else if (item.kind.toString() == 'legs') {
            setLegs(item);
        } else {
            console.log('no match: ' + item.kind);
        }
    }

    if (armorsError) {
        console.error('Error loading armors!', armorsError);
        return <h1>errored 😭</h1>
    }

    return <div style={builderPaneStyle}>
        <SelectedSetPane
            head={head}
            chest={chest}
            arms={arms}
            waist={waist}
            legs={legs}
        ></SelectedSetPane>
        {armorItems && <ArmorSelector armors={armorItems} onClick={handleSelect} />}
    </div>
}