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
                            <Tooltip direction='center'>
                                <div className="flex flex-col max-h-fit min-w-[400px] overflow-hidden ">
                                    <h5 className='text-bold text-lg'>Asset Names</h5>
                                    <span className='whitespace-normal'>

                                    {
                                        store.assetNamesForSpecificLatLong(d.lat, d.long).map((asset, i) => (
                                            <span key={i}>{asset+", "}</span>
                                            ))
                                        }
                                    </span>
                                    <h5 className='text-bold text-lg'>Business Categories</h5>
                                    <span className='whitespace-normal'>
                                    {
                                        store.businessCategoriesForSpecificLatLong(d.lat, d.long).map((category, i) => (
                                            <span key={i}>{category+', '}</span>
                                            ))
                                    }
                                    </span>
                                </div>

                            </Tooltip>
                        </Marker>
                    ))
                }
            </MapContainer>
        </>
    )
})
