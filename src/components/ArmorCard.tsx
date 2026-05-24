import { ArmorItem } from "../lib/MHWApi";
import ResistancesViewer from "./Resistances";


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
export default function ArmorCard({item, onClick}: ArmorCardProps) {
    return <div key={item.id} style={armorCardStyle} title={item.description} onClick={() => onClick(item)}>
        <div style={{flexGrow: 1, borderRight: '1px double black'}}>
            <div style={{fontSize: '.7rem'}}>({item.kind.toString().toLocaleUpperCase()})</div>
            <span style={{fontWeight: 'bold'}}>{item.name}</span>
        </div>
        <ResistancesViewer {...item.resistances} />
    </div>
}