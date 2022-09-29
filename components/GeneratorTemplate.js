import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Header, Layout, Sidebar, ColorPickerRelative } from "../components";
import { SortableContainer ,SortableElement, SortableHandle } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import randomColor from "randomcolor";
import chroma from "chroma-js";
import { hexToCMYK, hexToHSB, hexToHSL, hexToLAB, hexToRgb, lightOrDark, useIsMd, useNotifColor } from "../lib";
import blinder from 'color-blind';
import { handleSaveColor, setDataExportPalette, setDataMenuMore, setDataPopupLuminance, setDataPopupViewGradient, setDataQuickView, setDataShowGenerateMethod, setDataShowSettingPalette } from "../slices/popupSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { handleSavePalette } from "../slices/popupSlice";
import { selectHue, selectIsolateColor, selectLuminosity, selectSecondaryInfo, selectZenMode, setZenMode } from "../slices/generatorSlice";
import { GetColorName } from "hex-color-to-color-name";
import { selectShowSidebar, setShowSidebar } from "../slices/globalSlice";

export default function GeneratorTemplate({ colorProps }){
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const secondaryInfo = useSelector(selectSecondaryInfo);
    const isolateColor = useSelector(selectIsolateColor);
    const zenMode = useSelector(selectZenMode);
    const hue = useSelector(selectHue);
    const luminosity = useSelector(selectLuminosity);
    const showSidebar = useSelector(selectShowSidebar);
    const [isLock, setIsLock] = useState([]);
    const [colors, setColors] = useState(colorProps);
    const isMd = useIsMd();
    const [undo, setUndo] = useState([]);
    const [redo, setRedo] = useState([]);
    const [saturationPalettes, setSaturationPalettes] = useState(0);
    const [brightnessPalettes, setBrightnessPalettes] = useState(0);
    const [showAdjust, setShowAdjust] = useState(false);
    const [colorPreview, setColorPreview] = useState(colors);
    const [focusColor, setFocusColor] = useState(null);
    const [showBlindSimulator, setShowBlindSimulator]= useState(false);
    const paletteRef = useRef(null);
    const btnMoreRef = useRef(null);
    const [showShades, setShowShades] = useState(null);
    const copyColor = useNotifColor();
    function getSecondaryInfo(color){
        if (secondaryInfo==='RGB') {
            let result = hexToRgb(color).join(', ');
            return result;
        }
        if (secondaryInfo==='Name') {
            let result = GetColorName(color);
            return result;
        }
        if (secondaryInfo==='HSB') {
            let result = hexToHSB(color).join(', ');
            return result;
        }
        if (secondaryInfo==='HSL') {
            let result = hexToHSL(color).join(', ');
            return result;
        }
        if (secondaryInfo==='CMYK') {
            let result = hexToCMYK(color).join(', ');
            return result;
        }
        if (secondaryInfo==='LAB') {
            let result = hexToLAB(color).join(', ');
            return result;
        }
    }
    const addToLock = (index) => {
        setIsLock(old=>[...old,index]);
    }
    const removeToLock = (index) => {
        setIsLock(isLock.filter(i=>i!==index));
    }
    const sortEnd = ({ oldIndex, newIndex }) => {
        setColors(arrayMoveImmutable(colors, oldIndex, newIndex));
        setUndo(undo=>[...undo,colors]);
    }
    const handleRemove = (i) => {
        setUndo(undo=>[...undo,colors]);
        setColors(colors.filter((col,idx)=>idx!==i));
    }
    const setSidebar = () => {
        dispatch(setShowSidebar(!showSidebar));
    }
    const addWithIndex = (index) => {
        let arrayBefore = window.location.href.split('/')[window.location.href.split('/').length-1].split('-').splice(0,index);
        let arrayAfter = window.location.href.split('/')[window.location.href.split('/').length-1].split('-').splice(index);
        setUndo(undo=>[...undo,colors]);
        try {
            setColors([...arrayBefore,randomColor({ hue: colors[index] }).replace('#',''),...arrayAfter]);
        } catch (error) {
            setColors([...arrayBefore,randomColor().replace('#',''),...arrayAfter]);
        }
    }
    const addToEnd = () => {
        setUndo(undo=>[...undo,colors]);
        setColors(colors=>[...colors,randomColor({ hue: colors.slice(-1)[0] }).replace('#','')]);
    }
    const exitFullscreen = () => {
        dispatch(setZenMode(false));
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    function generateColorsByBtn(){
        setUndo(undo=>[...undo,colors]);
        const newColors = [];
        colors.forEach((hex,i)=>{
            if (isLock.includes(i)) {
                newColors.push(hex);
            }else {
                newColors.push(randomColor({ hue, luminosity }).slice(1));
            }
        })
        setColors(newColors);
    }
    function generateColorsBySpace(e){
        if (e.code==='Space') {
            setUndo(undo=>[...undo,colors]);
            const newColors = [];
            colors.forEach((hex,i)=>{
                if (isLock.includes(i)) {
                    newColors.push(hex);
                }else {
                    newColors.push(randomColor({ hue, luminosity }).slice(1));
                }
            })
            setColors(newColors);
        }
    }
    const handleChangeColor = (ctx,i) => {
        const { hex } = ctx;
        const newColors = [...colors];
        newColors[i] = hex.replace('#','');
        setColors(newColors);
    }
    const handleUndo = () => {
        if (undo.length>0) {
            setRedo(redo=>[...redo,colors]);
            setColors(undo[undo.length-1]);
            setUndo(undo=>undo.filter((e,i)=>i!==undo.length-1));
        }
    }
    const handleRedo = () => {
        if (redo.length>0) {
            setUndo(undo=>[...undo,colors]);
            setColors(redo[redo.length-1]);
            setRedo(redo=>redo.filter((e,i)=>i!==redo.length-1));
        }
    }
    const handleShowMenuMore = (menu) => {
        if (menu==='settings') {
            dispatch(setDataShowSettingPalette(true));
        }
        if (menu==='gradient') {
            dispatch(setDataPopupViewGradient(colors));
        }
        if (menu==='luminance') {
            dispatch(setDataPopupLuminance(colors));
        }
        if (menu==='method') {
            dispatch(setDataShowGenerateMethod(true));
        }
    }
    const handleAdjust = () => {
        setColors(colorPreview);
        setShowAdjust(false);
        setShowBlindSimulator(null);
        setUndo(undo=>[...undo,colors]);
    }
    const handleShowAdjust = () => {
        setColorPreview(colors)
        setShowBlindSimulator(null)
        setShowAdjust(bool=>!bool)
    }
    const handleShowBlindSimulator = () => {
        setColorPreview(colors.map(hex=>blinder.protanopia(`#${hex}`).slice(1)));
        setShowAdjust(false)
        setShowBlindSimulator(state=>state ? null : 'protanopia')
    }
    useEffect(()=>{
        if (showShades!==null) {
            const clickEvent = (e) => {
                if (!e.target.closest('.btnShades')) {
                    setShowShades(null);
                }
            }
            window.addEventListener('click',clickEvent);
            return ()=> window.removeEventListener('click',clickEvent);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[showShades])
    useEffect(()=>{
        if (saturationPalettes>100) {
            setSaturationPalettes(100);
        }
        if (saturationPalettes<-100) {
            setSaturationPalettes(-100);
        }
        if (brightnessPalettes>100) {
            setBrightnessPalettes(100);
        }
        if (brightnessPalettes<-100) {
            setBrightnessPalettes(-100);
        }
        if (showAdjust) {
            setColorPreview(colors.map(color=>chroma(color).saturate(saturationPalettes/100).brighten(brightnessPalettes/100).hex().replace('#','')))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[saturationPalettes, brightnessPalettes])
    useEffect(()=>{
        if (!showAdjust) {
            setBrightnessPalettes(0);
            setSaturationPalettes(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[showAdjust])
    useEffect(()=>{
        window.history.pushState('','',`/${colors.join('-')}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[colors,showSidebar])
    useEffect(()=>{
        window.addEventListener('keyup',generateColorsBySpace);
        return ()=> window.removeEventListener('keyup',generateColorsBySpace);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isLock,hue,luminosity,colors])
    useLayoutEffect(()=>{
        const root = document.querySelector(':root');
        const resize_ob = new ResizeObserver((element)=>{
            let rect = element[0].contentRect;
            let width = rect.width;
            if (width!==0 && !isMd) {
                root.style.setProperty('--relative-font',`${(width*0.1)>45 ? 45 : width*0.1}px`);
            }
        });
        if (isMd) {
            setShowAdjust(false);
            setShowShades(null);
            root.style.setProperty('--relative-font',`16px`);
        }
        if (paletteRef.current) {
            resize_ob.observe(paletteRef.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isMd,paletteRef.current])
    const Container = SortableContainer(({ children })=>(
        <div id="doc" className={`bg-white overflow-hidden w-full flex flex-col md:flex-row ${isolateColor && 'p-2.5 gap-2.5'} ${zenMode ? 'h-full z-[999] fixed' : 'h-[calc(100vh-114px)] md:h-[calc(100vh-113px)]'}`}>
            {zenMode && (
            <div onClick={exitFullscreen} className="bg-white z-[999] border rounded-full h-max w-max p-1.5 fixed right-5 top-5 cursor-pointer hover:bg-gray-50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            )}
            {children}
        </div>
    ));
    const Handle = SortableHandle(()=>(
        isMd ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrows-vertical cursor-grab hover:bg-black/10 p-1.5 rounded-lg" width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <polyline points="8 7 12 3 16 7"></polyline>
            <polyline points="8 17 12 21 16 17"></polyline>
            <line x1="12" y1="3" x2="12" y2="21"></line>
        </svg>
        ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon handle icon-tabler icon-tabler-arrows-horizontal mx-auto cursor-grab hover:bg-black/10 p-1.5 rounded-lg transition hidden group-hover:block" width="35" height="35" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <polyline points="7 8 3 12 7 16"></polyline>
            <polyline points="17 8 21 12 17 16"></polyline>
            <line x1="3" y1="12" x2="21" y2="12"></line>
        </svg>
        )
    ))
    const Item = SortableElement(({ color, i })=>(
        <div ref={i===0 ? paletteRef : null} id='item-sort' style={{backgroundColor: `#${color}`}} className={`box h-full relative group flex-1 ${zenMode && 'z-40'}`}>
            {(showShades===i && !isMd)&&(
            <div className="absolute top-0 left-0 w-full h-[calc(100%-50px)] z-30 flex flex-col">
                {chroma.scale([chroma(colors[showShades]).brighten(3),colors[showShades],chroma(colors[showShades]).darken(3)]).colors(25).map(hex=>hex.slice(1)).map((hex,i)=>(
                    <div key={i} onClick={()=>copyColor(hex)} style={{ backgroundColor: `#${hex}` }} className={`flex-1 cursor-pointer shades-group text-center font-bold text-xs uppercase ${lightOrDark(hex)==='light' ? 'text-black' : 'text-white'}`}>
                        <span className="block opacity-0 hover:opacity-100">{hex}</span>
                        {hex===color && (
                        <div className={`w-2 h-2 rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ${lightOrDark(hex)==='light' ? 'bg-black' : 'bg-white'}`}></div>
                        )}
                    </div>
                ))}
            </div>
            )}
            {(colors.length!==10 && !isMd && showShades===null) && (
            <div className={`h-full z-20 absolute flex add items-center ${i===0 ? 'translate-x-[50%]' : '-translate-x-[50%]'}`}>
                <div onClick={()=>addWithIndex(i)} className='shadow border transition duration-100 bg-white scale-0 rounded-full cursor-pointer p-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[30px] w-[30px] relative hover:bg-gray-100 p-1 rounded-full transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
            </div>
            )}
            {showShades===null && (
            <Fragment>
                <div id="btn-picker" className={`absolute flex z-10 right-4 md:right-0 h-full items-center md:h-max w-max md:flex-col md:bottom-[200px] md:w-full ${lightOrDark(color)==='light' ? 'text-black/20 md:text-black' : 'text-white/20 md:text-white'}`}>
                    {(colors.length>2) && (
                    <svg onClick={()=>handleRemove(i)} xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mx-auto cursor-pointer hover:bg-black/10 p-1.5 rounded-lg transition hidden md:group-hover:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    )}
                    <svg onClick={()=>setShowShades(i)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="btnShades h-9 w-9 mx-auto cursor-pointer hover:bg-black/10 p-1.5 rounded-lg transition hidden md:group-hover:block">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                    </svg>
                    <svg onClick={()=>dispatch(handleSaveColor(user,'save',color))} xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 mx-auto cursor-pointer hover:bg-black/10 p-1.5 rounded-lg transition hidden md:group-hover:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <Handle/>
                    <svg onClick={()=>copyColor(color)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-9 md:w-9 mx-auto cursor-pointer hover:bg-black/10 p-1.5 rounded-lg transition md:hidden md:group-hover:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {!isLock.includes(i) ? (
                    <svg onClick={()=>addToLock(i)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-9 md:w-9 mx-auto cursor-pointer hover:bg-black/10 p-1.5 rounded-lg transition md:hidden md:group-hover:block" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                    </svg>
                    ) : (
                    <svg onClick={()=>removeToLock(i)} xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 md:h-9 md:w-9 mx-auto cursor-pointer hover:bg-black/10 p-1.5 rounded-lg transition ${lightOrDark(color)==='light' ? 'text-black' : 'text-white'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    )}
                </div>
                <div className={`absolute left-4 md:left-0 w-full h-full md:h-max flex items-center md:block md:bottom-[70px]`}>
                    <div id="btn-pick" className="relative">
                        <button onClick={()=>setFocusColor(i)} className={`btn-picker-ref-${i} font-bold mb-4 md:mx-auto block text-relative px-3 py-0.5 rounded-md ${lightOrDark(color)==='light' ? `text-black hover:bg-black/5 ${(focusColor===i && !isMd) && 'bg-black/5'}` : `text-white hover:bg-white/5 ${(focusColor===i && !isMd) && 'bg-white/5'}` }`}>{color.toUpperCase()}</button>
                    </div>
                    <button onClick={()=>dispatch(setDataShowSettingPalette(true))} className={`text-xs font-medium hidden md:block px-3 mx-auto whitespace-nowrap overflow-hidden text-ellipsis w-full ${lightOrDark(color)==='light' ? 'text-black/60' : 'text-white/60'}`}>{getSecondaryInfo(color)}</button>
                </div>
            </Fragment>
            )}
            {!isMd && (
                (i===colors.length-1 && colors.length<10 && showShades===null) && (
                <div className={`h-full z-20 absolute flex add items-center right-0 -translate-x-[50%]`}>
                    <div onClick={addToEnd} className='shadow border transition duration-100 bg-white scale-0 rounded-full cursor-pointer p-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[30px] w-[30px] relative hover:bg-gray-100 p-1 rounded-full transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                </div>
                )
            )}
        </div>
    ))
    const menuMore = ()=> (
        <Fragment>
            <section className="mb-2">
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
                    <span className="text-sm font-medium">View luminance map</span>
                </div>
                <div onClick={()=>handleShowMenuMore('gradient')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                    <span className="text-sm font-medium">View as gradient</span>
                </div>
            </section>
            <section className="pt-2">
                <div onClick={()=>handleShowMenuMore('method')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-sm font-medium">Generate method</span>
                </div>
                <div onClick={()=>handleShowMenuMore('settings')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">Settings</span>
                </div>
            </section>
        </Fragment>
    )
    return (
        <Layout title={"Create a Palette - Palettes"}>
            {!zenMode && (
            <Fragment>
                <Header/>
                <div className="top-full -translate-y-full border-t md:border-t-0 md:top-[60px] md:translate-y-0 w-full bg-white z-20 fixed flex md:justify-end lg:justify-between items-center border-b px-4 md:px-6 py-2">
                    <p className="text-[15px] hidden lg:block text-gray-500 font-medium">Press the spacebar to generate color palettes!</p>
                    <div className="flex justify-between w-full md:w-max">
                        <button onClick={generateColorsByBtn} className="block md:hidden border text-sm px-3 rounded-md py-1.5 font-medium transition hover:border-gray-400">Generate</button>
                        <div className="flex divide-x gap-3 items-center">
                            {!isMd && (
                            <div className="relative">
                                <svg ref={btnMoreRef} onClick={()=>dispatch(setDataMenuMore({ width: 222, elementRef: btnMoreRef.current, Children: menuMore }))} xmlns="http://www.w3.org/2000/svg" className="h-9 cursor-pointer w-9 p-1.5  md:hover:bg-gray-100 transition rounded-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                            </div>
                            )}
                            <div className="flex pl-3">
                                <svg onClick={handleUndo} xmlns="http://www.w3.org/2000/svg" className={`md:hover:bg-gray-100 cursor-pointer transition p-1.5 rounded-lg ${undo.length>0 ? 'text-black md:hover:text-black hover:text-blue-500' : 'text-gray-400'}`} width="35" height="35" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1"></path>
                                </svg>
                                <svg onClick={handleRedo} xmlns="http://www.w3.org/2000/svg" className={`md:hover:bg-gray-100 cursor-pointer transition p-1.5 rounded-lg ${redo.length>0 ? 'hover:text-blue-500 md:hover:text-black text-black' : 'text-gray-400'}`} width="35" height="35" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M15 13l4 -4l-4 -4m4 4h-11a4 4 0 0 0 0 8h1"></path>
                                </svg>
                            </div>
                            {!isMd && (
                            <div className="flex pl-3">
                                <svg onClick={handleShowBlindSimulator} xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={`h-9 cursor-pointer w-9 p-1.5 transition rounded-lg ${showBlindSimulator ? 'bg-gray-100' : 'md:hover:bg-gray-100'}`} viewBox="0 0 16 16">
                                    <path d="M4 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm2.625.547a3 3 0 0 0-5.584.953H.5a.5.5 0 0 0 0 1h.541A3 3 0 0 0 7 8a1 1 0 0 1 2 0 3 3 0 0 0 5.959.5h.541a.5.5 0 0 0 0-1h-.541a3 3 0 0 0-5.584-.953A1.993 1.993 0 0 0 8 6c-.532 0-1.016.208-1.375.547zM14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                                </svg>
                                <svg onClick={handleShowAdjust} xmlns="http://www.w3.org/2000/svg" className={`h-9 cursor-pointer w-9 p-1.5 transition rounded-lg ${showAdjust ? 'bg-gray-100' : 'md:hover:bg-gray-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            )}
                            <div className="flex pl-3">
                                <div onClick={()=>dispatch(setDataQuickView(colors))} className="hidden md:flex hover:text-blue-500 md:hover:text-black md:hover:bg-gray-100 cursor-pointer transition px-2 py-1.5 rounded-lg gap-1.5 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span className="text-[15px] hidden md:block">View</span>
                                </div>
                                <div onClick={()=>dispatch(setDataExportPalette(colors))} className="flex hover:text-blue-500 md:hover:text-black md:hover:bg-gray-100 cursor-pointer transition px-2 py-1.5 rounded-lg gap-1.5 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    <span className="text-[15px] hidden md:block">Export</span>
                                </div>
                                <div onClick={()=>dispatch(handleSavePalette(user,colors,'save'))} className="flex hover:text-blue-500 md:hover:text-black md:hover:bg-gray-100 cursor-pointer transition px-2 py-1.5 rounded-lg gap-1.5 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span className="text-[15px] hidden md:block">Save</span>
                                </div>
                            </div>
                            <div className="pl-3">
                                <svg onClick={setSidebar} xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 p-1.5 cursor-pointer hover:text-blue-500 md:hover:text-black md:hover:bg-gray-100 transition duration-300 rounded-lg ${showSidebar ? 'rotate-90' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
            )}
            <div className={`duration-300 ${zenMode && 'fixed'} ${(showSidebar || showAdjust || showBlindSimulator) && !isMd ? 'w-[calc(100%-300px)]' : 'w-full'} ${(!zenMode && !isMd) && 'md:mt-[113px]'}`}>
            {(!showAdjust && !showBlindSimulator) ? (
                <Fragment>
                    {(focusColor!==null && !isMd) && (
                    <ColorPickerRelative width={272} targetClass={`btn-picker-ref-${focusColor}`} color={colors[focusColor]} onChange={ctx=>handleChangeColor(ctx,focusColor)} setState={setFocusColor}/>
                    )}
                    <Container helperContainer={() =>document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.body} axis={isMd ? 'y' : 'x'} lockAxis={isMd ? 'y' : 'x'} useDragHandle onSortEnd={sortEnd} lockToContainerEdges={true} lockOffset={"0px"}>
                        {colors.map((color,i)=>(
                        <Item  color={color} index={i} key={i} i={i}/>
                        ))}
                    </Container>
                </Fragment>
            ) : (
                <div className="h-[calc(100vh-113px)] w-full flex flex-col">
                    <div className="flex-1 flex">
                        {colors.map((color,i)=>(
                            <div key={i} style={{ backgroundColor: `#${color}` }} className="flex-1 flex items-center justify-center">
                                <span className={`font-semibold rotate-[270deg] text-sm block ${lightOrDark(color)==='light' ? 'text-black' : 'text-white'}`}>{color.toUpperCase()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 flex">
                        {colorPreview.map((color,i)=>(
                            <div key={i} style={{ backgroundColor: `#${color}` }} className="flex-1 flex items-center justify-center">
                                <span className={`font-semibold rotate-[270deg] text-sm block ${lightOrDark(color)==='light' ? 'text-black' : 'text-white'}`}>{color.toUpperCase()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            </div>
            <div className={`w-[300px] h-[calc(100vh-112px)] bg-white hidden md:flex fixed z-40 top-[112px] right-0 flex-col border-l transition duration-300 ${(showAdjust || showBlindSimulator) ? 'translate-x-0' : 'translate-x-full'}`}>
                <h1 className="font-semibold text-center py-3.5 text-[15px] border-b">{showAdjust && 'Adjust palette'} {showBlindSimulator && 'Color blindness'}</h1>
                <div className="p-6 flex-1">
                    {showAdjust && (
                    <Fragment>
                        <div className="mb-4">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium mb-2">Saturation</p>
                                <input type="number" name="saturation" onChange={e=>setSaturationPalettes(e.target.value)} value={saturationPalettes} className="border border-transparent hover:border-gray-300 w-[40px] rounded-md focus:border-blue-500 transition py-1 outline-none text-center text-xs number"/>
                            </div>
                            <input type="range" value={saturationPalettes} onChange={e=>setSaturationPalettes(e.target.value)} name="" min={-100} max={100} className="slider saturation appearance-none w-full rounded-full"/>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium mb-2">Brightness</p>
                                <input type="number" name="brightness" onChange={e=>setBrightnessPalettes(e.target.value)} value={brightnessPalettes} className="border border-transparent hover:border-gray-300 w-[40px] rounded-md focus:border-blue-500 transition py-1 outline-none text-center text-xs number"/>
                            </div>
                            <input type="range" value={brightnessPalettes} onChange={e=>setBrightnessPalettes(e.target.value)} name="" min={-100} max={100} className="slider brightness appearance-none w-full rounded-full"/>
                        </div>
                    </Fragment>
                    )}
                    {showBlindSimulator && (
                    <div className="flex flex-col gap-1">
                        {['protanopia','deuteranopia','tritanopia','achromatopsia','protanomaly','deuteranomaly','tritanomaly','achromatomaly'].map(blind=>(
                            <div key={blind} onClick={()=>{setShowBlindSimulator(blind);setColorPreview(colors.map(hex=>blinder[blind](`#${hex}`).slice(1)))}} className={`text-sm cursor-pointer h-8 font-medium flex items-center px-3.5 rounded-lg ${showBlindSimulator===blind ? 'bg-blue-100 text-blue-500 justify-between' : 'hover:bg-gray-100'}`}>
                                <span className="capitalize">{blind}</span>
                                {showBlindSimulator===blind && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>

                                )}
                            </div>
                        ))}
                    </div>
                    )}
                </div>
                <div className="flex border-t px-6 py-4 gap-5">
                    <button onClick={showAdjust ? ()=> setShowAdjust(false) : ()=> setShowBlindSimulator(null)} className="flex-1 border transition hover:border-gray-400 py-1.5 rounded-lg text-[15px] font-semibold">Cancel</button>
                    <button onClick={handleAdjust} className="flex-1 bg-blue-500 text-white transition hover:bg-blue-600 py-1.5 rounded-lg text-[15px] font-semibold">Apply</button>
                </div>
            </div>
            <Sidebar className="md:top-[112px] md:h-[calc(100vh-112px)]"/>
        </Layout>
    )
}