import { colorsGroup, copyColor, handlePushNotif, lightOrDark, useIsSm } from "../lib";
import { Fragment, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { handleSavePalette, setDataExportPalette, setDataFullscreenPalette, setDataMenuMore, setDataQuickView } from "../slices/popupSlice";
import { selectCopyPaletteIndex, setCopyPaletteIndex } from "../slices/globalSlice";
import { handleAddQuery } from "../slices/palettesSlice";

export default function Palette({ data }){
    const copyPaletteIndex = useSelector(selectCopyPaletteIndex);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const refMore = useRef(null);
    const isSm = useIsSm();
    const handleMenuMore = (menu) => {
        if (menu==='openPalette') {
            window.open(`/palette/${data.palette.join('-')}`);
        }
        if (menu==='openGenerator') {
            window.open(`/${data.palette.join('-')}`);
        }
        if (menu==='quickView') {
            dispatch(setDataQuickView(data.palette));
        }
        if (menu==='copyURL') {
            navigator.clipboard.writeText(window.location.origin+`/palette/${data.palette.join('-')}`);
            handlePushNotif({ text: 'URL copied to the clipboard!', className: 'bg-black', icon: 'checklist' })
        }
        if (menu==='exportPalette'){
            dispatch(setDataExportPalette(data.palette));
        }
        if (menu==='exploreSimillar') {
            const [color] = colorsGroup.filter(q=>q.value===(data.colorGroup));
            dispatch(handleAddQuery({ type: 'colors', data: color, replace: true }));
        }
        if (menu==='fullscreen') {
            dispatch(setDataFullscreenPalette(data.palette,'palette'));
        }
    }
    const menuMore = ()=> (
        <Fragment>
            <section className="mb-2">
                <div onClick={()=>handleMenuMore('openPalette')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="md:text-sm font-medium">Open palette</span>
                </div>
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
                <div onClick={()=>handleMenuMore('exploreSimillar')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <span className="md:text-sm font-medium">Explore simillar</span>
                </div>
            </section>
            <section className="pt-2 mb-2">
                <div onClick={()=>handleMenuMore('quickView')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="md:text-sm font-medium">Quick View</span>
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
                <div onClick={()=>handleMenuMore('exportPalette')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="md:text-sm font-medium">Export Palette</span>
                </div>
                <div onClick={()=>dispatch(handleSavePalette(user,data.palette,'save','list'))} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="md:text-sm font-medium">Save Palette</span>
                </div>
            </section>
        </Fragment>
    )
    const handleCopyColor = (color,index) => {
        if (!isSm) {
            copyColor(color);
            dispatch(setCopyPaletteIndex(index));
        }
    }
    const handleShowQuickView = () => {
        if (isSm) {
            dispatch(setDataQuickView(data.palette));
        }
    }
    return (
        <div className='flex flex-col gap-1.5'>
            <div onClick={handleShowQuickView} className='h-[104px] lg:h-[124px] flex rounded-xl overflow-hidden border border-gray-100 palette-card'>
                {data.palette.map((color,i)=>(
                <div onMouseLeave={()=>!isSm && dispatch(setCopyPaletteIndex(null))} key={i} onClick={()=>handleCopyColor(color,i)} style={{ backgroundColor: `#${color}` }} className='cursor-pointer transition-all flex-1 sm:hover:basis-20 relative group'>
                    <span className={`absolute opacity-0 sm:group-hover:opacity-100 transition left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-semibold uppercase text-[15px] ${lightOrDark(color)==='light' ? 'text-black' : 'text-white'}`}>{copyPaletteIndex===i ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-scale-check" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    ) : color}</span>
                </div>
                ))}
            </div>
            <div className='flex gap-2 items-center justify-end px-2'>
                <div onClick={()=>dispatch(handleSavePalette(user,data.palette,'save','list'))} className='flex items-center gap-0.5 text-[#7d7c83] hover:text-black transition cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className='text-sm font-medium'>{data.saveCount}</span>
                </div>
                <div className='relative'>
                    <svg ref={refMore} xmlns="http://www.w3.org/2000/svg" onClick={()=>dispatch(setDataMenuMore({ elementRef: refMore.current, width: 222, Children: menuMore }))} className="h-5 w-5 text-[#7d7c83] hover:text-black transition cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}