import { Fragment, useEffect, useState } from "react";
import PaletteSidebar from "./PaletteSidebar";
import Spinner from "./Spinner";
import { colorsGroup } from "../lib";
import { useRef } from "react";
import randomColor from "randomcolor";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, selectUserProjects } from "../slices/userSlice";
import { handleSavePalette, openPopupCollection, openPopupProject, selectDataMenuMore, setDataMenuMore, setDataPopupCollection, setDataPopupProject, setIdDeleteCollection, setIdDeleteProject, setLoginRes } from "../slices/popupSlice";
import { fetchSidebarExplore, fetchSidebarExploreMore, fetchSidebarLibrary, fetchSidebarLibraryMore, selectLoadingSidebarExplore, selectLoadingSidebarExploreMore, selectLoadingSidebarLibrary, selectLoadingSidebarLibraryMore, selectSidebarExplore, selectSidebarExplorePage, selectSidebarLibrary, selectSidebarLibraryPage } from "../slices/sidebarSlice";
import { selectShowSidebar, setShowSidebar } from "../slices/globalSlice";

export default function Sidebar({ className, showSearch , ...props }){
    const showMenuMore = useSelector(selectDataMenuMore);
    const showSidebar = useSelector(selectShowSidebar);
    const user = useSelector(selectUser);
    const palettesLibrary = useSelector(selectSidebarLibrary);
    const projects = useSelector(selectUserProjects);
    const palettesExplore = useSelector(selectSidebarExplore);
    const loadingPaletteExplore = useSelector(selectLoadingSidebarExplore);
    const loadingFetchMoreExplore = useSelector(selectLoadingSidebarExploreMore);
    const pageExplore = useSelector(selectSidebarExplorePage);
    const pageLibrary = useSelector(selectSidebarLibraryPage);
    const loadingPaletteLibrary = useSelector(selectLoadingSidebarLibrary);
    const loadingFetchMoreLibrary = useSelector(selectLoadingSidebarLibraryMore);
    const dispatch = useDispatch();
    const [view, setView] = useState('library');
    const [searchViewTrending, setSearchViewTrending] = useState(false);
    const [searchViewSaves, setSearchViewSaves] = useState(false);
    const [filterPalettes, setFilterPalettes] = useState(false);
    const [filterPalettesTrending, setFilterPalettesTrending] = useState({ type: 'sort', value: 'Trending' });
    const [filterPalettesSaves, setFilterPalettesSaves] = useState({ type: 'all', id: '', value: 'All palettes' });
    const [queryExploreBefore, setQueryExploreBefore] = useState(null);
    const [queryLibraryBefore, setQueryLibraryBefore] = useState(null);
    const isMounted = useRef(false);
    const handleSearchExplore = (e) => {
        e.preventDefault();
        setFilterPalettesTrending({ type: 'search', value: e.target[0].value });
    }
    const handleSearchLibrary = (e) => {
        e.preventDefault();
        setFilterPalettesSaves({ type: 'search', value: e.target[0].value });
    }
    const getFetchQuery = (view,queryList,page) => {
        const { type, value, id } = queryList;
        if (view==='explore') {
            const query = [`page=${page}`,`${type==='sort' ? `sort=${value.toLowerCase()}` : 'sort=trending'}`];
            if (type==='style') {
                query.push(`styles=${value}`);
            }
            if (type==='color') {
                query.push(`colors=${value}`);
            }
            if (type==='search') {
                query.push(`search=${value}`);
            }
            return query.join('&');
        }else {
            const query = [`page=${page}`];
            if (type==='style') {
                query.push(`styles=${value}`);
            }
            if (type==='color') {
                query.push(`colors=${value}`);
            }
            if (type==='project') {
                query.push(`projects=${id}`);
            }
            if (type==='collection') {
                query.push(`collections=${id}`);
            }
            if (type==='search') {
                query.push(`search=${value}`);
            }
            return query.join('&');
        }
    }
    const menuMoreProject = (project) => (
    <section>
        <div onClick={()=>handleMenuProject('edit',project)} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="text-sm font-medium">Edit project</span>
        </div>
        <div onClick={()=>handleMenuProject('delete',project)} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-sm font-medium">Delete project</span>
        </div>
    </section>
    )
    const handleMenuProject = (menu,data) => {
        if (menu==='edit') {
            dispatch(setDataPopupProject(data));
        }
        if (menu==='delete') {
            dispatch(setIdDeleteProject(data.id));
        }
    }
    const menuMoreCollection = (collection) => (
        <section>
            <div onClick={()=>handlemenuCollection('edit',collection)} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span className="text-sm font-medium">Edit collection</span>
            </div>
            <div onClick={()=>handlemenuCollection('delete',collection)} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="text-sm font-medium">Delete collection</span>
            </div>
        </section>
    )
    const handlemenuCollection = (menu,data) => {
        if (menu==='edit') {
            dispatch(setDataPopupCollection(data));
        }
        if (menu==='delete') {
            dispatch(setIdDeleteCollection(data.id));
        }
    }
    const handleAddRandom = () => {
        dispatch(handleSavePalette(user,randomColor({ count: 5 }).map(hex=>hex.slice(1)),'save'));
    }
    const fetchNewPaletteExplore = () => {
        dispatch(fetchSidebarExploreMore(getFetchQuery('explore',filterPalettesTrending,parseInt(pageExplore)+1)));
    }
    const fetchNewPaletteLibrary = () => {
        dispatch(fetchSidebarLibraryMore(getFetchQuery('library',filterPalettesSaves,parseInt(pageLibrary)+1)));
    }
    useEffect(()=>{
        if (isMounted.current) {
            dispatch(fetchSidebarExplore(getFetchQuery('explore',filterPalettesTrending,1)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[filterPalettesTrending])
    useEffect(()=>{
        if (isMounted.current && user) {
            dispatch(fetchSidebarLibrary(getFetchQuery('library',filterPalettesSaves,1)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[filterPalettesSaves])
    useEffect(()=>{
        if (isMounted.current) {
           if (!searchViewTrending) {
                if (queryExploreBefore) {
                    setFilterPalettesTrending(queryExploreBefore);
                }
           }else {
                setQueryExploreBefore(filterPalettesTrending);
           }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchViewTrending])
    useEffect(()=>{
        if (isMounted.current) {
            if (!searchViewSaves) {
                if (queryLibraryBefore) {
                    setFilterPalettesSaves(queryLibraryBefore);
                }
            }else {
                setQueryLibraryBefore(filterPalettesSaves);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchViewSaves])
    useLayoutEffect(()=>{
        if (view==='explore') {
            document.getElementsByClassName('infiniteExplore')[0]?.parentElement.classList.add('h-[calc(100%-100px)]','flex-1');
        }
        if (view==='library') {
            document.getElementsByClassName('infiniteLibrary')[0]?.parentElement.classList.add('h-[calc(100%-100px)]','flex-1');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[view,filterPalettesTrending,filterPalettesSaves])
    useEffect(()=>{
        isMounted.current = true;
        dispatch(fetchSidebarExplore(getFetchQuery('explore',filterPalettesTrending,1)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(()=>{
        if (user) {
            dispatch(fetchSidebarLibrary(getFetchQuery('library',filterPalettesSaves,1)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user])
    return (
        <Fragment>
            <div { ...props } className={`w-[360px] md:w-[300px] flex flex-col h-full transition duration-300 bg-white border-l fixed top-0 z-50 right-0 ${showSearch ? 'md:z-0' : 'md:z-10'} ${showSidebar ? 'translate-x-0' : 'translate-x-full'} ${className}`}>
                {!filterPalettes ? (
                <Fragment>
                    <div className="relative border-b py-3 z-10">
                        <div onClick={()=>dispatch(setShowSidebar(false))} className="p-1.5 md:hidden rounded transition hover:bg-gray-100 cursor-pointer absolute left-3 top-1/2 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="w-max mx-auto flex gap-4 text-[15px]">
                            <button onClick={()=>setView('library')} className={`transition font-medium ${view==='library' ? 'text-black' : 'text-gray-400 hover:text-black'}`}>Library</button>
                            <button onClick={()=>setView('explore')} className={`transition font-medium ${view==='explore' ? 'text-black' : 'text-gray-400 hover:text-black'}`}>Explore</button>
                        </div>
                        <div onClick={handleAddRandom} className="p-1.5 rounded transition hover:bg-gray-100 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    {view==='library' ? (
                        user && (
                        !searchViewSaves ? (
                            <div className="py-2 pl-4 pr-3 border-b flex justify-between items-center">
                                <div onClick={()=>setFilterPalettes(true)} className="flex cursor-pointer items-center gap-0.5 text-scondary hover:text-black transition">
                                    <span className="text-sm font-medium">{filterPalettesSaves.value}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div onClick={()=>setSearchViewSaves(true)} className="p-1.5 rounded hover:bg-gray-100 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        ) : (
                            <div className="py-2 pl-4 pr-3 border-b flex justify-between items-center">
                                <div className="text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <form method="post" onSubmit={handleSearchLibrary}>
                                    <input type="text" className="outline-none text-sm font-medium" placeholder="Search keyword"/>
                                </form>
                                <div onClick={()=>setSearchViewSaves(false)} className="p-1.5 rounded hover:bg-gray-100 transition cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        )
                        )
                    ) : (
                    <div className="py-2 pl-4 pr-3 border-b flex justify-between items-center">
                        {!searchViewTrending ? (
                            <Fragment>
                                <div onClick={()=>setFilterPalettes(true)} className="flex cursor-pointer items-center gap-0.5 text-scondary hover:text-black transition">
                                    <span className="text-sm font-medium">{filterPalettesTrending.value}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div onClick={()=>setSearchViewTrending(true)} className="p-1.5 rounded hover:bg-gray-100 transition cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <div className="text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <form method="post" onSubmit={handleSearchExplore}>
                                    <input type="text" className="outline-none text-sm font-medium" placeholder="Search keyword"/>
                                </form>
                                <div onClick={()=>setSearchViewTrending(false)} className="p-1.5 rounded hover:bg-gray-100 transition cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </Fragment>
                        )}
                    </div>
                    )}
                    {
                    view==='library' ? (
                    <InfiniteScroll
                        dataLength={palettesLibrary.data.length}
                        hasMore={true}
                        next={fetchNewPaletteLibrary}
                        style={{ overflow: 'auto', height: '100%' }}
                        scrollableTarget="scrollLibrary"
                        className="infiniteLibrary"
                    >
                        <div id="scrollLibrary" className="p-4 overflow-auto flex flex-col gap-1 h-full hide-scrollbar">
                            {user ? (
                                <Fragment>
                                    {loadingPaletteLibrary ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Spinner w={8} h={8}/>
                                    </div>
                                    ) : (
                                    palettesLibrary.data.length > 0 ? (
                                        palettesLibrary.data.map(((obj,i)=>(
                                            <PaletteSidebar index={i} key={i} saves={true} data={obj}/>
                                        )))
                                    ) : (
                                        <div className="px-[10px] py-[20px]">
                                            <p className="text-sm text-scondary text-center">
                                            {filterPalettesSaves.type==='search' ? 'No palettes found.' : 'Your saved palettes will appear here.'}
                                            </p>
                                        </div>
                                    )
                                    )}
                                    {loadingFetchMoreLibrary && (
                                    <div>
                                        <Spinner w={8} h={8}/>
                                    </div>
                                    )}
                                </Fragment>
                            ) : (
                                <div className="flex gap-6 flex-col items-center justify-center h-full">
                                    <p className="text-scondary text-sm font-medium">Sign in to view your saved palettes.</p>
                                    <button onClick={()=>dispatch(setLoginRes('login'))} className="text-sm font-medium border transition border-gray px-3 py-1.5 border-gray-300 hover:border-gray-400 rounded-lg">Sign in</button>
                                </div>
                            )}
                        </div>
                    </InfiniteScroll>
                    ) : (
                    <InfiniteScroll
                        dataLength={palettesExplore.data.length}
                        hasMore={true}
                        next={fetchNewPaletteExplore}
                        style={{ overflow: 'auto', height: '100%' }}
                        scrollableTarget="scrollExplore"
                        className="infiniteExplore"
                    >
                        <div id="scrollExplore" className="p-4 overflow-auto flex flex-col gap-1 h-full hide-scrollbar">
                            {loadingPaletteExplore ? (
                                <div className="flex items-center justify-center h-full">
                                    <Spinner w={8} h={8}/>
                                </div>
                            ) : (
                                palettesExplore.data.length>0 ? (
                                    palettesExplore.data.map(((obj,i)=>(
                                        <PaletteSidebar index={i} key={obj.id} data={obj}/>
                                    )))
                                ) : (
                                <p className="text-center text-sm text-[#7d7c83] px-[10px] py-[20px]">No palettes found.</p>
                                )
                            )}
                            {loadingFetchMoreExplore && (
                                <div>
                                    <Spinner w={8} h={8}/>
                                </div>
                            )}
                        </div>
                    </InfiniteScroll>
                    )
                    }
                </Fragment>
                ) : (
                <Fragment>
                    <div className="relative border-b py-3">
                        <p className="font-bold text-center text-[15px]">Filter palettes</p>
                        <div onClick={()=>setFilterPalettes(false)} className="p-1.5 rounded transition-[background-color] hover:bg-gray-100 cursor-pointer absolute left-2 top-1/2 -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    {view==='explore' ? (
                    <div className="flex-1 hide-scrollbar overflow-auto">
                        <div className="p-2 border-b">
                            <p className="h-[34px] p-2 text-sm font-bold mb-1">Sort</p>
                            <div onClick={()=>{setFilterPalettesTrending({ type: 'sort', value: 'Trending' });setFilterPalettes(false)}} className={`rounded-md px-3 py-1.5 mb-1 cursor-pointer flex items-center justify-between ${filterPalettesTrending.type==='sort' && filterPalettesTrending.value==='Trending' ? 'bg-blue-100/80 text-[#0066ff] hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                <span className="text-sm">Trending</span>
                                {filterPalettesTrending.type==='sort' && filterPalettesTrending.value==='Trending' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                            <div onClick={()=>{setFilterPalettesTrending({ type: 'sort', value: 'Latest' });setFilterPalettes(false)}} className={`rounded-md px-3 mb-1 py-1.5 cursor-pointer flex items-center justify-between ${filterPalettesTrending.type==='sort' && filterPalettesTrending.value==='Latest' ? 'bg-blue-100/80 text-[#0066ff] hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                <span className="text-sm">Latest</span>
                                {filterPalettesTrending.type==='sort' && filterPalettesTrending.value==='Latest' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                            <div onClick={()=>{setFilterPalettesTrending({ type: 'sort', value: 'Popular' });setFilterPalettes(false)}} className={`rounded-md px-3 py-1.5 cursor-pointer flex items-center justify-between ${filterPalettesTrending.type==='sort' && filterPalettesTrending.value==='Popular' ? 'bg-blue-100/80 text-[#0066ff] hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                <span className="text-sm">Popular</span>
                                {filterPalettesTrending.type==='sort' && filterPalettesTrending.value==='Popular' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                        </div>
                        <div className="p-2 border-b">
                            <p className="h-[34px] p-2 text-sm font-bold mb-1">Style</p>
                            <div onClick={()=>{setFilterPalettesTrending({ type: 'style', value: 'Dark' });setFilterPalettes(false)}} className={`rounded-md px-3 py-1.5 mb-1 cursor-pointer flex items-center justify-between ${filterPalettesTrending.type==='style' && filterPalettesTrending.value==='Dark' ? 'bg-blue-100/80 text-[#0066ff] hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                <span className="text-sm">Dark</span>
                                {filterPalettesTrending.type==='style' && filterPalettesTrending.value==='Dark' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                            <div onClick={()=>{setFilterPalettesTrending({ type: 'style', value: 'Bright' });setFilterPalettes(false)}} className={`rounded-md px-3 mb-1 py-1.5 cursor-pointer flex items-center justify-between ${filterPalettesTrending.type==='style' && filterPalettesTrending.value==='Bright' ? 'bg-blue-100/80 text-[#0066ff] hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                <span className="text-sm">Bright</span>
                                {filterPalettesTrending.type==='style' && filterPalettesTrending.value==='Bright' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                            <div onClick={()=>{setFilterPalettesTrending({ type: 'style', value: 'Gradient' });setFilterPalettes(false)}} className={`rounded-md px-3 py-1.5 cursor-pointer flex items-center justify-between ${filterPalettesTrending.type==='style' && filterPalettesTrending.value==='Gradient' ? 'bg-blue-100/80 text-[#0066ff] hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                <span className="text-sm">Gradient</span>
                                {filterPalettesTrending.type==='style' && filterPalettesTrending.value==='Gradient' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                        </div>
                        <div className="p-2 border-b">
                            <p className="h-[34px] p-2 text-sm font-bold mb-1">Color</p>
                            {colorsGroup.map((color,i)=>(
                            <div key={i} onClick={()=>{setFilterPalettesTrending({ type: 'color', value: color.value });setFilterPalettes(false)}} className={`rounded-md px-3 py-1.5 mb-1 cursor-pointer flex items-center justify-between ${filterPalettesTrending.type==='color' && filterPalettesTrending.value===color.value ? 'bg-blue-100/80 text-[#0066ff] hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                <div className="flex gap-2 items-center">
                                    <div style={{ backgroundColor: color.hex }} className={`w-3 h-3 rounded-full ${color.value==='White' && 'border'}`}></div>
                                    <span className="text-sm">{color.value}</span>
                                </div>
                                {filterPalettesTrending.type==='color' && filterPalettesTrending.value===color.value && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                            ))}
                        </div>
                    </div>
                    ) : (
                    <div className="flex-1 hide-scrollbar overflow-auto">
                        <div className="p-2 border-b">
                            <div onClick={()=>{setFilterPalettesSaves({type: 'all', id: '', value: 'All palettes'});setFilterPalettes(false)}} className={`rounded-md px-3 py-1.5 cursor-pointer flex items-center justify-between ${filterPalettesSaves.type==='all' ? 'bg-blue-100/80 text-[#0066ff] hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                <span className="text-sm">All palettes</span>
                                {filterPalettesSaves.type==='all' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                        </div>
                        <div className="p-2 border-b">
                            <div className="h-[34px] py-2 pl-2 pr-1 mb-1 flex items-center justify-between">
                                <p className="text-sm font-bold">Projects</p>
                                <svg onClick={()=>dispatch(openPopupProject())} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rounded transition hover:bg-gray-100 cursor-pointer p-0.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {
                            projects.data.length > 0 ? (
                                projects.data.map((project)=>(
                                <div key={project.id} className="relative">
                                    <div className={`rounded-md group cursor-pointer flex items-center justify-between ${filterPalettesSaves.type==='project' && filterPalettesSaves.id===project.id ? 'bg-blue-100/80 text-[#0066ff] hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                        <span onClick={()=>{setFilterPalettesSaves({type: 'project', id: project.id, value: project.name});setFilterPalettes(false)}} className="text-sm px-3 py-1.5 flex-1">{project.name}</span>
                                        <div className="relative pr-3 flex gap-2 items-center">
                                            <svg id={`prjct-menu-${project.id}`} onClick={()=>dispatch(setDataMenuMore({ width: 170, elementRef: document.getElementById(`prjct-menu-${project.id}`), Children:()=> menuMoreProject(project) }))} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-scondary hover:text-black ${showMenuMore?.elementRef.id!==`prjct-menu-${project.id}` && 'hidden group-hover:block'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                            </svg>
                                            {filterPalettesSaves.type==='project' && filterPalettesSaves.id===project.id && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                ))
                            ) : (
                            <p className="text-[#b1b0b5] mb-2 mt-1.5 ml-2 text-sm font-medium">No projects yet.</p>
                            )
                            }
                        </div>
                        <div className="p-2 border-b">
                            <div className="h-[34px] py-2 pl-2 pr-1 mb-1 flex items-center justify-between">
                                <p className="text-sm font-bold">Collections</p>
                                <svg onClick={()=>dispatch(openPopupCollection())} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rounded transition hover:bg-gray-100 cursor-pointer p-0.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {
                            user?.collections.data.length > 0 ? (
                                user?.collections.data.map(collection=>(
                                <div key={collection.id} className="relative">
                                    <div className={`rounded-md group cursor-pointer flex items-center justify-between ${filterPalettesSaves.type==='collection' && filterPalettesSaves.id===collection.id ? 'bg-blue-100/80 text-[#0066ff] hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                        <span onClick={()=>{setFilterPalettesSaves({type: 'collection', id: collection.id, value: collection.name});setFilterPalettes(false)}} className="text-sm px-3 py-1.5 flex-1">{collection.name}</span>
                                        <div className="relative pr-3 flex gap-2 items-center">
                                            <svg id={`collection-more-${collection.id}`} onClick={()=>dispatch(setDataMenuMore({ width: 188, elementRef: document.getElementById(`collection-more-${collection.id}`), Children: ()=> menuMoreCollection(collection) }))} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-scondary hover:text-black ${showMenuMore?.elementRef.id!== `collection-more-${collection.id}` && 'hidden group-hover:block'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                            </svg>
                                            {filterPalettesSaves.type==='collection' && filterPalettesSaves.id===collection.id && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                ))
                            ) : (
                            <p className="text-[#b1b0b5] mb-2 mt-1.5 ml-2 text-sm font-medium">No collections yet.</p>
                            )
                            }
                        </div>
                        <div className="p-2 border-b">
                            <p className="h-[34px] p-2 text-sm font-bold mb-1">Style</p>
                            <div onClick={()=>{setFilterPalettesSaves({type: 'style', id: '', value: 'Dark'});setFilterPalettes(false)}} className={`rounded-md px-3 py-1.5 mb-1 cursor-pointer flex items-center justify-between ${filterPalettesSaves.type==='style' && filterPalettesSaves.value==='Dark' ? 'bg-blue-100/80 text-[#0066ff] hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                <span className="text-sm">Dark</span>
                                {filterPalettesSaves.type==='style' && filterPalettesSaves.value==='Dark' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                            <div onClick={()=>{setFilterPalettesSaves({type: 'style', id: '', value: 'Bright'});setFilterPalettes(false)}} className={`rounded-md px-3 mb-1 py-1.5 cursor-pointer flex items-center justify-between ${filterPalettesSaves.type==='style' && filterPalettesSaves.value==='Bright' ? 'bg-blue-100/80 text-[#0066ff] hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                <span className="text-sm">Bright</span>
                                {filterPalettesSaves.type==='style' && filterPalettesSaves.value==='Bright' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                            <div onClick={()=>{setFilterPalettesSaves({type: 'style', id: '', value: 'Gradient'});setFilterPalettes(false)}} className={`rounded-md px-3 py-1.5 cursor-pointer flex items-center justify-between ${filterPalettesSaves.type==='style' && filterPalettesSaves.value==='Gradient' ? 'bg-blue-100/80 text-[#0066ff] hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                <span className="text-sm">Gradient</span>
                                {filterPalettesSaves.type==='style' && filterPalettesSaves.value==='Gradient' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                        </div>
                        <div className="p-2 border-b">
                            <p className="h-[34px] p-2 text-sm font-bold mb-1">Color</p>
                            {colorsGroup.map((color,i)=>(
                            <div key={i} onClick={()=>{setFilterPalettesSaves({type: 'color', id: '', value: color.value});setFilterPalettes(false)}} className={`rounded-md px-3 py-1.5 mb-1 cursor-pointer flex items-center justify-between ${filterPalettesSaves.type==='color' && filterPalettesSaves.value===color.value ? 'bg-blue-100/80 text-[#0066ff] hover:bg-blue-100' : 'hover:bg-gray-100'}`}>
                                <div className="flex gap-2 items-center">
                                    <div style={{ backgroundColor: color.hex }} className={`w-3 h-3 rounded-full ${color.value==='White' && 'border'}`}></div>
                                    <span className="text-sm">{color.value}</span>
                                </div>
                                {filterPalettesSaves.type==='color' && filterPalettesSaves.value===color.value && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                            ))}
                        </div>
                    </div>
                    )}
                </Fragment>
                )}
                
            </div>
            {showSidebar && (
            <div onClick={()=>dispatch(setShowSidebar(false))} className="fixed md:hidden w-screen h-screen bg-black/30 top-0 left-0 z-40"></div>
            )}
        </Fragment>
    )
}