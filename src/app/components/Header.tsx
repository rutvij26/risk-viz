import { observer, useLocalObservable } from "mobx-react-lite";
import RiskStore from "../store/RiskStore";
import { useEffect, useRef } from "react";

export default observer(function Header() {
    const store = useLocalObservable(() => RiskStore);
    
    return (
            <div className="flex flex-row w-screen h-full m-x-auto bg-black justify-around">
                <div className="flex  items-center">
                    <h1 className="text-2xl text-white">RiskThinking.AI Assessment</h1>
                </div>
                <div className="flex ">
                    <select 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-50"
                    value={store.decade} 
                    onChange={(e) => store.setDecade(parseInt(e.target.value))}>
                        {
                            store.decades.map((decade) => (
                                <option key={decade} value={decade}>{decade}s</option>
                            ))
                        }
                    </select>
                </div>
        </div>
    )
})