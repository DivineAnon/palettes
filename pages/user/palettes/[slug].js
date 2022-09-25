import axios from "axios";
import { GetColorName } from "hex-color-to-color-name";
import { useLayoutEffect, useRef, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Footer, Header, Layout } from "../../../components";
import { copyColor, GetToken, handlePushNotif, hexToCMYK, hexToHSB, hexToHSL, hexToLAB, hexToRgb, lightOrDark } from "../../../lib";
import { selectDetailDashboardPalette, selectDetailDashboardPaletteData, setDetailDashboardPalette } from "../../../slices/dashboardSlice";
import { handleSavePalette, selectDataMenuMore, setDataExportPalette, setDataFullscreenPalette, setDataMenuMore, setDataPaletteDetail, setDataSingleQuickView, setIdDeletePalette } from "../../../slices/popupSlice";
import { selectUser } from "../../../slices/userSlice";

export default function PaletteEdit({ dataPalette }){
    const data = useSelector(selectDetailDashboardPaletteData);
    const palette = useSelector(selectDetailDashboardPalette);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const container = useRef(null);
    const [width, setWidth] = useState(200);
    const [height, setHeight] = useState(200);
    const [currentFormat, setCurrentFormat] = useState('HEX');
    const showMenuMore = useSelector(selectDataMenuMore);
    const [copyHex, setCopyHex] = useState(null);
    const activeColor = useRef(null);
    const btnMoreRef = useRef(null);
    const getCurrentFormat = (format, color) => {
        if (format==='HEX') {
            return color.toUpperCase();
        }
        if (format==='RGB') {
            return hexToRgb(color).join(', ');
        }
        if (format==='HSB') {
            return hexToHSB(color).join(', ');
        }
        if (format==='HSL') {
            return hexToHSL(color).join(', ');
        }
        if (format==='CMYK') {
            return hexToCMYK(color).join(', ');
        }
        if (format==='LAB') {
            return hexToLAB(color).join(', ');
        }
        if (format==='NAME') {
            return `~ ${GetColorName(color)}`;
        }
    }
    const handleCopyHex = (e,hex,i) => {
        if (!e.target.closest('.btn-view')){
            setCopyHex(i);
            copyColor(hex);
            const timeInterval = setTimeout(()=>{
                setCopyHex(null);
            },1500);
            return ()=> clearTimeout(timeInterval);
        }
    }
    const menuMoreFormat = () => (
        <section>
            <div onClick={()=>{setCurrentFormat('HEX')}} className="flex items-center gap-3 px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer">
                <span className="md:text-sm font-medium">HEX</span>
            </div>
            <div onClick={()=>{setCurrentFormat('RGB')}} className="flex items-center gap-3 px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer">
                <span className="md:text-sm font-medium">RGB</span>
            </div>
            <div onClick={()=>{setCurrentFormat('NAME')}} className="flex items-center gap-3 px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer">
                <span className="md:text-sm font-medium">NAME</span>
            </div>
            <div onClick={()=>{setCurrentFormat('HSB')}} className="flex items-center gap-3 px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer">
                <span className="md:text-sm font-medium">HSB</span>
            </div>
            <div onClick={()=>{setCurrentFormat('HSL')}} className="flex items-center gap-3 px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer">
                <span className="md:text-sm font-medium">HSL</span>
            </div>
            <div onClick={()=>{setCurrentFormat('CMYK')}} className="flex items-center gap-3 px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer">
                <span className="md:text-sm font-medium">CMYK</span>
            </div>
            <div onClick={()=>{setCurrentFormat('LAB')}} className="flex items-center gap-3 px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer">
                <span className="md:text-sm font-medium">LAB</span>
            </div>
        </section>
    )
    const handleShowSingleMenu = (id, index) => {
        activeColor.current = palette[index];
        dispatch(setDataMenuMore({ width: 228, elementRef: document.getElementById(id), Children: menuMoreSingle }))
    }
    const handleSingleMenu = (menu) => {
        if (menu==='copyURL'){
            navigator.clipboard.writeText(window.location.origin+`/${activeColor.current}`);
            handlePushNotif({ text: 'URL copied to the clipboard!', className: 'bg-black', icon: 'checklist' });
        }
        if (menu==='openPicker'){
            window.open(`/${activeColor.current}`);
        }
        if (menu==='quickView') {
            dispatch(setDataSingleQuickView(activeColor.current));
        }
        if (menu==='fullscreen') {
            dispatch(setDataFullscreenPalette([activeColor.current],'palette'));
        }
    }
    const menuMoreSingle = ()=> (
        <section>
            <div onClick={()=>handleSingleMenu('copyURL')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="md:text-sm font-medium">Copy URL</span>
            </div>
            <div onClick={()=>handleSingleMenu('fullscreen')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrows-diagonal" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <polyline points="16 4 20 4 20 8"></polyline>
                    <line x1="14" y1="10" x2="20" y2="4"></line>
                    <polyline points="8 20 4 20 4 16"></polyline>
                    <line x1="4" y1="20" x2="10" y2="14"></line>
                </svg>
                <span className="md:text-sm font-medium">View fullscreen</span>
            </div>
            <div onClick={()=>handleSingleMenu('quickView')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="md:text-sm font-medium">Quick View</span>
            </div>
            <div onClick={()=>handleSingleMenu('openPicker')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eyedropper" viewBox="0 0 16 16">
                    <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"/>
                </svg>
                <span className="md:text-sm font-medium">Open in the Color Picker</span>
            </div>
        </section>
    )
    const menuMorePalette = ()=> (
        <Fragment>
            <section className="mb-2">
                <div onClick={()=>handleMenuMore('openGenerator')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-wand" width={20} height={20} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <polyline points="6 21 21 6 18 3 3 18 6 21" />
                        <line x1={15} y1={6} x2={18} y2={9} />
                        <path d="M9 3a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
                        <path d="M19 13a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
                    </svg>
                    <span className="md:text-sm font-medium">Open in the generator</span>
                </div>
                <div onClick={()=>handleMenuMore('copyURL')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="md:text-sm font-medium">Copy URL</span>
                </div>
                <div onClick={()=>handleMenuMore('fullscreen')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrows-diagonal" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <polyline points="16 4 20 4 20 8"></polyline>
                        <line x1="14" y1="10" x2="20" y2="4"></line>
                        <polyline points="8 20 4 20 4 16"></polyline>
                        <line x1="4" y1="20" x2="10" y2="14"></line>
                    </svg>
                    <span className="md:text-sm font-medium">View fullscreen</span>
                </div>
            </section>
            <section className="pt-2">
                <div onClick={()=>handleMenuMore('details')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                    <span className="md:text-sm font-medium">View details</span>
                </div>
                <div onClick={()=>handleMenuMore('edit')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                    <span className="md:text-sm font-medium">Edit palette</span>
                </div>
                <div onClick={()=>handleMenuMore('delete')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span className="md:text-sm font-medium">Delete palette</span>
                </div>
            </section>
        </Fragment>
    )
    const handleMenuMore = (menu) => {
        if (menu==='openPalette') {
            window.open(`/palette/${palette.join('-')}`);
        }
        if (menu==='openGenerator') {
            window.open(`/${palette.join('-')}`);
        }
        if (menu==='copyURL') {
            navigator.clipboard.writeText(window.location.origin+`/palette/${palette.join('-')}`);
            handlePushNotif({ text: 'URL copied to the clipboard!', className: 'bg-black', icon: 'checklist' });
        }
        if (menu==='fullscreen') {
            dispatch(setDataFullscreenPalette(palette,'palette'));
        }
        if (menu==='delete') {
            dispatch(setIdDeletePalette(data.id));
        }
        if (menu==='edit') {
            dispatch(handleSavePalette(user,data.palette.palette,'edit',null,data));
        }
        if (menu==='details') {
            dispatch(setDataPaletteDetail(data));
        }
    }
    useLayoutEffect(()=>{
        if (palette) {
            const observer = new ResizeObserver((entries) => {
                const rect = entries[0].contentRect;
                if ((rect.width/palette.length)<220) {
                    const width_ = palette.map((val,i)=>rect.width/(i+1)).reverse().find(val=>val>=220);
                    setWidth(width_);
                    setHeight(200);
                }else{
                    setWidth(rect.width/palette.length);
                    setHeight(400);
                }
            });
            observer.observe(container.current);
            return ()=> observer.unobserve(container.current);
        }
    },[palette])
    useLayoutEffect(()=>{
        dispatch(setDetailDashboardPalette(dataPalette));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <Layout title={`My new palette - Palettes`}>
            <Header/>
            <div className="mt-[170px] px-6 md:px-10 max-w-screen-2xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <h1 className="text-5xl font-black tracking-tighter">{data?.name}</h1>
                    <div className="flex group">
                        <div onClick={()=>dispatch(setDataExportPalette(palette))} className="flex items-center font-semibold gap-2 border border-r-0 border-gray-300 hover:border-gray-400 transition px-4 py-2.5 rounded-tl-xl rounded-bl-xl cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span>Export palette</span>
                        </div>
                        <div className="flex-1 w-[1px] bg-gray-300 group-hover:bg-gray-400 transition"></div>
                        <div className="relative">
                            <div ref={btnMoreRef} onClick={()=>dispatch(setDataMenuMore({ width: 222, elementRef: btnMoreRef.current, Children: menuMorePalette }))} className="border relative border-l-0 border-gray-300 hover:border-gray-400 transition py-3 px-3 cursor-pointer rounded-tr-xl rounded-br-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div ref={container} className={`mt-[60px] md:mt-[100px] mb-[130px] rounded-xl overflow-hidden flex flex-wrap`}>
                    {palette?.map((hex,i)=>(
                    <div onClick={(e)=>handleCopyHex(e,getCurrentFormat(currentFormat,hex),i)} key={i} style={{ backgroundColor: `#${hex}`, width, height }} className="cursor-pointer relative group flex items-center justify-center">
                        <div className="btn-view absolute top-0 right-0 w-max p-2 flex items-center">
                            <div className="relative">
                                <button id={`btnFormatRef-${i}`} onClick={()=>dispatch(setDataMenuMore({ width: 140, elementRef: document.getElementById(`btnFormatRef-${i}`), Children: menuMoreFormat }))} className={`text-xs flex font-bold rounded-md items-center ${showMenuMore?.elementRef.id!==`btnFormatRef-${i}` ? 'group-hover:visible invisible' : lightOrDark(hex)==='light' ? 'bg-black/5' : 'bg-white/10'} gap-1 transition px-3 pr-2 py-1 ${lightOrDark(hex)==='light' ? 'hover:bg-black/5' : 'hover:bg-white/10 text-white'}`}>
                                    <span className="pointer-events-none">{currentFormat}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="relative">
                                <button id={`btnMenuMoreRef-${i}`} onClick={()=>handleShowSingleMenu(`btnMenuMoreRef-${i}`,i)} className={`px-1 py-1 rounded-md ${showMenuMore?.elementRef.id!==`btnMenuMoreRef-${i}` ? 'invisible' : lightOrDark(hex)==='light' ? 'bg-black/5' : 'bg-white/10'} ${showMenuMore?.elementRef.id!==`btnFormatRef-${i}` && 'group-hover:visible'} ${lightOrDark(hex)==='light' ? 'hover:bg-black/5' : 'hover:bg-white/10 text-white'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className={`hidden sm:block ${lightOrDark(hex)==='light' ? 'text-black' : 'text-white'}`}>
                            {copyHex!==i ? (
                            <p className={`font-bold hidden ${!showMenuMore?.elementRef && 'group-hover:block'} text-[15px]`}>Click to copy</p>
                            ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-scale-check" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            )}
                        </div>
                        <h1 className={`whitespace-nowrap absolute left-1/2 -translate-x-1/2 font-semibold bottom-10 text-xl ${lightOrDark(hex)==='light' ? 'text-black' : 'text-white'}`}>{getCurrentFormat(currentFormat,hex)}</h1>
                    </div>
                    ))}
                </div>
            </div>
            <Footer/>
        </Layout>
    )
}

export async function getServerSideProps(ctx) {
    const { slug } = ctx.query;
    try {
        const palette = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/saves-palettes/get/${slug}`,{
            headers: {
                Authorization: `bearer ${GetToken(ctx)}`
            }
        })
        return { props: { dataPalette: palette.data } }
    } catch (error) {
        return { notFound: true }
    }
}