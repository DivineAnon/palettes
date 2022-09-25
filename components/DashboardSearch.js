import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useIsMd } from "../lib";
import { setDataMenuMore } from "../slices/popupSlice";

export default function DashboardSearch({ handleSearch, filtersMenu, title }){
    const filterBtnRef = useRef(null);
    const [showSearchMD, setShowSearchMD] = useState(false);
    const dispatch = useDispatch();
    const isMd = useIsMd();
    const customClickEvent = (e, isMd) => {
        if (isMd) {
            if (!e.target.closest('#con-menu-md')) {
                return true;
            }
        }else {
            if (!e.target.closest('#con-menu-rlv')) {
                return true;
            }
        }
    }
    return (
        <div className={`flex items-center ${!showSearchMD ? 'justify-between' : 'justify-end'}`}>
            {!showSearchMD && (
            <h1 className="text-2xl md:text-[2.1875rem] font-black">{title}</h1>
            )}
            <div className={`flex items-center gap-4 ${showSearchMD && 'flex-1'}`}>
                {!isMd ? (
                <form onSubmit={handleSearch} method="post" className="relative">
                    <input type="text" placeholder="Search name or hex" className="text-sm h-9 pr-8 pl-2.5 border outline-none rounded-lg w-48 hover:border-gray-400 focus:border-blue-500 transition"/>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                        </svg>
                    </button>
                </form>
                ) : (
                showSearchMD ? (
                <form onSubmit={handleSearch} method="post" className="relative flex-1">
                    <input type="text" autoFocus={true} onBlur={()=>setShowSearchMD(false)} placeholder="Search name or hex" className="text-sm h-9 pr-8 pl-2.5 border outline-none rounded-lg w-full hover:border-gray-400 focus:border-blue-500 transition"/>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                        </svg>
                    </button>
                </form>
                ) : (
                <button onClick={()=>setShowSearchMD(true)} className="h-9 w-9 flex items-center justify-center border rounded-lg transition hover:border-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                    </svg>
                </button>
                )
                )}
                <button ref={filterBtnRef} onClick={()=>dispatch(setDataMenuMore({ width: 528, elementRef: filterBtnRef.current, Children: filtersMenu, customClickEvent }))} className="flex items-center border rounded-lg h-9 px-2.5 gap-2 transition hover:border-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M17 2.75a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM17 15.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM3.75 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4.5 2.75a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM10 11a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0v-5.5A.75.75 0 0110 11zM10.75 2.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM10 6a2 2 0 100 4 2 2 0 000-4zM3.75 10a2 2 0 100 4 2 2 0 000-4zM16.25 10a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    <span className="font-medium text-sm hidden lg:block">Filters</span>
                </button>
            </div>
        </div>
    )
}