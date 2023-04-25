'use client';

import { observer } from "mobx-react-lite"
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

const MapLeaflet = dynamic(
	() => import('./components/MapLeaflet'),
	{ ssr: false }
  );

export default observer(function Home() {
	return (
			<MapLeaflet />
	)
});
