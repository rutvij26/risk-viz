'use client';
import { observer, useLocalObservable } from 'mobx-react-lite';
import RiskStore from '../store/RiskStore';
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const redIcon = new L.Icon({
    iconUrl: 'https://svgshare.com/i/sYf.svg',
    iconRetinaUrl: 'https://svgshare.com/i/sYf.svg',
    iconSize: [32,45]
    
})
const blueIcon = new L.Icon({
    iconUrl: 'https://svgshare.com/i/sYB.svg',
    iconRetinaUrl: 'https://svgshare.com/i/sYB.svg',
    iconSize: [32,45]
    
})
const greenIcon = new L.Icon({
    iconUrl: 'https://svgshare.com/i/sYq.svg',
    iconRetinaUrl: 'https://svgshare.com/i/sYq.svg',
    iconSize: [32,45]
    
})

export default observer(function MapLeaftlet() {
    const store = useLocalObservable(() => RiskStore);
    return (
        <>
            <MapContainer center={[43.86682, -79.2663]} zoom={14} className='h-full w-full'>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    store.filteredMapData && store.filteredMapData.length > 0
                    ? store.filteredMapData.map((d, i) => (
                        d 
                        ? <Marker 
                        key={i} 
                        position={[d.lat, d.long]} 
                        icon={d.averageRiskRating >= 0.5
                        ? redIcon
                        : d.averageRiskRating >= 0.25 ? blueIcon : greenIcon}>
                            <Popup>
                                <h4>Year: {d.year}</h4>
                                <h5>Risk Rating : {d.averageRiskRating}</h5>
                                <ul>
                                    {
                                        Object.keys(d.averageRiskFactors).map((r, j) => (
                                            <li key={j}>{r}{" : "}{parseFloat(d.averageRiskFactors[r].toFixed(4))}</li>
                                        ))
                                    }
                                </ul>
                            </Popup>
                            <Tooltip direction='auto'>
                                <div className="flex flex-col max-h-fit min-w-[400px] overflow-hidden ">
                                    <h5 className='text-bold text-lg'>Asset Names</h5>
                                    <span className='whitespace-normal'>

                                    {
                                        d.assetNames.map((asset, i) => (
                                            <span key={i}>{asset+", "}</span>
                                            ))
                                        }
                                    </span>
                                    <h5 className='text-bold text-lg'>Business Categories</h5>
                                    <span className='whitespace-normal'>
                                    {
                                        d.businessCategories.map((category, i) => (
                                            <span key={i}>{category+', '}</span>
                                            ))
                                    }
                                    </span>
                                </div>

                            </Tooltip>
                        </Marker>
                        : <div key={i}></div>
                    ))
                    : <></>
                }
            </MapContainer>
        </>
    )
})
