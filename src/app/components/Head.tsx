import Script from "next/script";

export default function Head() {
    return <>
        <title>Risk Thinking AI Assessment</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="description" content="Coding Assessment for RiskThinking AI, designed and developed by Rutvij Sathe" />
        <link rel="icon" href="/favicon.ico" />
        <Script src="https://cdn.jsdelivr.net/npm/ag-grid-community@29.3.3/dist/ag-grid-community.min.js"></Script>
        <Script src="https://cdn.jsdelivr.net/npm/ag-grid-community@29.3.3/styles/ag-theme-alpine-dark.css" />
        <Script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
        {/* <link
				rel="stylesheet"
				href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
			/> */}
    </>
}