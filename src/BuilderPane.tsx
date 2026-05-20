import React, {useState} from 'react';
import {useQuery} from '@tanstack/react-query';

import ResistancesViewer from './Resistances';
import { ArmorItem, ArmorItemKind, ResistanceStats } from './MHWApi';
import ArmorSelector from './ArmorSelector';
import { sensitiveHeaders } from 'http2';

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
    item: ArmorItem | null,
    onClear: Function,
}

const selectedItemCardStyle = {
    width: '20ch',
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
    padding: '1ch',
    backgroundColor: '#ded',
};

function SelectedSetPane({head, chest, arms, waist, legs, onClear}: SelectedSetPaneProps){
    
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
        <SelectedItemCard slot='head' item={head} onClear={onClear} />
        <SelectedItemCard slot='chest' item={chest} onClear={onClear} />
        <SelectedItemCard slot='arms' item={arms} onClear={onClear} />
        <SelectedItemCard slot='waist' item={waist} onClear={onClear} />
        <SelectedItemCard slot='legs' item={legs} onClear={onClear} />

        <hr></hr>

        <ResistancesViewer {...combinedResistances}></ResistancesViewer>
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
    function handleClear(slot: ArmorItemKind) {
        if (slot.toString() == 'head') {
            setHead(null);
        } else if (slot.toString() == 'chest') {
            setChest(null);
        } else if (slot.toString() == 'arms') {
            setArms(null);
        } else if (slot.toString() == 'waist') {
            setWaist(null);
        } else if (slot.toString() == 'legs') {
            setLegs(null);
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
            onClear={handleClear}
        ></SelectedSetPane>
        {armorItems && <ArmorSelector armors={armorItems} onClick={handleSelect} />}
    </div>
}