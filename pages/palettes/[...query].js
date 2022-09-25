import axios from 'axios';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Header, Layout, Palette, Sidebar, Spinner } from '../../components';
import { colorsGroup, getTitleFeed, stylesPalette, useIsMd } from '../../lib';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import chroma from 'chroma-js';
import { useDispatch, useSelector } from 'react-redux';
import { handleAddQuery, selectPalettes, selectPalettesPage, selectQueryList, setPalettes, setQueryList } from '../../slices/palettesSlice';
import { selectShowSidebar, setShowSidebar } from '../../slices/globalSlice';

const avaliableSort = ['Trending','Latest','Popular'];

export default function Trending({ dataPalettes, dataQuery }){
    const queryList = useSelector(selectQueryList);
    const isMd = useIsMd();
    const palettes = useSelector(selectPalettes);
    const palettesPage = useSelector(selectPalettesPage);
    const showSidebar = useSelector(selectShowSidebar);
    const dispatch = useDispatch();
    const [showSearch, setShowSearch] = useState(false);
    const [loadingFetchQuery, setLoadingFetchQuery] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const isMounted = useRef(false);
    const isMountedSecond = useRef(false);
    const searchBox = useRef(null);
    const [searchHeight, setSearchHeight] = useState(128);
    const Router = useRouter();
    const getQuery = (queryList,page) => {
        const query = [`page=${page}`,`sort=${queryList.sort.toLowerCase()}`];
        const colors = queryList.query.filter(q=>q.type==='colors').map(q=>q.value.toLowerCase());
        const styles = queryList.query.filter(q=>q.type==='styles').map(q=>q.value.toLowerCase());
        const search = queryList.query.filter(q=>q.type==='search').map(q=>q.value.toLowerCase());
        const findStyles = stylesPalette.filter(q=>styles.includes(q.value.toLowerCase())).map(q=>q.value.toLowerCase());
        if (colors.length>0) {
            query.push(`colors=${colors.join(',')}`);
        }
        if (findStyles.length>0) {
            query.push(`styles=${findStyles.join(',')}`);
        }
        if (search.length>0) {
            query.push(`search=${search.join('-')}`);
        }
        return query.join('&');
    }
    const loadData = async () => {
        setLoadingMore(true);
        const updateData = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/palettes/feed?${getQuery(queryList,parseInt(palettesPage)+1)}`);
        dispatch(setPalettes({ data: [...palettes.data, ...updateData.data.data], meta: updateData.data.meta }));
        setLoadingMore(false);
    }
    const handleRemoveQuery = (query) => {
        dispatch(setQueryList({ ...queryList, query: queryList.query.filter(data=>data.value!==query.value) }));
    }
    const handleSearch = (e) => {
        e.preventDefault();
        const input = e.target[0];
        if (colorsGroup.concat(stylesPalette).map(q=>q.value.toLowerCase()).includes(input.value.toLowerCase())) {
            const [find] = colorsGroup.concat(stylesPalette).filter(q=>q.value.toLowerCase()===input.value.toLowerCase());
            if (colorsGroup.map(q=>q.value).includes(find.value)) {
                dispatch(handleAddQuery({ type: 'colors', data: find }));
            }else {
                dispatch(handleAddQuery({ type: 'styles', data: find }));
            }
        }else if (avaliableSort.map(q=>q.toLowerCase()).includes(input.value.toLowerCase())){
            const [find] = avaliableSort.filter(q=>q.toLowerCase()===input.value.toLowerCase());
            dispatch(handleAddQuery({ type: 'sort', value: find }));
        }else if (chroma.valid(input.value)){
            const hex = chroma(chroma(input.value).rgb()).hex();
            dispatch(handleAddQuery({ type: 'search', data: { value: hex.slice(1), hex } }));
        }else {
            dispatch(handleAddQuery({ type: 'search', data: { value: input.value } }));
        }
        input.value = '';
    }
    const fetcNewPalettes = async () => {
        setLoadingFetchQuery(true);
        const newPalettes = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/palettes/feed?${getQuery(queryList,1)}`);
        dispatch(setPalettes(newPalettes.data));
        setLoadingFetchQuery(false);
    }
    useEffect(()=>{
        if (isMounted.current) {
            window.history.pushState('','',queryList.query.length > 0 ? `/palettes/${queryList.sort.toLowerCase()}/${queryList.query.map(query=>query.value).map(query=>query.toLowerCase()).join(',')}` : `/palettes/${queryList.sort.toLowerCase()}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[palettes])
    useEffect(()=>{
        if (isMounted.current) {
            if (isMountedSecond.current) {
                fetcNewPalettes();
            }else {
                isMountedSecond.current = true;
            }
        }else {
            isMounted.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[queryList])
    useEffect(()=>{
        if (showSearch) {
            const clickEvent = (e) => {
                if (!e.target.closest('#searchInput') && !e.target.closest('#searchBox')) {
                    setShowSearch(false);
                }
            }
            window.addEventListener('click',clickEvent);
            return () => window.removeEventListener('click',clickEvent);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[showSearch])
    useEffect(()=>{
        if (searchHeight!==searchBox?.current?.getBoundingClientRect().height+60) {
            setSearchHeight(searchBox?.current?.getBoundingClientRect().height+60);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchBox?.current?.getBoundingClientRect().height])
    useLayoutEffect(()=>{
        dispatch(setPalettes(dataPalettes));
        dispatch(setQueryList(dataQuery));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <Layout title={getTitleFeed(queryList,Router.query.query,isMounted)}>
            <Header isFixed={true}/>
            <div ref={searchBox} className='sticky z-10 bg-white w-full left-0 top-[60px] px-5 py-2.5 border-b'>
                <div className='flex gap-5 items-center p-1'>
                    {queryList.query.length===0 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    )}
                    <form method='post' onSubmit={handleSearch} id='searchInput' className='flex flex-1 items-center flex-wrap gap-2'>
                        {queryList.query.map((query,i)=>(
                        <div key={i} onClick={()=>handleRemoveQuery(query)} className='flex gap-2 items-center bg-[#F2F2F3] hover:bg-[#EDEDEE] 
                        transition rounded-lg cursor-pointer h-[36px] px-4 group'>
                            {query.hex ? (
                            <div className='flex gap-2 items-center'>
                                <div style={{ backgroundColor: query.hex }} className='w-3 h-3 rounded-full'></div>
                                <p className='text-[13px] font-medium'>{query.value}</p>
                            </div>
                            ) : (
                            <p className='text-[13px] font-medium'>{query.value}</p>
                            )}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-gray-500 group-hover:text-black transition">
                                <path fillRule="evenodd" d="M3.97 3.97a.75.75 0 011.06 0L12 10.94l6.97-6.97a.75.75 0 111.06 1.06L13.06 12l6.97 6.97a.75.75 0 11-1.06 1.06L12 13.06l-6.97 6.97a.75.75 0 01-1.06-1.06L10.94 12 3.97 5.03a.75.75 0 010-1.06z" clipRule="evenodd" />
                            </svg>
                        </div>
                        ))}
                        <input onFocus={()=>setShowSearch(true)} type="text" className={`flex-1 outline-none text-sm font-medium h-[39px] ${queryList.query.length>0 && 'pl-2'}`} placeholder={`${queryList.query.length>0 ? 'Add tag' : 'Search with colors, topics, styles, or hex values...'}`}/>
                    </form>
                    <svg onClick={()=>dispatch(setShowSidebar(!showSidebar))} xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 hover:text-blue-500 transition-all duration-300 cursor-pointer ${showSidebar && 'rotate-90 text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </div>
                {showSearch && (
                <div id='searchBox' className='absolute mt-[1px] top-full overflow-auto shadow-md left-0 w-full max-h-[calc(100vh-128px)] bg-white flex flex-col lg:flex-row lg:justify-between p-5 z-50'>
                    <section className='p-5 flex-1'>
                        <h1 className='font-semibold mb-4'>Colors</h1>
                        <div className='flex gap-2 flex-wrap'>
                            {colorsGroup.map((color,i)=>(
                            <div key={i} onClick={()=>dispatch(handleAddQuery({ type: 'colors', data: color }))} className={`flex gap-2 items-center border transition rounded-lg cursor-pointer h-[36px] px-4 ${queryList['query'].filter(data=>data.type==='colors').map(data=>data.value).includes(color.value) ? 'border-blue-400 text-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                                <div style={{ backgroundColor: color.hex }} className={`w-3 h-3 rounded-full ${color.value==='White' && 'border'}`}></div>
                                <p className='text-[13px] font-medium'>{color.value}</p>
                            </div>
                            ))}
                        </div>
                    </section>
                    <section className='p-5 flex-1'>
                        <h1 className='font-semibold mb-4'>Styles</h1>
                        <div className='flex gap-2 flex-wrap'>
                            {stylesPalette.map((style,i)=>(
                            <div key={i} onClick={()=>dispatch(handleAddQuery({ type: 'styles', data: style }))} className={`flex gap-2 items-center border transition rounded-lg cursor-pointer h-[36px] px-4 ${queryList['query'].filter(data=>data.type==='styles').map(data=>data.value).includes(style.value) ? 'border-blue-400 text-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                                <p className='text-[13px] font-medium'>{style.value}</p>
                            </div>
                            ))}
                        </div>
                    </section>
                    <section className='p-5 flex-1'>
                        <h1 className='font-semibold mb-4'>Order</h1>
                        <div className='flex gap-2 flex-wrap'>
                            {avaliableSort.map((value,i)=>(
                            <div key={i} onClick={()=>dispatch(handleAddQuery({ type: 'sort', value }))} className={`flex gap-2 items-center border transition rounded-lg cursor-pointer h-[36px] px-4 ${queryList['sort']===value ? 'border-blue-400 text-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                                <p className='text-[13px] font-medium'>{value}</p>
                            </div>
                            ))}
                        </div>
                    </section>
                </div>
                )}
            </div>
            <Sidebar showSearch={showSearch} style={{ top: !isMd ? searchHeight : 0, height: !isMd ? `calc(100vh - ${searchHeight}px)` : '100vh' }}/>
            <div className={`transition-[width] duration-300 ${(showSidebar && !isMd) ? 'w-[calc(100%-300px)]' : 'w-full'} ${(queryList.query.length>1 || queryList.query[0]?.type==='search') ? palettes.data.length>0 ? 'pt-6 md:pt-9 lg:pt-[42px] mb-[60px] md:mb-[100px]' : '' : palettes.data.length>0 ? 'my-[60px] md:my-[100px]' : ''}`}>
                {loadingFetchQuery && (
                <div className='fixed w-screen h-screen flex items-center justify-center top-0 left-0 z-10 bg-white/60'>
                    <Spinner w={11} h={11}/>
                </div>
                )}
                {queryList.query.length < 2 && queryList.query[0]?.type!=='search' && (
                <section className={palettes.data.length===0 ? 'hidden' : ''}>
                    <h1 className='text-center px-3 font-black text-[3.125rem] tracking-tighter'>{queryList.query.length>0 ? queryList.query[0].value : queryList.sort} Color Palettes</h1>
                    <div className='max-w-[400px] text-center mx-auto leading-8 text-xl mt-7 text-[#7d7c83] mb-[60px] md:mb-[100px]'>{queryList.query.length > 0 ? `Get inspired by these beautiful ${queryList.query[0].value.toLowerCase()} color schemes and make something cool!` : 'Get inspired by thousands of beautiful color schemes and make something cool!'}</div>
                </section>
                )}
                {palettes.data.length > 0 ? (
                <InfiniteScroll
                    dataLength={palettes.data.length}
                    hasMore={true}
                    next={loadData}
                    style={{ overflow: 'visible' }}
                >
                    <div className={`grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-x-8 gap-y-3 md:gap-y-5 px-6 md:px-9 lg:px-10 ${queryList.query.length > 0 && 'pt-6 md:pt-0'}`}>
                        {palettes.data.map((palette,i)=>(
                        <Palette key={palette.id} index={i} data={palette}/>
                        ))}
                    </div>
                </InfiniteScroll>
                ) : (
                <div style={{ height: `calc(100vh - ${searchHeight}px)` }} className='flex flex-col items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                    </svg>
                    <h1 className='mt-10 font-medium text-[1.3125rem]'>No palettes found</h1>
                    <p className='text-[#7d7c83] mt-5'>It seems we {"cant't"} find any results based on your search.</p>
                </div>
                )}
            </div>
            {loadingMore && (
            <div className='mb-[100px]'>
                <Spinner w={11} h={11}/>
            </div>
            )}
        </Layout>
    )
}

export async function getServerSideProps(ctx){
    const { query } = ctx.query;
    if (query.length>2) {
        return { notFound: true }
    }
    const [sort,queryList] = query;
    if (!avaliableSort.map(sort=>sort.toLocaleLowerCase()).includes(sort)) {
        return { notFound: true }
    }
    const getFetchQuery = (queryList) => {
        const query = ['page=1',`sort=${sort}`];
        if (queryList) {
            const colors = queryList.split(',').filter(q=>colorsGroup.map(color=>color.value.toLowerCase()).includes(q));
            const styles = queryList.split(',').filter(q=>stylesPalette.map(style=>style.value.toLowerCase()).includes(q));
            if (colors) {
                query.push(`colors=${colors.join(',')}`);
            }
            if (styles) {
                query.push(`styles=${styles.join(',')}`);
            }
        }
        return query.join('&');
    }
    const getQueryList = (list) => {
        const query = { query: [], sort: sort.charAt(0).toUpperCase()+sort.slice(1) }
        if (list) {
            const queryList = list.split(',');
            queryList.forEach(text => {
                if (colorsGroup.map(q=>q.value.toLowerCase()).includes(text.toLowerCase())) {
                    const [color] = colorsGroup.filter(q=>q.value.toLowerCase()===text.toLowerCase());
                    query.query.push({ type: 'colors', ...color });
                }else if (stylesPalette.map(q=>q.value.toLowerCase()).includes(text.toLowerCase())) {
                    const [style] = stylesPalette.filter(q=>q.value.toLowerCase()===text.toLowerCase());
                    query.query.push({ type: 'styles', ...style });
                }else {
                    query.query.push({ type: 'search', value: text });
                }
            });
        }
        return query;
    }
    const palettes = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/palettes/feed?${getFetchQuery(queryList)}`)
    return { props: { dataPalettes: palettes.data, dataQuery: getQueryList(queryList) } }
}