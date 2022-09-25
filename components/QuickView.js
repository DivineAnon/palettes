import { Fragment, useRef, useState } from "react";
import ContainerPopup from "./ContainerPopup";
import { GetColorName } from "hex-color-to-color-name";
import Router from "next/router";
import { hexToCMYK, hexToHSB, hexToHSL, hexToLAB, hexToRgb, lightOrDark } from "../lib";
import { useDispatch, useSelector } from "react-redux";
import { closePopupQuickView, selectDataMenuMore, selectDataQuickView, setDataExportPalette, setDataMenuMore, setDataPopupLuminance, setDataPopupViewGradient } from "../slices/popupSlice";

export default function QuickView(){
    const quickViewRef = useRef(null);
    const dispatch = useDispatch();
    const { palettes } = useSelector(selectDataQuickView);
    const showMenuMore = useSelector(selectDataMenuMore);
    const [copy, setCopy] = useState([]);
    const [activeColor, setActiveColor] = useState(palettes[0]);
    const btnMoreRef = useRef(null);
    const removeBox = (time) => {
        quickViewRef.current.classList.remove('sm:animate-fadeIn');
        quickViewRef.current.classList.remove('animate-translateY');
        quickViewRef.current.classList.add('sm:animate-fadeOut');
        quickViewRef.current.classList.add('animate-translateY-reverse');
        setTimeout(()=>{
            dispatch(closePopupQuickView());
        },time)
    }
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopy(copy=>[...copy,text]);
    }
    const handleShowMenuMore = (menu) => {
        removeBox(50);
        if (menu==='openPalette') {
            window.open(`/palette/${palettes.join('-')}`);
        }
        if (menu==='gradient') {
            dispatch(setDataPopupViewGradient(palettes));
        }
        if (menu==='openGenerator') {
            Router.push(`/${palettes.join('-')}`);
        }
        if (menu==='export') {
            dispatch(setDataExportPalette(palettes));
        }
        if (menu==='luminance') {
            dispatch(setDataPopupLuminance(palettes));
        }
    }
    const menuMore = ()=> (
        <Fragment>
            <section className="mb-2">
                <div onClick={()=>handleShowMenuMore('openPalette')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="md:text-sm font-medium">Open palette</span>
                </div>
                <div onClick={()=>handleShowMenuMore('openGenerator')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
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
                <div onClick={()=>handleShowMenuMore('export')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="md:text-sm font-medium">Export palette</span>
                </div>
            </section>
            <section className="pt-2">
                <div onClick={()=>handleShowMenuMore('luminance')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-shadow"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <circle cx={12} cy={12} r={9} />
                        <path d="M13 12h5" />
                        <path d="M13 15h4" />
                        <path d="M13 18h1" />
                        <path d="M13 9h4" />
                        <path d="M13 6h1" />
                    </svg>
                    <span className="md:text-sm font-medium">View luminance map</span>
                </div>
                <div onClick={()=>handleShowMenuMore('gradient')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                    <span className="md:text-sm font-medium">View as gradient</span>
                </div>
            </section>
        </Fragment>
    )
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={quickViewRef} className="animate-translateY sm:animate-fadeIn bg-white h-full w-full sm:w-[468px] sm:h-[500px] sm:relative absolute bottom-0 sm:rounded-xl flex flex-col">
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
                <div style={{ backgroundColor: `#${activeColor}` }} className="flex-1 p-2 overflow-auto hide-scrollbar">
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
                <div className="p-5">
                    <div className="flex h-[46px] rounded-xl overflow-hidden">
                        {palettes.map((palette,i)=>(
                        <div key={i} onClick={()=>setActiveColor(palette)} style={{ backgroundColor: `#${palette}` }} className="flex-1 flex items-center justify-center cursor-pointer group">
                            {activeColor===palette ? (
                                <div className={`w-2 h-2 rounded-full ${lightOrDark(palette)==='light' ? 'bg-black' : 'bg-white'}`}></div>
                            ) : (
                                <div className={`w-2 h-2 rounded-full hidden group-hover:block ${lightOrDark(palette)==='light' ? 'bg-black/20' : 'bg-white/20'}`}></div>
                            )}
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </ContainerPopup>
    )
}