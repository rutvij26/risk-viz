'use client';

import { observer, useLocalObservable } from "mobx-react-lite";
import { AgGridReact } from "ag-grid-react";
import RiskStore, { IRiskData } from "../store/RiskStore";
import { useEffect, useMemo, useState } from "react";
import Script from "next/script";

export default observer(function Problem2 () {
    const [rowData, setRowData] = useState([] as IRiskData[])
    const [gridApi, setGridApi] = useState()
    const store = useLocalObservable(() => RiskStore)

    useEffect(() => {
        setRowData(store.tableData)
    },[store.decade, store.tableData])


    const colDef = useMemo(() => [
        { headerName: 'Asset Name', field: 'assetName' ,sortable: true},
        { headerName: 'Latitude', field: 'lat' ,sortable: true, filter: 'agNumberColumnFilter'},
        { headerName: 'Longitude', field: 'long' ,sortable: true, filter: 'agNumberColumnFilter'},
        { headerName: 'Business Category', field: 'businessCategory' ,sortable: true, filter: 'ag'},
        { headerName: 'Risk Rating', field: 'riskRating' ,sortable: true, filter: 'agNumberColumnFilter'},
        { headerName: 'Year', field: 'year' ,sortable: true, filter: 'agSetColumnFilter'},
        ...store.riskKeys?.map((key) => ({
          headerName: key,
          field: `riskFactors.${key}`,
          filter: 'agNumberColumnFilter',
          minWidth: 120,
          sortable: true,
        }))
      ],[store.riskKeys])

    const onGridReady = (params: any) => {
        setGridApi(params)
    }
    
    const defaultColDef = useMemo(() => ({
        flex: 1,
        minWidth: 120,
        filter: 'agTextColumnFilter',
    }),[])

    return (
        <div className="flex h-full w-full items-center justify-center text-black">
        

                <div className="ag-theme-alpine" style={{ height: '90%', width: '90%' }}>
                    <AgGridReact 
                        className="ag-theme-alpine-dark"
                        rowData={rowData}
                        columnDefs={colDef}
                        defaultColDef={defaultColDef}
                        onGridReady={onGridReady}
                    />
                </div>
        </div>
    )
})
