import React from 'react';

import { ResistanceStats } from '../lib/MHWApi';

const ResistanceBlock = ({kind, value}: {kind: String, value: number}) => <>
    <div style={{ display: 'flex', flexFlow: 'column nowrap', width: '6ch', alignItems: 'center'}}>
        <div>{kind.toUpperCase()}</div>
        <div style={{fontWeight: 'bolder'}}>{value}</div>
    </div>
</>

export default function ResistancesViewer({fire, water, ice, thunder, dragon}: ResistanceStats) {
    return <div style={{display: 'flex', flexFlow: 'row nowrap', flexGrow: 0, justifyContent: 'center'}}>
        <ResistanceBlock kind="F" value={fire} />
        <ResistanceBlock kind="W" value={water} />
        <ResistanceBlock kind="I" value={ice} />
        <ResistanceBlock kind="T" value={thunder} />
        <ResistanceBlock kind="D" value={dragon} />
    </div>
}