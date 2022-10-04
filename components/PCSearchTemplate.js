import { Fragment, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setDataMenuMore } from "../slices/popupSlice";
import { useIsMd } from './../lib';

export default function PCSearchTemplate({ name, title, menuMore }){
    const isMd = useIsMd();
    const [showSearchMD,setShowSearchMD] = useState(false);
    const dispatch = useDispatch();
    const btnMore = useRef(null);
    return (
        <Fragment>
            <div className="flex w-full justify-end h-9 md:mb-2">
                {!showSearchMD && (
                <h1 className="text-2xl md:text-[2.1875rem] font-black mb-2 flex-1">{name}</h1>
                )}
                <div className={`flex items-center gap-4 ${showSearchMD && "flex-1"}`}>
                    {!isMd || showSearchMD ? (
                    <form method="post" className="relative w-full">
                        <input type="text" placeholder="Search name or hex" onBlur={()=>setShowSearchMD(false)} autoFocus={true} className="text-sm md:block h-9 rounded-lg pr-8 pl-2.5 w-full md:w-48 outline-none border hover:border-gray-400 focus:border-blue-500 transition"/>
                        <button className="absolute right-2 top-1/2 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </form>
                    ) : (
                    <button onClick={()=>setShowSearchMD(true)} className="h-9 px-2.5 border transition hover:border-gray-400 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                        </svg>
                    </button>
                    )}
                    <button id="menuBtn" className={`flex items-center border rounded-lg h-9 px-2.5 gap-2 transition hover:border-gray-400`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M17 2.75a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM17 15.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM3.75 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4.5 2.75a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM10 11a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0v-5.5A.75.75 0 0110 11zM10.75 2.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM10 6a2 2 0 100 4 2 2 0 000-4zM3.75 10a2 2 0 100 4 2 2 0 000-4zM16.25 10a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                        <span className="font-medium text-sm hidden lg:block">Filters</span>
                    </button>
                    <button ref={btnMore} onClick={()=>dispatch(setDataMenuMore({ elementRef: btnMore.current, width: 179, Children: menuMore }))} className="flex items-center border rounded-lg p-1 gap-2 transition hover:border-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            <p className="text-lg">{title}</p> 
        </Fragment>
        
    )
}