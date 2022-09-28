import { useRef, useState } from "react";
import ContainerPopup from "./ContainerPopup";
import { GetColorName } from "hex-color-to-color-name";
import { lightOrDark, hexToRgb, hexToHSL, hexToCMYK, hexToHSB, hexToLAB, usePushNotif,  } from "../lib";
import { useDispatch, useSelector } from "react-redux";
import { closePopupSingleQuickView, selectDataMenuMore, selectDataSingleQuickView, setDataExportPaletteAsImg, setDataFullscreenPalette, setDataMenuMore } from "../slices/popupSlice";

export default function SingleQuickView(){
    const quickViewRef = useRef(null);
    const { palettes: activeColor } = useSelector(selectDataSingleQuickView);
    const dispatch = useDispatch();
    const showMenuMore = useSelector(selectDataMenuMore);
    const [copy, setCopy] = useState([]);
    const btnMoreRef = useRef(null);
    const handlePushNotif = usePushNotif();
    const removeBox = (time) => {
        quickViewRef.current.classList.remove('sm:animate-fadeIn');
        quickViewRef.current.classList.remove('animate-translateY');
        quickViewRef.current.classList.add('sm:animate-fadeOut');
        quickViewRef.current.classList.add('animate-translateY-reverse');
        const timeout = setTimeout(()=>{
            dispatch(closePopupSingleQuickView());
        },time)
        return ()=> clearTimeout(timeout);
    }
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopy(copy=>[...copy,text]);
    }
    const handleShowMenuMore = (menu) => {
        if (menu==='openPicker') {
            window.open(`/${activeColor}`);
            removeBox(50);
        }
        if (menu==='copyURL') {
            navigator.clipboard.writeText(window.location.origin+`/${activeColor}`);
            handlePushNotif({ text: 'URL copied to the clipboard!', className: 'bg-black', icon: 'checklist' });
        }
        if (menu==='fullscreen') {
            dispatch(setDataFullscreenPalette([activeColor],'palette'));
        }
        if (menu==='exportAsIMG') {
            dispatch(setDataExportPaletteAsImg([activeColor],'singleQuick'));
            removeBox(50)
        }
    }
    const menuMore = ()=> (
        <section>
            <div onClick={()=>handleShowMenuMore('openPicker')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eyedropper" viewBox="0 0 16 16">
                    <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"/>
                </svg>
                <span className="md:text-sm font-medium whitespace-nowrap">Open in the Color Picker</span>
            </div>
            <div onClick={()=>handleShowMenuMore('copyURL')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="md:text-sm font-medium">Copy URL</span>
            </div>
            <div onClick={()=>handleShowMenuMore('fullscreen')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrows-diagonal" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <polyline points="16 4 20 4 20 8"></polyline>
                    <line x1="14" y1="10" x2="20" y2="4"></line>
                    <polyline points="8 20 4 20 4 16"></polyline>
                    <line x1="4" y1="20" x2="10" y2="14"></line>
                </svg>
                <span className="md:text-sm font-medium">View fullscreen</span>
            </div>
            <div onClick={()=>handleShowMenuMore('exportAsIMG')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="md:text-sm font-medium">Export as image</span>
            </div>
        </section>
    )
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={quickViewRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[468px] h-screen sm:h-[500px] sm:relative absolute bottom-0 sm:rounded-xl flex flex-col">
                <div className="flex justify-between items-center p-2">
                    <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 hover:bg-gray-100 transition cursor-pointer p-1.5 rounded-lg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="font-semibold">Quick View</h1>
                    <div className="relative">
                        <svg ref={btnMoreRef} onClick={()=>dispatch(setDataMenuMore({ width: 222, elementRef: btnMoreRef.current, Children: menuMore }))} xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition cursor-pointer p-1.5 rounded-lg ${showMenuMore?.elementRef===btnMoreRef.current ? 'bg-gray-100' : 'hover:bg-gray-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                    </div>
                </div>
                <div style={{ backgroundColor: `#${activeColor}` }} className="flex-1 p-2 overflow-auto hide-scrollbar sm:rounded-bl-xl sm:rounded-br-xl">
                    <div onMouseLeave={()=>setCopy(copy=>copy.filter(val=>val!==activeColor.toUpperCase()))} onClick={()=>handleCopy(activeColor.toUpperCase())} className="cursor-pointer hover:bg-black/5 px-4 py-3 rounded-lg flex items-center justify-between group">
                        <section>
                            <p className={`text-xs font-semibold ${lightOrDark(activeColor)==='light' ? 'text-black/40' : 'text-white/40'}`}>HEX</p>
                            <h1 className={`font-medium text-[15px] ${lightOrDark(activeColor)==='light' ? 'text-black' : 'text-white'}`}>{activeColor.toUpperCase()}</h1>
                        </section>
                        <span className={`font-semibold group-hover:block hidden text-[15px] ${lightOrDark(activeColor)==='light' ? 'text-black/40' : 'text-white/40'}`}>{copy.includes(activeColor.toUpperCase()) ? 'Copied!' : 'Copy'}</span>
                    </div>
                    <div onMouseLeave={()=>setCopy(copy=>copy.filter(val=>val!==hexToHSB(activeColor).join(', ')))} onClick={()=>handleCopy(hexToHSB(activeColor).join(', '))} className="cursor-pointer hover:bg-black/5 px-4 py-3 rounded-lg flex items-center justify-between group">
                        <section>
                            <p className={`text-xs font-semibold ${lightOrDark(activeColor)==='light' ? 'text-black/40' : 'text-white/40'}`}>HSB</p>
                            <h1 className={`font-medium text-[15px] ${lightOrDark(activeColor)==='light' ? 'text-black' : 'text-white'}`}>{hexToHSB(activeColor).join(', ')}</h1>
                        </section>
                        <span className={`font-semibold group-hover:block hidden text-[15px] ${lightOrDark(activeColor)==='light' ? 'text-black/40' : 'text-white/40'}`}>{copy.includes(hexToHSB(activeColor).join(', ')) ? 'Copied!' : 'Copy'}</span>
                    </div>
                    <div onMouseLeave={()=>setCopy(copy=>copy.filter(val=>val!==hexToHSL(activeColor).join(', ')))} onClick={()=>handleCopy(hexToHSL(activeColor).join(', '))} className="cursor-pointer hover:bg-black/5 px-4 py-3 rounded-lg flex items-center justify-between group">
                        <section>
                            <p className={`text-xs font-semibold ${lightOrDark(activeColor)==='light' ? 'text-black/40' : 'text-white/40'}`}>HSL</p>
                            <h1 className={`font-medium text-[15px] ${lightOrDark(activeColor)==='light' ? 'text-black' : 'text-white'}`}>{hexToHSL(activeColor).join(', ')}</h1>
                        </section>
                        <span className={`font-semibold group-hover:block hidden text-[15px] ${lightOrDark(activeColor)==='light' ? 'text-black/40' : 'text-white/40'}`}>{copy.includes(hexToHSL(activeColor).join(', ')) ? 'Copied!' : 'Copy'}</span>
                    </div>
                    <div onMouseLeave={()=>setCopy(copy=>copy.filter(val=>val!==hexToRgb(activeColor).join(', ')))} onClick={()=>handleCopy(hexToRgb(activeColor).join(', '))} className="cursor-pointer hover:bg-black/5 px-4 py-3 rounded-lg flex items-center justify-between group">
                        <section>
                            <p className={`text-xs font-semibold ${lightOrDark(activeColor)==='light' ? 'text-black/40' : 'text-white/40'}`}>RGB</p>
                            <h1 className={`font-medium text-[15px] ${lightOrDark(activeColor)==='light' ? 'text-black' : 'text-white'}`}>{hexToRgb(activeColor).join(', ')}</h1>
                        </section>
                        <span className={`font-semibold group-hover:block hidden text-[15px] ${lightOrDark(activeColor)==='light' ? 'text-black/40' : 'text-white/40'}`}>{copy.includes(hexToRgb(activeColor).join(', ')) ? 'Copied!' : 'Copy'}</span>
                    </div>
                    <div onMouseLeave={()=>setCopy(copy=>copy.filter(val=>val!==hexToCMYK(activeColor).join(', ')))} onClick={()=>handleCopy(hexToCMYK(activeColor).join(', '))} className="cursor-pointer hover:bg-black/5 px-4 py-3 rounded-lg flex items-center justify-between group">
                        <section>
                            <p className={`text-xs font-semibold ${lightOrDark(activeColor)==='light' ? 'text-black/40' : 'text-white/40'}`}>CMYK</p>
                            <h1 className={`font-medium text-[15px] ${lightOrDark(activeColor)==='light' ? 'text-black' : 'text-white'}`}>{hexToCMYK(activeColor).join(', ')}</h1>
                        </section>
                        <span className={`font-semibold group-hover:block hidden text-[15px] ${lightOrDark(activeColor)==='light' ? 'text-black/40' : 'text-white/40'}`}>{copy.includes(hexToCMYK(activeColor).join(', ')) ? 'Copied!' : 'Copy'}</span>
                    </div>
                    <div onMouseLeave={()=>setCopy(copy=>copy.filter(val=>val!==hexToLAB(activeColor).join(', ')))} onClick={()=>handleCopy(hexToLAB(activeColor).join(', '))} className="cursor-pointer hover:bg-black/5 px-4 py-3 rounded-lg flex items-center justify-between group">
                        <section>
                            <p className={`text-xs font-semibold ${lightOrDark(activeColor)==='light' ? 'text-black/40' : 'text-white/40'}`}>LAB</p>
                            <h1 className={`font-medium text-[15px] ${lightOrDark(activeColor)==='light' ? 'text-black' : 'text-white'}`}>{hexToLAB(activeColor).join(', ')}</h1>
                        </section>
                        <span className={`font-semibold group-hover:block hidden text-[15px] ${lightOrDark(activeColor)==='light' ? 'text-black/40' : 'text-white/40'}`}>{copy.includes(hexToLAB(activeColor).join(', ')) ? 'Copied!' : 'Copy'}</span>
                    </div>
                    <div onMouseLeave={()=>setCopy(copy=>copy.filter(val=>val!==GetColorName(activeColor)))} onClick={()=>handleCopy(GetColorName(activeColor))} className="cursor-pointer hover:bg-black/5 px-4 py-3 rounded-lg flex items-center justify-between group">
                        <section>
                            <p className={`text-xs font-semibold ${lightOrDark(activeColor)==='light' ? 'text-black/40' : 'text-white/40'}`}>NAME</p>
                            <h1 className={`font-medium text-[15px] ${lightOrDark(activeColor)==='light' ? 'text-black' : 'text-white'}`}>~ {GetColorName(activeColor)}</h1>
                        </section>
                        <span className={`font-semibold group-hover:block hidden text-[15px] ${lightOrDark(activeColor)==='light' ? 'text-black/40' : 'text-white/40'}`}>{copy.includes(GetColorName(activeColor)) ? 'Copied!' : 'Copy'}</span>
                    </div>
                </div>
            </div>
        </ContainerPopup>
    )
}