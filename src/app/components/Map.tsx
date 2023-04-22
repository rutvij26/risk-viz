import { observer } from "mobx-react-lite";
import { IRiskData } from '../store/RiskStore';

interface MapProps {
    data: IRiskData[]
}

export default observer (function Map ({data}: MapProps) {
    return (
        <div className="items-center justify-center"> 
        {data.map((d: IRiskData, i) => (
            <h1 key={i}>{d.assetName}</h1>
        ))}
        Map should be rendered here!
        </div>
    )
})