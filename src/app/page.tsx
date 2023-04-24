'use client';

import { observer, useLocalObservable } from "mobx-react-lite"
import Header from "./components/Header";
import Footer from "./components/Footer";
import RiskStore from "./store/RiskStore";
import { useEffect } from "react";
import MapLeaflet from "./components/MapLeaflet";
import "leaflet/dist/leaflet.css";

export default observer(function Home() {

	const store = useLocalObservable(() => RiskStore);

	useEffect(() => {
		store.init();
	}, [store])

	return (
		<div className="flex flex-col h-screen w-screen bg-blue">
			<link
				rel="stylesheet"
				href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
			/>
			<div className="flex flex-col  h-[7%] min-w-screen items-center justify-center ">
				<Header />
			</div>
			<MapLeaflet />
			<div className="flex-col-reverse h-[6%] w-screen items-center justify-center">
				<Footer />
			</div>
		</div>
	)
});
