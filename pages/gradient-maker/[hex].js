import { Footer, Header, Layout, ColorPickerRelative } from "../../components";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import chroma from "chroma-js";
import randomColor from "randomcolor";
import axios from "axios";
import { dataCreateGradient, getRandomRangeNumber, saveGradientAsImg, usePushNotif } from "../../lib";
import { setDataMenuMore, setDataShowCSSGradient } from "../../slices/popupSlice";
import { useDispatch } from "react-redux";

export default function GradientMaker({ colorProps, typeParam, rotationParam }){
    const btnMorePosition = useRef(null);
    const btnRotationRef = useRef(null);
    const btnCopyCSSRef = useRef(null);
    const dispatch = useDispatch();
    const [colors, setColors] = useState(colorProps);
    const [focusColor, setFocusColor] = useState(colorProps[0]);
    const [rotation, setRotation] = useState(rotationParam ? rotationParam : 90);
    const [type, setType] = useState(typeParam ? typeParam : 'linear');
    const [showMoreType, setShowMoreType] = useState(false);
    const [fullscreenGradient, setfullscreenGradient] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const handlePushNotif = usePushNotif();
    const handleFocus = (i) => {
        setFocusColor(colors[i]);
    }
    const handleOnChange = (e,i) => {
        const newData = [...colors];
        newData[i].position = parseInt(e.target.value);
        setColors(newData);
    }
    const getGradientThumb = () => {
        return `linear-gradient(90deg, ${colors.map(obj=>[`#${obj.color} ${obj.position}%`]).join(',')}`;
    }
    const getGradientPreview = () => {
        return `${type}-gradient(${type==='linear' ? rotation+'deg' : 'circle'}, ${colors.map(obj=>[`#${obj.color} ${obj.position}%`]).join(',')}`;
    }
    const replacePosition = (value,i) => {
        if (!isNaN(parseInt(value))){
            const newData = [...colors];
            newData[i].position = parseInt(value) > 100 ? 100 : parseInt(value);
            setFocusColor(newData[i]);
            setColors(newData);
        }else {
            const newData = [...colors];
            newData[i].position = 0;
            setFocusColor(newData[i]);
            setColors(newData);
        }
    }
    const handlePositionDropdown = (value) => {
        const newData = [...colors];
        newData[focusColor.index].position = value;
        setColors(newData);
    }
    const handleChangeRotation = (e) => {
        let value = parseInt(e.target.value.replace('°',''));
        if (!isNaN(value)) {
            setRotation(value>360 ? 360 : value);
        }else {
            setRotation(0);
        }
    }
    const handleChangeColor = (e) => {
        const newData = {...focusColor};
        newData.color = e.target.value.replace('#','');
        setFocusColor(newData);
        if (chroma.valid(e.target.value.replace('#',''))) {
            const newDataColors = [...colors];
            newDataColors[focusColor.index].color = e.target.value.replace('#','');
            setColors(newDataColors);
        }
    }
    const handleChangePicker = (ctx) => {
        const { hex } = ctx;
        setFocusColor(before=>({ ...before, color: hex.slice(1) }));
        const newData = [...colors];
        newData[focusColor.index].color = hex.replace('#','');
        setColors(newData);
    }
    const handleRemoveColor = () => {
        const newData = [...colors].filter((el,i)=>i!==focusColor.index);
        const newIndex = [];
        newData.forEach((data,i)=>{
            newIndex.push({ ...data, index: i });
        })
        window.history.pushState('','',`/gradient-maker/${newIndex.map(obj=>obj.color).join('-')}`);
        setColors(newIndex);
        setFocusColor(newIndex[0]);
    }
    const handleMenuMore = (menu) => {
        if (menu==='openGenerator') {
            window.open(`/${colors.map(obj=>obj.color).join('-')}`);
        }
        if (menu==='copyURL') {
            navigator.clipboard.writeText(window.location.href);
            handlePushNotif({ text: 'URL copied to the clipboard!', className: 'bg-black', icon: 'checklist' });
        }
        if (menu==='saveAsIMG'){
            if (type==='linear') {
                const data = {
                    rotation,
                    colors: colors.map(({ position, color })=>({ pos: position/100, color: `#${color}` }))
                }
                saveGradientAsImg(type,data,'gradient');
            }
            if (type==='radial') {
                const data = {
                    colors: colors.map(({ position, color })=>({ pos: position/100, color: `#${color}` }))
                }
                saveGradientAsImg(type,data,'gradient');
            }
        }
    }
    const menuMore = () => (
        <Fragment>
            <section className="mb-2">
                <div onClick={()=>handleMenuMore('saveAsIMG')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="md:text-sm font-medium">Download as image</span>
                </div>
                <div onClick={()=>{setfullscreenGradient(true)}} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
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
            </section>
        </Fragment>
    )
    const handleRandomColors = () => {
        const newColors = randomColor({count:getRandomRangeNumber(2,3)}).map(color=>color.replace('#',''));
        const newColorArray = [];
        newColors.forEach((color,i)=>{
            newColorArray.push({ color: color, position: i*100, index: i });
        })
        setColors(newColorArray);
    }
    const handleCopyCSS = () => {
        const data = {}
        data['color_position'] = colors.map(props=>({ color: props.color, position: props.position}));
        data['type'] = type;
        data['rotation'] = type==='linear' ? rotation : 'circle';
        dispatch(setDataShowCSSGradient(data));
    }
    const menuMoreRotation = ()=> (
        <section>
            <div onClick={()=>setRotation(0)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===0 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">0°</span>
                {rotation===0 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(45)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===45 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">45°</span>
                {rotation===45 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(90)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===90 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">90°</span>
                {rotation===90 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(135)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===135 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">135°</span>
                {rotation===135 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(180)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===180 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">180°</span>
                {rotation===180 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(225)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===225 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">225°</span>
                {rotation===225 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(270)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===270 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">270°</span>
                {rotation===270 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(315)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===315 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">315°</span>
                {rotation===315 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>setRotation(360)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${rotation===360 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">360°</span>
                {rotation===360 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
        </section>
    )
    const menuMorePosition = () => (
        <section>
            <div onClick={()=>handlePositionDropdown(0)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===0 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">0%</span>
                {focusColor.position===0 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(10)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===10 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">10%</span>
                {focusColor.position===10 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(20)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===20 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">20%</span>
                {focusColor.position===20 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(30)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===30 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">30%</span>
                {focusColor.position===30 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(40)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===40 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">40%</span>
                {focusColor.position===40 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(50)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===50 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">50%</span>
                {focusColor.position===50 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(60)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===60 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">60%</span>
                {focusColor.position===60 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(70)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===70 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">70%</span>
                {focusColor.position===70 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(80)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===80 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">80%</span>
                {focusColor.position===80 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(90)} className={`px-2.5 py-0.5 mb-1 rounded cursor-pointer ${focusColor.position===90 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">90%</span>
                {focusColor.position===90 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
            <div onClick={()=>handlePositionDropdown(100)} className={`px-2.5 py-0.5 rounded cursor-pointer ${focusColor.position===100 ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                <span className="font-medium md:text-sm">100%</span>
                {focusColor.position===100 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                )}
            </div>
        </section>
    )
    useEffect(()=>{
        let positionData = colors.map(obj=>obj.position).join(',');
        window.history.pushState('','',`/gradient-maker/${colors.map(obj=>obj.color).join('-')}?position=${positionData}&type=${type}&rotation=${rotation}`);
    },[colors, type, rotation])
    useLayoutEffect(()=>{
        let style = document.querySelector('[data="slider"]');
        let input = document.querySelectorAll('input[type="range"].range-gradient');
        let dataClass = [];
        input.forEach(element=>{
            dataClass.push(`.${element.dataset.class}::-webkit-slider-thumb{ background-color: #${element.dataset.color} }`);
        })
        style.innerHTML = dataClass.join('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[colors]);
    return (
        <Layout title={'Create a Gradient - Palettes'}>
            <Header/>
            <div className="mt-[159px] mb-[100px] max-w-screen-xl mx-auto">
                <h1 className="font-black text-5xl mb-8 text-center tracking-tighter">Gradient Maker</h1>
                <p className="text-center text-xl text-[#7d7c83] mb-[100px]">Create and export beautiful gradients.</p>
                <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-9 px-6 md:px-12 xl:px-20">
                    <div className="flex-1 order-2 md:order-1 border rounded-xl px-8 pt-12 pb-8">
                        <div style={{ backgroundImage: getGradientThumb() }} className="relative h-3 rounded-full mb-12">
                            {colors.map((obj,i)=>(
                            <input onChange={(e)=>handleOnChange(e,i)} value={obj.position} min={0} max={100} onFocus={()=>handleFocus(i)} key={i} data-color={obj.color} data-class={`s${i}`} type="range" className={`w-full s${i} absolute appearance-none bg-transparent -translate-y-[15%] range-gradient focus-within:border-red-100 pointer-events-none outline-none ${focusColor.color===obj.color&&'z-10'}`}/>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-6 mb-12">
                            <div className="w-full lg:basis-[calc(50%-12px)]">
                                <div className="flex items-center justify-between mb-3">
                                    <label htmlFor="color_" className="text-sm font-medium">Color</label>
                                    {colors.length > 2 && (
                                    <button onClick={handleRemoveColor} className="text-blue-500 hover:underline text-sm font-medium">Remove</button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input id="color_" onChange={handleChangeColor} value={`#${focusColor.color.toUpperCase()}`} placeholder={`#${focusColor.color.toUpperCase()}`} type="text" className="w-full border outline-none border-gray-300 hover:border-gray-400 transition focus:border-blue-500 px-4 py-2.5 rounded-lg"/>
                                    <div onClick={()=>setShowPicker(true)} style={{ backgroundColor: `#${colors[focusColor.index].color}` }} className="w-[30px] h-[30px] rounded absolute top-2 right-2 cursor-pointer btn-ref-picker-gradient"></div>
                                    {showPicker && (
                                    <ColorPickerRelative width={272} onChange={handleChangePicker} setState={setShowPicker} color={colors[focusColor.index].color} targetClass={'btn-ref-picker-gradient'}/>
                                    )}
                                </div>
                            </div>
                            <div className="basis-[calc(50%-12px)]">
                                <label htmlFor="position_" className="text-sm font-medium mb-3 block">Position</label>
                                <div className="relative">
                                    <input id="position_" onChange={e=>replacePosition(e.target.value.replace('%',''),focusColor.index)} value={`${focusColor.position}%`} type="text" className="w-full border outline-none border-gray-300 hover:border-gray-400 transition focus:border-blue-500 px-4 py-2.5 rounded-lg text-center font-medium"/>
                                    <button ref={btnMorePosition} onClick={()=>dispatch(setDataMenuMore({ width: 150, elementRef: btnMorePosition.current, Children: menuMorePosition }))} className={`absolute right-0 top-0 border rounded-tr-lg rounded-br-lg border-y-transparent border-r-transparent hover:border-gray-400 transition h-full px-1.5`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="basis-[calc(50%-12px)]">
                                <label htmlFor="rotation_" className="text-sm font-medium mb-3 block">Rotation</label>
                                <div className="relative">
                                    <input id="rotation_" onChange={handleChangeRotation}  value={`${rotation}°`} type="text" className="w-full border outline-none border-gray-300 hover:border-gray-400 transition focus:border-blue-500 px-4 py-2.5 rounded-lg text-center font-medium"/>
                                    <button ref={btnRotationRef} onClick={()=>dispatch(setDataMenuMore({ width: 150, elementRef: btnRotationRef.current, Children: menuMoreRotation }))} className={`absolute right-0 top-0 border rounded-tr-lg rounded-br-lg border-y-transparent border-r-transparent hover:border-gray-400 transition h-full px-1.5`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="w-full lg:basis-[calc(50%-12px)] relative">
                                <p className="text-sm font-medium mb-3">Type</p>
                                <div className={`border divide-gray-300 rounded-tl-lg rounded-tr-lg cursor-pointer border-gray-300 transition relative ${!showMoreType && 'hover:border-gray-400 rounded-lg'}`}>
                                    <div onClick={()=>setShowMoreType(state=>!state)} className="flex px-4 py-2.5 items-center justify-between">
                                        <p className="font-medium first-letter:uppercase">{type}</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    {showMoreType && (
                                    <Fragment>
                                        <div onClick={()=>setShowMoreType(false)} className="fixed top-0 left-0 w-screen h-screen cursor-auto"></div>
                                        <div className="p-2 absolute ring-1 ring-gray-300 w-full z-10 bg-white rounded-bl-lg rounded-br-lg">
                                            <div onClick={()=>{setType('linear');setShowMoreType(false)}} className={`px-2.5 py-1 mb-1 rounded cursor-pointer ${type==='linear' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                                <span className="font-medium text-sm">Linear</span>
                                                {type==='linear' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                )}
                                            </div>
                                            <div onClick={()=>{setType('radial');setShowMoreType(false)}} className={`px-2.5 py-1 rounded cursor-pointer ${type==='radial' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                                <span className="font-medium text-sm">Radial</span>
                                                {type==='radial' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                )}
                                            </div>
                                        </div>
                                    </Fragment>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-8">
                            <button onClick={handleRandomColors} className="flex-1 border rounded-lg border-gray-300 py-2.5 font-medium hover:border-gray-400 transition">Random</button>
                            <div className="flex-1 flex divide-x">
                                <button onClick={handleCopyCSS} className="rounded-tl-lg rounded-bl-lg flex-1 bg-blue-500 hover:bg-blue-600 transition text-white font-medium py-2.5">Copy CSS</button>
                                <div className="relative">
                                    <button ref={btnCopyCSSRef} onClick={()=>dispatch(setDataMenuMore({ width: 222, elementRef: btnCopyCSSRef.current, Children: menuMore }))} className="h-full bg-blue-500 text-white px-3 flex items-center rounded-tr-lg rounded-br-lg hover:bg-blue-600 transition cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ backgroundImage: getGradientPreview() }} className="relative md:flex-1 rounded-xl h-[300px] md:h-auto order-1 md:order-2">
                        <svg onClick={()=>setfullscreenGradient(true)} xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrows-diagonal absolute right-5 top-5 cursor-pointer transition text-gray-500 hover:text-black" width="25" height="25" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <polyline points="16 4 20 4 20 8"></polyline>
                            <line x1="14" y1="10" x2="20" y2="4"></line>
                            <polyline points="8 20 4 20 4 16"></polyline>
                            <line x1="4" y1="20" x2="10" y2="14"></line>
                        </svg>
                    </div>
                    <div style={{ backgroundImage: getGradientPreview() }} className={`fixed w-screen h-screen top-0 left-0 z-50 transition duration-300 ${fullscreenGradient ? 'translate-y-0' : 'translate-y-full'}`}>
                        <svg onClick={()=>setfullscreenGradient(false)} xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 absolute right-9 top-5 bg-white border border-gray-300 cursor-pointer rounded-lg p-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
            </div>
            <Footer/>
        </Layout>
    )
}

export async function getServerSideProps(ctx){
    const { hex, position, type, rotation } = ctx.query;
    const isValid = hex.split('-').map(col=>chroma.valid(col));
    if (!isValid.includes(false)) {
        const colors = hex.split('-');
        const colorObj = [];
        colors.forEach((color,i)=>{
            colorObj.push({ color, position: position ? position.split(',')[i] ? parseInt(position.split(',')[i]) : (100/(colors.length-1))*i : (100/(colors.length-1))*i, index: i })
        });
        if (colorObj.length>=2 && colorObj.length<=10) {
            await axios.post(`${process.env.NEXT_PUBLIC_API}/api/gradients/create`,{
                data: {
                    ...dataCreateGradient(colorObj,type ? type : 'linear',rotation ? parseInt(rotation) : 90)
                }
            })
        }
        return { props: { colorProps: colorObj, typeParam: type ? type : null, rotationParam: rotation ? rotation : null } }
    }else {
        return { notFound: true }
    }
}