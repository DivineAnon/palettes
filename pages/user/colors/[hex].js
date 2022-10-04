import axios from "axios";
import { GetColorName } from "hex-color-to-color-name";
import { Fragment, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Footer, Header, Layout } from "../../../components";
import { GetToken, hexToCMYK, hexToHSB, hexToHSL, hexToLAB, hexToRgb, lightOrDark, useNotifColor, usePushNotif } from "../../../lib";
import { selectDetailDashboardColor, setDetailDashboardColor } from "../../../slices/dashboardSlice";
import { handleSaveColor, selectDataMenuMore, setDataExportPalette, setDataFullscreenPalette, setDataMenuMore, setDataSingleQuickView, setIdDeleteColor } from "../../../slices/popupSlice";
import { selectUser } from "../../../slices/userSlice";
import { wrapper } from "../../../store";

export default function Color(){
    const color = useSelector(selectDetailDashboardColor);
    const btnMoreRef = useRef(null);
    const dispatch = useDispatch();
    const menuMoreChildren = useSelector(selectDataMenuMore);
    const [currentFormat, setCurrentFormat] = useState('HEX');
    const btnFormat = useRef(null);
    const btnMoreColor = useRef(null);
    const copyColor = useNotifColor();
    const [copyHex, setCopyHex] = useState(false);
    const handlePushNotif = usePushNotif();
    const user = useSelector(selectUser);
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
    const handleCopyHex = (e,hex) => {
        if (!e.target.closest('.btn-view')){
            setCopyHex(true);
            copyColor(hex);
            const timeInterval = setTimeout(()=>{
                setCopyHex(false);
            },1500);
            return ()=> clearTimeout(timeInterval);
        }
    }
    const menuMore = ()=> (
        <Fragment>
            <section className="mb-2">
                <div onClick={()=>handleMenuMore('openPicker')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-wand" width={20} height={20} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <polyline points="6 21 21 6 18 3 3 18 6 21" />
                        <line x1={15} y1={6} x2={18} y2={9} />
                        <path d="M9 3a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
                        <path d="M19 13a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
                    </svg>
                    <span className="md:text-sm font-medium">Open in the picker</span>
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
                <div onClick={()=>handleMenuMore('edit')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                    <span className="md:text-sm font-medium">Edit color</span>
                </div>
                <div onClick={()=>handleMenuMore('delete')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span className="md:text-sm font-medium">Delete color</span>
                </div>
            </section>
        </Fragment>
    )
    const handleMenuMore = (menu) => {
        if (menu==='openPicker') {
            window.open(`/${color.color}`);
        }
        if (menu==='copyURL') {
            navigator.clipboard.writeText(window.location.origin+`/${color.color}`);
            handlePushNotif({ text: 'URL copied to the clipboard!', className: 'bg-black', icon: 'checklist' });
        }
        if (menu==='fullscreen') {
            dispatch(setDataFullscreenPalette([color.color],'palette'));
        }
        if (menu==='delete') {
            dispatch(setIdDeleteColor(color.id));
        }
        if (menu==='edit') {
            dispatch(handleSaveColor(user,'edit',color.color,color));
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
    const handleSingleMenu = (menu) => {
        if (menu==='copyURL'){
            navigator.clipboard.writeText(window.location.origin+`/${color.color}`);
            handlePushNotif({ text: 'URL copied to the clipboard!', className: 'bg-black', icon: 'checklist' });
        }
        if (menu==='openPicker'){
            window.open(`/${color.color}`);
        }
        if (menu==='quickView') {
            dispatch(setDataSingleQuickView(color.color));
        }
        if (menu==='fullscreen') {
            dispatch(setDataFullscreenPalette([color.color],'palette'));
        }
    }
    return (
        <Layout title={`${color.name} - Palettes`}>
            <Header/>
            <div className="pt-[60px] md:pt-[160px] pb-[60px] md:pb-[160px] px-6 sm:px-[35px] lg:px-[42px]">
                <div className="flex flex-col gap-[50px] lg:gap-0 lg:flex-row items-center justify-between">
                    <h1 className="text-5xl font-black tracking-tighter text-center">{color.name}</h1>
                    <div className="h-[46px] leading-[46px] flex">
                        <div onClick={()=>dispatch(setDataExportPalette([color.color]))} className={`flex gap-2.5 items-center pl-[14px] pr-[21px] border border-r-0 transition peer rounded-tl-[10px] rounded-bl-[10px] ${menuMoreChildren?.elementRef.id==='btnMore' ? '' : 'hover:border-gray-400 cursor-pointer'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span className="font-bold">Export color</span>
                        </div>
                        <div ref={btnMoreRef} id="btnMore" onClick={()=>dispatch(setDataMenuMore({ width: 222, elementRef: btnMoreRef.current, Children: menuMore }))} className={`flex items-center px-3 border transition rounded-br-[10px] rounded-tr-[10px] ${menuMoreChildren?.elementRef.id==='btnMore' ? 'border-gray-400 bg-gray-100' : 'peer-hover:border-l-gray-400 hover:border-gray-400 cursor-pointer'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="mt-[80px] md:mt-[100px]">
                    <div onClick={(e)=>handleCopyHex(e,getCurrentFormat(currentFormat,color.color))}  style={{ backgroundColor: `#${color.color}` }} className="h-[400px] group cursor-pointer rounded-[14px] p-[30px]">
                        <div className="flex flex-col justify-between items-center h-full">
                            <div className={`btn-view flex self-end ${lightOrDark(color.color)==='light' ? 'text-black' : 'text-white'}`}>
                                <button id="btnFormat" ref={btnFormat} onClick={()=>dispatch(setDataMenuMore({ width: 140, elementRef: btnFormat.current, Children: menuMoreFormat }))} className={`${!menuMoreChildren || menuMoreChildren?.elementRef.id==='btnMore' ? `invisible group-hover:visible ${lightOrDark(color.color)==='light' ? 'hover:bg-black/20' : 'hover:bg-white/20'}` : menuMoreChildren?.elementRef.id === 'btnFormat' ? `${lightOrDark(color.color)==='light' ? 'bg-black/20' : 'bg-white/20'}` : 'invisible' } flex items-center gap-1 h-[30px] px-[10px] rounded-lg`}>
                                    <span className="text-xs font-bold">{currentFormat}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                        <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button id="btnMoreColor" ref={btnMoreColor} onClick={()=>dispatch(setDataMenuMore({ width: 238, elementRef: btnMoreColor.current, Children: menuMoreSingle }))} className={`${!menuMoreChildren || menuMoreChildren?.elementRef.id==='btnMore' ? `invisible group-hover:visible ${lightOrDark(color.color)==='light' ? 'hover:bg-black/20' : 'hover:bg-white/20'}` : menuMoreChildren?.elementRef.id === 'btnMoreColor' ? `${lightOrDark(color.color)==='light' ? 'bg-black/20' : 'bg-white/20'}` : 'invisible' } flex items-center gap-1 h-[30px] px-[10px] rounded-lg`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                                    </svg>
                                </button>
                            </div>
                            <div className={`${lightOrDark(color.color)==='light' ? 'text-black' : 'text-white'}`}>
                                {!copyHex ? (
                                <p className={`font-medium ${!menuMoreChildren || menuMoreChildren?.elementRef.id==='btnMore' ? 'invisible group-hover:visible' : 'invisible'}`}>Click to copy</p>
                                ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-scale-check" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                )}
                            </div>
                            <h1 className={`${lightOrDark(color.color)==='light' ? 'text-black' : 'text-white'} text-[22px] font-medium`}>{getCurrentFormat(currentFormat,color.color)}</h1>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </Layout>
    )
}


export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const { hex } = ctx.query;
    try {
        const color = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/saves-colors/detail/${hex}`,{
            headers: {
                Authorization: `bearer ${GetToken(ctx)}`
            }
        })
        store.dispatch(setDetailDashboardColor(color.data));
    } catch (error) {
        return { notFound: true }
    }
})