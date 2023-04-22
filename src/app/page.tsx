'use client';

import { observer, useLocalObservable } from "mobx-react-lite"
import RiskStore from "./store/RiskStore";
import { useEffect } from "react";
import Map from '@/app/components/Map';
import { useRouter } from "next/router";

export default  observer( function Home() {
  const store = useLocalObservable(() => RiskStore);
  useEffect(() => {
    store.init();
  }, [])

  return (
    <div className="h-screen w-screen">
      <Map data={store?.data}/>      
    </div>
  )
});
