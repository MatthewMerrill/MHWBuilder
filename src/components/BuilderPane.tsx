import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { ArmorItem, ArmorItemKind } from '../lib/MHWApi';
import ArmorSelector from './ArmorSelector';
import SelectedSetPane from './SelectedSetPane';
import { useMHWArmorItems } from '../hooks/usemhw';

const builderPaneStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'stretch',
    alignItems: 'stretch',
}

interface BuilderPaneProps {}

export default function BuilderPane({}: BuilderPaneProps) {
    const { data: armorItems, isPending, error: armorError } = useMHWArmorItems();

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

    if (armorError) {
        console.error('Error loading armors!', armorError);
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