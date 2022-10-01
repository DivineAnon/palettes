import { useEffect, useRef, useState } from "react";
import { useIsMd } from "../lib";

export default function DashboardSearch({ handleSearch, filtersMenu: Menu, title, query, handleChangeSearch, handleRemoveSearch, fetchData }){
    const containerRef = useRef(null);
    const [showSearchMD, setShowSearchMD] = useState(false);
    const [activeMenu, setActiveMenu] = useState(false);
    const [activeSearch, setActiveSearch] = useState(false);
    const dataQuery = useRef([]);
    const isMd = useIsMd();
    const handleRemove = () => {
        containerRef.current?.classList.remove('animate-translateY');
        containerRef.current?.classList.add('animate-translateY-reverse');
        const timeout = setTimeout(()=>{
            if (activeMenu) {
                const queryFiltered = query.filter(data=>data.type!=='search').map(data=>data.data.value);
                const dataQueryMap = dataQuery.current.map(data=>data.data.value);
                const toCompare = queryFiltered.map(data=>dataQueryMap.includes(data));
                if (queryFiltered.length!==dataQueryMap.length || toCompare.includes(false)) {
                    fetchData(query);
                }
            }
            setActiveMenu(false);
        },100)
        return ()=> clearTimeout(timeout);
    }
    const handleOnBlurInput = () => {
        setActiveSearch(false);
        if (query.find(data=>data.type==='search')) {
            fetchData(query);
        }
    }
    const handleOnBlurMD = () => {
        setActiveSearch(false);
        if (!query.find(data=>data.type==='search')) {
            setShowSearchMD(false);
        }else {
            fetchData(query);
        }
    }
    useEffect(()=>{
        const clickEvent = (e) => {
            if (e.target.closest('#menuBtn')) {
                setActiveMenu(!activeMenu);
                dataQuery.current = query.filter(data=>data.type!=='search');
            }else{
                if (!e.target.closest('#menuContainer')) {
                    handleRemove();
                }
            }
        }
        window.addEventListener('click',clickEvent);
        return () => window.removeEventListener('click',clickEvent);
    },[activeMenu,query])
    useEffect(()=>{
        if (!isMd) {
            setShowSearchMD(false);
        }
    },[isMd])
    return (
        <div className={`flex items-center ${!showSearchMD ? 'justify-between' : 'justify-end'}`}>
            {!showSearchMD && (
            <h1 className="text-2xl md:text-[2.1875rem] font-black">{title}</h1>
            )}
            <div className={`flex items-center gap-4 ${showSearchMD && 'flex-1'}`}>
                {!isMd ? (
                <form onSubmit={handleSearch} method="post" className="relative">
                    <input onChange={handleChangeSearch} value={query.find(data=>data.type==='search') ? query.find(data=>data.type==='search').value : ''} onFocus={()=>setActiveSearch(true)} onBlur={handleOnBlurInput} type="text" placeholder="Search name or hex" className="text-sm h-9 pr-8 pl-2.5 border outline-none rounded-lg w-48 hover:border-gray-400 focus:border-blue-500 transition"/>
                    {!query.find(data=>data.type==='search') ? (
                    <button className="absolute right-2 top-1/2 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                        </svg>
                    </button>
                    ) : (
                        activeSearch ? (
                        <button className="absolute right-2 top-1/2 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                            </svg>
                        </button>
                        ) : (
                        <button onClick={(e)=>{e.preventDefault();handleRemoveSearch()}} className="absolute right-2 top-1/2 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 bg-black/50 rounded-full text-white">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </button>
                        )
                    )}
                </form>
                ) : (
                showSearchMD ? (
                <form onSubmit={handleSearch} method="post" className="relative flex-1">
                    <input type="text" onChange={handleChangeSearch} value={query.find(data=>data.type==='search') ? query.find(data=>data.type==='search').value : ''} autoFocus={true} onFocus={()=>setActiveSearch(true)} onBlur={handleOnBlurMD} placeholder="Search name or hex" className="text-sm h-9 pr-8 pl-2.5 border outline-none rounded-lg w-full hover:border-gray-400 focus:border-blue-500 transition"/>
                    {!query.find(data=>data.type==='search') ? (
                    <button className="absolute right-2 top-1/2 -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                        </svg>
                    </button>
                    ) : (
                        activeSearch ? (
                        <button className="absolute right-2 top-1/2 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                            </svg>
                        </button>
                        ) : (
                        <button onClick={(e)=>{e.preventDefault();handleRemoveSearch();setShowSearchMD(false)}} className="absolute right-2 top-1/2 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 bg-black/50 rounded-full text-white">
                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                        </button>
                        )
                    )}
                </form>
                ) : (
                <button onClick={()=>setShowSearchMD(true)} className="h-9 w-9 flex items-center justify-center border rounded-lg transition hover:border-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                    </svg>
                </button>
                )
                )}
                <div className="relative">
                    {query.filter(data=>data.type!=='search').length>0 && (
                    <div className="absolute w-3 h-3 right-0 translate-x-1 -translate-y-1 bg-blue-600 rounded-full"></div>
                    )}
                    <button id="menuBtn" className={`flex items-center border rounded-lg h-9 px-2.5 gap-2 transition ${activeMenu ? 'border-gray-400 bg-gray-50' : 'hover:border-gray-400'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M17 2.75a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM17 15.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM3.75 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4.5 2.75a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM10 11a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0v-5.5A.75.75 0 0110 11zM10.75 2.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM10 6a2 2 0 100 4 2 2 0 000-4zM3.75 10a2 2 0 100 4 2 2 0 000-4zM16.25 10a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                        <span className="font-medium text-sm hidden lg:block">Filters</span>
                    </button>
                    {activeMenu && (
                    <div className={`fixed bg-black/30 md:bg-transparent h-full top-0 left-0 md:left-[unset] md:absolute z-[100] md:top-full md:right-[calc(50%-20px)] flex flex-col md:block justify-end`}>
                        <div ref={containerRef} className="animate-translateY md:animate-none">
                            <div className="translate-x-[calc(100%-30px)] relative hidden md:block">
                                <div className="h-0 w-0 border-x-8 z-10 relative border-x-transparent border-b-8 border-b-white"></div>
                                <div className="h-0 w-0 absolute top-0 border-x-[10px] border-x-transparent border-b-[9px] translate-y-[-1px] translate-x-[-1.5px] border-b-gray-300"></div>
                            </div>
                            <div className="bg-white rounded-tl-xl rounded-tr-xl md:rounded-xl md:shadow-2xl md:border w-full md:w-[528px]">
                                <Menu/>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    )
}