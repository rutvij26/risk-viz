import { observer, useLocalObservable } from 'mobx-react-lite';
import RiskStore from '../store/RiskStore';
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';

const redIcon = new L.DivIcon({
    iconUrl: '../../../assets/marker-red.svg',
})

export default observer(function MapLeaftlet() {
    const store = useLocalObservable(() => RiskStore);
    useEffect(() => {
        console.log("Rendering Map!");
        store.setFilteredData();
        console.log("store.filt", store.filteredData);
    }, [store.decade])
    return (
        <>
            <MapContainer center={[43.641070, -79.449130]} zoom={13} className='h-full w-full'>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    store.filteredData.map((d, i) => (
                        <Marker key={i} position={[d.lat, d.long]} icon={redIcon}>
                            <Popup>
                                <h5>Risk Rating : {d.riskRating}</h5>
                                <ul>
                                    {
                                        Object.keys(d.riskFactors).map((r, j) => (
                                            <li key={j}>{r}{" : "}{d.riskFactors[r]}</li>
                                        ))
                                    }
                                </ul>
                            </Popup>
                            <Tooltip>
                                <h5>Asset Name : {d.assetName}</h5>
                                <h5>Business : {d.businessCategory}</h5>
                            </Tooltip>
                        </Marker>
                    ))
                }
            </MapContainer>
        </>
    )
})
