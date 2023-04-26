import { observer, useLocalObservable } from 'mobx-react-lite';
import RiskStore from '../store/RiskStore';
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

const redIcon = new L.DivIcon({
    iconUrl: '../../../assets/marker-red.svg',
})

export default observer(function MapLeaftlet() {
    const store = useLocalObservable(() => RiskStore);
    useEffect(() => {
        console.log("Filtered Map Data",store.filteredMapData);
        console.log("LatLongs",store.latLongs);

    }, [store.filteredMapData, store.decade])
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
                        ? <Marker key={i} position={[d.lat, d.long]} icon={redIcon}>
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
                        : <></>
                    ))
                    : <></>
                }
            </MapContainer>
        </>
    )
})
