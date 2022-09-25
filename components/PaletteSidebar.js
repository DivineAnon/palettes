import { Fragment } from "react";
import { useRef } from "react";
import { colorsGroup, handlePushNotif } from "../lib";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { handleSavePalette, selectDataMenuMore, setDataExportPalette, setDataFullscreenPalette, setDataMenuMore, setDataQuickView, setIdDeletePalette } from "../slices/popupSlice";
import { handleAddQuery } from "../slices/palettesSlice";

export default function PaletteSidebar({ data, saves }){
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const showMenuMore = useSelector(selectDataMenuMore);
    const refMore = useRef(null);
    const handleMenuMore = (menu) => {
        if (menu==='openPalette') {
            window.open(`/palette/${saves ? data.palette.palette.join('-') : data.palette.join('-')}`);
        }
        if (menu==='openGenerator') {
            window.open(`/${saves ? data.palette.palette.join('-') : data.palette.join('-')}`);
        }
        if (menu==='quickView') {
            dispatch(setDataQuickView(saves ? data.palette.palette : data.palette));
        }
        if (menu==='copyURL') {
            navigator.clipboard.writeText(window.location.origin+`/palette/${saves ? data.palette.palette.join('-') : data.palette.join('-')}`);
            handlePushNotif({ text: 'URL copied to the clipboard!', icon: 'checklist', className: 'bg-black' });
        }
        if (menu==='exportPalette'){
            dispatch(setDataExportPalette(saves ? data.palette.palette : data.palette));
        }
        if (menu==='exploreSimillar') {
            const [color] = colorsGroup.filter(q=>q.value===(saves ? data.palette.colorGroup : data.colorGroup));
            dispatch(handleAddQuery({ type: 'colors', data: color, replace: true }));
        }
        if (menu==='duplicate') {
            dispatch(handleSavePalette(user,data.palette.palette,'duplicate',null,data));
        }
        if (menu==='edit') {
            dispatch(handleSavePalette(user,data.palette.palette,'edit',null,data));
        }
        if (menu==='delete') {
            dispatch(setIdDeletePalette(data.id));
        }
        if (menu==='fullscreen') {
            dispatch(setDataFullscreenPalette(saves ? data.palette.palette : data.palette,'palette'));
        }
    }
    const MenuMore = ()=> (
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
                {saves ? (
                <Fragment>
                    <div onClick={()=>handleMenuMore('duplicate')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="md:text-sm font-medium">Duplicate Palette</span>
                    </div>
                    <div onClick={()=>handleMenuMore('edit')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span className="md:text-sm font-medium">Edit Palette</span>
                    </div>
                    <div onClick={()=>handleMenuMore('delete')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="md:text-sm font-medium">Delete Palette</span>
                    </div>
                </Fragment>
                ) : (
                <div onClick={()=>dispatch(handleSavePalette(user,data.palette,'save','sidebarExplore'))} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="md:text-sm font-medium">Save Palette</span>
                </div>
                )}
            </section>
        </Fragment>
    )
    return (
        <div className="cursor-pointer group left-0">
            <div onClick={()=>handleMenuMore('quickView')} className="h-[34px] flex rounded-md overflow-hidden">
                {(saves ? data.palette.palette : data.palette).map((color,i)=>(
                <div key={i} style={{ backgroundColor: `#${color}` }} className="flex-1"></div>
                ))}
            </div>
            <div className="px-1 mt-0.5 flex justify-between items-center">
                <span className="text-[10px] font-medium">{saves ? data.name : `${data.saveCount} Saves`}</span>
                <div className="relative">
                    <svg ref={refMore} onClick={()=>dispatch(setDataMenuMore({ elementRef: refMore.current, width: 222, Children: MenuMore }))} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${showMenuMore?.elementRef!==refMore?.current && 'invisible group-hover:visible'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}