import { GetColorName } from "hex-color-to-color-name";
import { useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hexToCMYK, hexToHSB, hexToHSL, hexToLAB, hexToRgb, lightOrDark, useNotifColor, usePushNotif } from "../lib";
import { selectDataMenuMore, setDataFullscreenPalette, setDataMenuMore, setDataSingleQuickView } from "../slices/popupSlice";

export default function PaletteBox({ palettes }){
    const container = useRef(null);
    const dispatch = useDispatch();
    const [width, setWidth] = useState(200);
    const [height, setHeight] = useState(200);
    const [currentFormat, setCurrentFormat] = useState('HEX');
    const showMenuMore = useSelector(selectDataMenuMore);
    const [copyHex, setCopyHex] = useState(null);
    const activeColor = useRef(null);
    const copyColor = useNotifColor();
    const handlePushNotif = usePushNotif();
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
    const handleShowSingleMenu = (id, index) => {
        activeColor.current = palettes[index];
        dispatch(setDataMenuMore({ width: 228, elementRef: document.getElementById(id), Children: menuMoreSingle }))
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
    useLayoutEffect(()=>{
        const observer = new ResizeObserver((entries) => {
            const rect = entries[0].contentRect;
            if ((rect.width/palettes.length)<220) {
                const width_ = palettes.map((val,i)=>rect.width/(i+1)).reverse().find(val=>val>=220);
                setWidth(width_);
                setHeight(200);
            }else{
                setWidth(rect.width/palettes.length);
                setHeight(400);
            }
        });
        observer.observe(container.current);
        return ()=> observer.unobserve(container.current);
    },[])
    return (
        <div ref={container} className={`mt-[60px] md:mt-[100px] mb-[130px] rounded-xl overflow-hidden flex flex-wrap`}>
            {palettes.map((hex,i)=>(
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
    )
}