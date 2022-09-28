import { GetColorName } from "hex-color-to-color-name";
import { useEffect, useRef, useState } from "react";
import { Header, Layout, Footer, ColorPickerRelative, Palette } from "../components";
import chroma from "chroma-js";
import { Harmonizer } from "color-harmony";
import blinder from "color-blind";
import { lightOrDark, hexToLAB, hexToRgb, hexToCMYK, hexToHSB, hexToHSL, checkContrast, useNotifColor } from "../lib";
import Link from "next/link";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPalettes, setPalettes } from "../slices/palettesSlice";
import { setDataFullscreenPalette } from "../slices/popupSlice";
import { selectCopyPaletteIndex, setCopyPaletteIndex } from "../slices/globalSlice";

export default function SingleColor({ colorProps, exampleColor }){
    const copyColor = useNotifColor();
    const dispatch = useDispatch();
    const examplePalettes = useSelector(selectPalettes);
    const [color, setColor] = useState(colorProps[0]);
    const [colorPreview, setColorPreview] = useState(colorProps[0]);
    const [colorBlinds, setColorBlinds] = useState({
        protanomaly: [colorProps[0],blinder.protanomaly(colorProps[0]).slice(1)],
        protanopia: [colorProps[0],blinder.protanopia(colorProps[0]).slice(1)],
        deuteranopia: [colorProps[0],blinder.deuteranopia(colorProps[0]).slice(1)],
        deuteranomaly: [colorProps[0],blinder.deuteranomaly(colorProps[0]).slice(1)],
        tritanopia: [colorProps[0],blinder.tritanopia(colorProps[0]).slice(1)],
        tritanomaly: [colorProps[0],blinder.tritanomaly(colorProps[0]).slice(1)],
        achromatopsia: [colorProps[0],blinder.achromatopsia(colorProps[0]).slice(1)],
        achromatomaly: [colorProps[0],blinder.achromatomaly(colorProps[0]).slice(1)],
    })
    const copyPaletteIndex = useSelector(selectCopyPaletteIndex);
    const [showPicker, setShowPicker] = useState(false);
    const isMounted = useRef(false);
    const harmonizer = new Harmonizer();
    const handleChangeColorPreview = (e) => {
        let hex = e.target.value.replace('#','');
        setColorPreview(hex);
        if (chroma.valid(hex)) {
            if (chroma(hex).hex().replace('#','').length===6) {
                setColor(chroma(hex).hex().replace('#',''));
            }
        }
    }
    const handleChangeColor = (ctx) => {
        const { hex } = ctx;
        setColor(hex.replace('#',''));
        setColorPreview(hex.replace('#',''));
    }
    useEffect(()=>{
        window.history.pushState('','',`/${color}`);
        if (isMounted.current) {
            setColorBlinds({
                protanomaly: [color,blinder.protanomaly(color).slice(1)],
                protanopia: [color,blinder.protanopia(color).slice(1)],
                deuteranopia: [color,blinder.deuteranopia(color).slice(1)],
                deuteranomaly: [color,blinder.deuteranomaly(color).slice(1)],
                tritanopia: [color,blinder.tritanopia(color).slice(1)],
                tritanomaly: [color,blinder.tritanomaly(color).slice(1)],
                achromatopsia: [color,blinder.achromatopsia(color).slice(1)],
                achromatomaly: [color,blinder.achromatomaly(color).slice(1)],
            })
        }else {
            isMounted.current = true;
        }
    },[color]);
    useEffect(()=>{
        if (isMounted.current) {
            setColor(colorProps[0]);
        }
    },[colorProps])
    useLayoutEffect(()=>{
        if (colorProps.length===1) {
            dispatch(setPalettes({ data: exampleColor, meta: { pagination: { page: 1 } } }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <Layout title={`#${colorProps.join('').toUpperCase()} Color Info - Palettes`}>
            <Header/>
            <div className="mt-[150px] mb-[100px] max-w-6xl mx-auto px-5 md:px-10">
                <h1 className="text-center font-black text-5xl tracking-tighter mb-8">Color picker</h1>
                <div className="max-w-[496px] mb-[100px] mx-auto text-center text-xl text-[#7d7c83] leading-8">Get useful color information like conversion, combinations, blindness simulation and more.</div>
                <div className="relative mb-[60px]">
                    <input onChange={handleChangeColorPreview} value={`#${colorPreview.toUpperCase()}`} type="text" className="h-[58px] rounded-xl hover:border-gray-400 border-gray-300 transition focus:border-blue-500 font-medium outline-none border w-full pl-[21px]"/>
                    <div onClick={()=>setShowPicker(true)} style={{ backgroundColor:  `#${color}`}} className="h-[40px] w-[40px] rounded-md absolute right-[10px] border top-1/2 -translate-y-1/2 cursor-pointer btn-picker-ref"></div>
                    {showPicker && (
                    <ColorPickerRelative width={272} setState={setShowPicker} onChange={handleChangeColor} color={color} targetClass={'btn-picker-ref'}/>
                    )}
                </div>
                <div style={{ backgroundColor: `#${color}` }} className="w-full h-[300px] rounded-xl border select-text flex items-center justify-center mb-[80px] md:mb-[140px] relative">
                    <div className={`absolute flex items-center top-6 right-6 gap-4 ${lightOrDark(color)==='light' ? 'text-black/50' : 'text-white/50'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 cursor-pointer transition ${lightOrDark(color)==='light' ? 'hover:text-black' : 'hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <svg onClick={()=>dispatch(setDataFullscreenPalette([color],'palette'))} xmlns="http://www.w3.org/2000/svg" className={`icon icon-tabler icon-tabler-arrows-diagonal cursor-pointer transition ${lightOrDark(color)==='light' ? 'hover:text-black' : 'hover:text-white'}`} width="22" height="22" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <polyline points="16 4 20 4 20 8"></polyline>
                            <line x1="14" y1="10" x2="20" y2="4"></line>
                            <polyline points="8 20 4 20 4 16"></polyline>
                            <line x1="4" y1="20" x2="10" y2="14"></line>
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className={`text-xl font-medium text-[#7d7c83] mb-2 ${lightOrDark(color)==='light' ? 'text-black/50' : 'text-white/50'}`}>{color.toUpperCase()}</p>
                        <h1 className={`text-[40px] font-extrabold ${lightOrDark(color)==='light' ? 'text-black' : 'text-white'}`}>{GetColorName(color)}</h1> 
                    </div>
                </div>
                <div className="mb-[80px] md:mb-[140px]">
                    <h1 className="text-center text-4xl font-black tracking-tighter">Conversion</h1>
                    <div className="flex flex-col md:flex-row mt-[50px] md:mt-[90px] md:gap-10">
                        <div className="flex-1">
                            <div onClick={()=>copyColor(color)} className="flex items-center justify-between px-4 py-3 font-medium group cursor-pointer bg-[#f2f2f3]">
                                <h1>HEX</h1>
                                <div className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:visible invisible" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p>{color.toUpperCase()}</p>
                                </div>
                            </div>
                            <div onClick={()=>copyColor(hexToRgb(color).join(', '))} className="flex items-center justify-between px-4 py-3 font-medium group cursor-pointer">
                                <h1>RGB</h1>
                                <div className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:visible invisible" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p>{hexToRgb(color).join(', ')}</p>
                                </div>
                            </div>
                            <div onClick={()=>copyColor(hexToCMYK(color).join(', '))} className="flex items-center justify-between px-4 py-3 font-medium group cursor-pointer bg-[#f2f2f3]">
                                <h1>CMYK</h1>
                                <div className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:visible invisible" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p>{hexToCMYK(color).join(', ')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div onClick={()=>copyColor(hexToLAB(color).join(', '))} className="flex items-center justify-between px-4 py-3 font-medium group cursor-pointer bg-white md:bg-[#f2f2f3]">
                                <h1>LAB</h1>
                                <div className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:visible invisible" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p>{hexToLAB(color).join(', ')}</p>
                                </div>
                            </div>
                            <div onClick={()=>copyColor(hexToHSB(color).join(', '))} className="flex items-center justify-between px-4 py-3 font-medium group cursor-pointer md:bg-white bg-[#f2f2f3]">
                                <h1>HSB</h1>
                                <div className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:visible invisible" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p>{hexToHSB(color).join(', ')}</p>
                                </div>
                            </div>
                            <div onClick={()=>copyColor(hexToHSL(color).join(', '))} className="flex items-center justify-between px-4 py-3 font-medium group cursor-pointer bg-white md:bg-[#f2f2f3]">
                                <h1>HSL</h1>
                                <div className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:visible invisible" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p>{hexToHSL(color).join(', ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-[80px] md:mb-[140px]">
                    <h1 className="text-center text-4xl font-black tracking-tighter mb-4">Variations</h1>
                    <p className="#7d7c83 text-center text-lg">View this color variations of shades, tints, tones, hues and temperatures.</p>
                    <div className="mt-[50px] md:mt-[90px]">
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-2">Shades</h2>
                            <p className="#7d7c83 text-sm mb-4">A shade is created by adding black to a base color, increasing its darkness. Shades appear more dramatic and richer.</p>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {chroma.scale([color,'000000']).colors(15).map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: clr }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-2">Tints</h2>
                            <p className="#7d7c83 text-sm mb-4">A tint is created by adding white to a base color, increasing its lightness. Tints are likely to look pastel and less intense.</p>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {chroma.scale([color,'ffffff']).colors(15).map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: clr }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className="w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden"></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-2">Tones</h2>
                            <p className="#7d7c83 text-sm mb-4">A tone is created by adding gray to a base color, increasing its lightness. Tones looks more sophisticated and complex than base colors.</p>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {chroma.scale([color,'gray']).colors(15).map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: clr }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className="w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden"></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-[80px] md:mb-[140px]">
                    <h1 className="text-center text-4xl font-black tracking-tighter mb-4">Color harmonies</h1>
                    <p className="#7d7c83 text-center text-lg">
                        <span>Color harmonies are pleasing color schemes created according to their position on a color wheel. </span>
                        <a href="https://en.wikipedia.org/wiki/Color_theory" className="hover:underline text-blue-500" target="_blank" rel="noopener noreferrer">Learn more</a>
                    </p>
                    <div className="mt-[50px] md:mt-[90px] grid md:grid-cols-2 gap-x-10 gap-y-6 md:gap-y-8">
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Analogous</h2>
                                <p className="#7d7c83 text-sm mb-4">Analogous color schemes are made by picking three colors that are next to each other on the color wheel. They are perceived as calm and serene.</p>
                            </div>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {harmonizer.harmonize(color, 'analogous').map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: clr }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Complementary</h2>
                                <p className="#7d7c83 text-sm mb-4">Complementary color schemes are made by picking two opposite colors con the color wheel. They appear vibrant near to each other.</p>
                            </div>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {harmonizer.harmonize(color, 'complementary').map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: clr }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Split complementary</h2>
                                <p className="#7d7c83 text-sm mb-4">Split complementary schemes are like complementary but they uses two adiacent colors of the complement. They are more flexible than complementary ones.</p>
                            </div>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {harmonizer.harmonize(color, 'splitComplementary').map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: clr }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Triadic</h2>
                                <p className="#7d7c83 text-sm mb-4">Triadic color schemes are created by picking three colors equally spaced on the color wheel. They appear quite contrasted and multicolored.</p>
                            </div>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {harmonizer.harmonize(color, 'triadic').map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: clr }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Tetradic</h2>
                                <p className="#7d7c83 text-sm mb-4">Tetradic color schemes are made form two couples of complementary colors in a rectangular shape on the color wheel. They are very versatile, and work best with one dominant color.</p>
                            </div>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {harmonizer.harmonize(color, 'tetradic').map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: clr }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Clash</h2>
                                <p className="#7d7c83 text-sm mb-4">Clash color schemes pair a first color with a second to the left or right of {"it's"} color wheel compliment. Clash colors are VERY bold and have high contrast.</p>
                            </div>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {harmonizer.harmonize(color, 'clash').map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: clr }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-[80px] md:mb-[140px]">
                    <h1 className="text-center text-4xl font-black tracking-tighter mb-4">Blindness simulator</h1>
                    <p className="#7d7c83 text-center text-lg"><span>Check how a color is perceived by color blind people to create accessible designs. </span><a href="https://en.wikipedia.org/wiki/Color_blindness" className="hover:underline text-blue-500" target="_blank" rel="noopener noreferrer">Learn more</a></p>
                    <div className="mt-[50px] md:mt-[90px] grid md:grid-cols-2 gap-x-10 gap-y-6 md:gap-y-8">
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Protanopia</h2>
                                <p className="#7d7c83 text-sm mb-4">1.3% of men, 0.02% of women</p>
                            </div>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {colorBlinds.protanopia.map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: `#${clr}` }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Protanomaly</h2>
                                <p className="#7d7c83 text-sm mb-4">1.3% of men, 0.02% of women</p>
                            </div>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {colorBlinds.protanomaly.map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: `#${clr}` }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Deuteranopia</h2>
                                <p className="#7d7c83 text-sm mb-4">1.2% of men, 0.01% of women</p>
                            </div>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {colorBlinds.deuteranopia.map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: `#${clr}` }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Deuteranomaly</h2>
                                <p className="#7d7c83 text-sm mb-4">5% of men, 0.35% of women</p>
                            </div>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {colorBlinds.deuteranomaly.map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: `#${clr}` }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Tritanopia</h2>
                                <p className="#7d7c83 text-sm mb-4">0.001% of men, 0.03% of women</p>
                            </div>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {colorBlinds.tritanopia.map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: `#${clr}` }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Tritanomaly</h2>
                                <p className="#7d7c83 text-sm mb-4">0.0001% of the population</p>
                            </div>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {colorBlinds.tritanomaly.map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: `#${clr}` }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Achromatopsia</h2>
                                <p className="#7d7c83 text-sm mb-4">0.003% of the population</p>
                            </div>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {colorBlinds.achromatopsia.map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: `#${clr}` }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Achromatomaly</h2>
                                <p className="#7d7c83 text-sm mb-4">0.001% of the population</p>
                            </div>
                            <div className="border flex flex-col md:flex-row rounded-xl overflow-hidden md:h-[80px]">
                                {colorBlinds.achromatomaly.map((clr,i)=>(
                                <div key={i} onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} onClick={()=>{copyColor(clr.replace('#',''));dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: `#${clr}` }} className="md:flex-[1] relative group cursor-pointer md:hover:flex-[2] transition-all flex items-center justify-center h-[45px] md:h-auto">
                                    {i===0 && (
                                    <div className={`w-3 h-3 absolute left-3 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 rounded-full bg-white md:group-hover:hidden`}></div>
                                    )}
                                    {copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 animate-scale-check hidden group-hover:block ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                    <span className={`font-medium md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:invisible md:group-hover:visible ${lightOrDark(clr)==='light' ? 'text-black' : 'text-white'}`}>{clr.replace('#','').toUpperCase()}</span>
                                    )}
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-[80px] md:mb-[140px]">
                    <h1 className="text-center text-4xl font-black tracking-tighter mb-4">Contrast checker</h1>
                    <p className="#7d7c83 text-center text-lg"><span>Verify the contrast of a text on white and black backgrounds. For additional options use </span> <a href="https://en.wikipedia.org/wiki/Color_blindness" className="hover:underline text-blue-500" target="_blank" rel="noopener noreferrer">this tool</a></p>
                    <div className="mt-[50px] md:mt-[90px]">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-semibold text-lg">White background</h2>
                                    <div className={`px-1.5 py-0.5 rounded ${checkContrast(color,'ffffff')[1]===1 || checkContrast(color,'ffffff')[1]===2 ? 'bg-[#fbd0da] text-[#5f071c]' : checkContrast(color,'ffffff')[1]===3 ? 'bg-[#fbf5d0] text-[#5f5207]' : checkContrast(color,'ffffff')[1]>3 && 'bg-[#d2fbd0] text-[#0d5f07]'}`}>
                                        <p className="text-[10px] font-bold">{checkContrast(color,'ffffff')[0]} {checkContrast(color,'ffffff')[1]}/5</p>
                                    </div>
                                </div>
                                <div style={{ color: `#${color}` }} className="border bg-white p-8 rounded-lg text-center">
                                    <p className="text-xl mb-3 font-medium">Quote n. 1</p>
                                    <p className="text-sm mb-3">Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.</p>
                                    <p className="text-[15px] font-medium">Antoine de Saint-Exupéry</p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-semibold text-lg">Black background</h2>
                                    <div className={`px-1.5 py-0.5 rounded ${checkContrast(color,'000000')[1]===1 || checkContrast(color,'000000')[1]===2 ? 'bg-[#fbd0da] text-[#5f071c]' : checkContrast(color,'000000')[1]===3 ? 'bg-[#fbf5d0] text-[#5f5207]' : checkContrast(color,'000000')[1]>3 && 'bg-[#d2fbd0] text-[#0d5f07]'}`}>
                                        <p className="text-[10px] font-bold">{checkContrast(color,'000000')[0]} {checkContrast(color,'000000')[1]}/5</p>
                                    </div>
                                </div>
                                <div style={{ color: `#${color}` }} className="border bg-black p-8 rounded-lg text-center">
                                    <p className="text-xl mb-3 font-medium">Quote n. 1</p>
                                    <p className="text-sm mb-3">Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.</p>
                                    <p className="text-[15px] font-medium">Antoine de Saint-Exupéry</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h1 className="text-center text-4xl font-black tracking-tighter mb-4">Color palettes</h1>
                    <div className="flex gap-2 items-center justify-center">
                        <p className="#7d7c83 text-center text-lg">Some examples of color palettes with this color. </p>
                        <Link href={`/palettes/popular/${colorProps[0]}`}>
                            <a className="text-[#0066ff] hover:underline">View more</a>
                        </Link>
                    </div>
                    <div className='grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] mt-[90px] gap-9'>
                    {examplePalettes.data.map((palette,i)=>(
                    <Palette key={i} index={i} data={palette}/>
                    ))}
                </div>
                </div>
            </div>
            <Footer/>
        </Layout>
    )
}
