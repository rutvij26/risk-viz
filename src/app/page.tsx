'use client';

import { observer, useLocalObservable } from "mobx-react-lite"
import MapLeaflet from "./components/MapLeaflet";
import "leaflet/dist/leaflet.css";

export default observer(function Home() {
	return (
			<MapLeaflet />
	)
});
