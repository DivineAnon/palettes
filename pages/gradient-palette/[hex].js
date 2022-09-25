import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Footer, Header, Layout, Palette, ColorPickerRelative } from "../../components";
import chroma from "chroma-js";
import Link from 'next/link';
import axios from "axios";
import { copyColor, dataCreatePalette, lightOrDark } from "../../lib";
import { useDispatch, useSelector } from "react-redux";
import { selectPalettes, setPalettes } from "../../slices/palettesSlice";
import { handleSavePalette, setDataExportPalette, setDataMenuMore } from "../../slices/popupSlice";
import { selectUser } from "../../slices/userSlice";
import { selectCopyPaletteIndex, setCopyPaletteIndex } from "../../slices/globalSlice";

export default function GradientPalette({ colStartEnd, gradients, examples }){
    const dispatch = useDispatch();
    const palettes = useSelector(selectPalettes);
    const user = useSelector(selectUser);
    const copyPaletteIndex = useSelector(selectCopyPaletteIndex);
    const [colorGradient, setColorGradient] = useState(gradients);
    const [startColor, setStartColor] = useState(colStartEnd[0]);
    const [endColor, setEndColor] = useState(colStartEnd[1]);
    const [startColorPreview, setStartColorPreview] = useState(`#${colStartEnd[0]}`);
    const [endColorPreview, setEndColorPreview] = useState(`#${colStartEnd[1]}`);
    const [lengthColor, setLengthColor] = useState(gradients.length);
    const [lengthColorPreview, setLengthColorPreview] = useState(gradients.length);
    const [showPickerStart, setShowPickerStart] = useState(false);
    const [showPickerEnd, setShowPickerEnd] = useState(false);
    const btnMoreRef = useRef(null);
    const handleChangeStart = (e) => {
        setStartColorPreview(e.target.value);
        if (chroma.valid(e.target.value)) {
            setStartColor(e.target.value.replace('#',''));
        }
    }
    const handleChangeEnd = (e) => {
        setEndColorPreview(e.target.value);
        if (chroma.valid(e.target.value)) {
            setEndColor(e.target.value.replace('#',''));
        }
    }
    const handleChangeColorLength = (action) => {
        if (action==='inc') {
            setLengthColor(length=>length<30 ? length+1 : length);
            setLengthColorPreview(length=>length<30 ? length+1 : length);
        }
        if (action==='dec') {
            setLengthColor(length=>length>2 ? length-1 : length);
            setLengthColorPreview(length=>length>2 ? length-1 : length);
        }
    }
    const listenFocusOut = (e) => {
        if (e.path[0].value<2) {
            setLengthColor(2);
            setLengthColorPreview(2);
        }else if (e.path[0].value>30) {
            setLengthColor(30);
            setLengthColorPreview(30);
        }else {
            setLengthColor(parseInt(e.path[0].value));
            setLengthColorPreview(parseInt(e.path[0].value));
        }
    }
    const handleMenuMore = (menu) => {
        if (menu==='openGenerator') {
            if (colorGradient.length>10) {
                window.open(`/${chroma.scale([startColor,endColor]).colors(10).map(color=>color.replace('#','')).join('-')}`);
            }else {
                window.open(`/${colorGradient.join('-')}`);
            }
        }
        if (menu==='gradient') {
            window.open(`/gradient-maker/${[startColor,endColor].join('-')}`);
        }
        if (menu==='save'){
            dispatch(handleSavePalette(user,colorGradient.length>10 ? chroma.scale([startColor,endColor]).colors(10).map(hex=>hex.slice(1)) : colorGradient,'save'));
        }
    }
    const menuMore = ()=> (
        <Fragment>
            <section className="text-black">
                <div onClick={()=>handleMenuMore('save')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="md:text-sm font-medium">Save palette</span>
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
                <div onClick={()=>handleMenuMore('gradient')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                    <span className="md:text-sm font-medium">Make gradient</span>
                </div>
            </section>
        </Fragment>
    )
    const changeLengthColorInput = (e) => {
        setLengthColorPreview(e.target.value);
        e.target.addEventListener('focusout',listenFocusOut);
        return () => e.target.removeEventListener('focusout',listenFocusOut);
    }
    useEffect(()=>{
        setColorGradient(chroma.scale([startColor,endColor]).colors(lengthColor).map(color=>color.replace('#','')));
        window.history.pushState('','',`/gradient-palette/${[startColor,endColor].join('-')}?number=${lengthColor}`);
    },[startColor,endColor,lengthColor])
    useLayoutEffect(()=>{
        dispatch(setPalettes({ data: examples, meta: { pagination: { page: 1 } } }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <Layout title={'Create a Gradient palette - Palettes'}>
            <Header/>
            <div className="mt-[159px] mb-[100px] max-w-screen-xl mx-auto">
                <h1 className="font-black text-5xl mb-8 text-center tracking-tighter">Gradient Palette</h1>
                <p className="text-center text-xl text-[#7d7c83] mb-[100px]">Create a gradient palette between two colors.</p>
                <div className="px-6 md:px-12 xl:px-20">
                    <div className="h-[180px] mb-10 lg:h-[300px] flex rounded-2xl overflow-hidden">
                        {colorGradient.map((color,i)=>(
                        <div onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} key={i} onClick={()=>{copyColor(color);dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: `#${color}` }} className='cursor-pointer transition-all flex-[1] hover:basis-20 relative group'>
                            <span className={`absolute opacity-0 group-hover:opacity-100 transition left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-semibold uppercase text-[15px] ${lightOrDark(color)==='light' ? 'text-black' : 'text-white'}`}>{copyPaletteIndex===i ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-scale-check" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : color}</span>
                        </div>
                        ))}
                    </div>
                    <div className="border rounded-2xl flex flex-col lg:flex-row gap-6 p-[30px]">
                        <div className="flex gap-6 flex-col sm:flex-row lg:flex-[1]">
                            <div className="flex-1">
                                <p className="mb-3 text-sm font-medium">Start color</p>
                                <div className="relative">
                                    <input value={startColorPreview.toUpperCase()} onChange={handleChangeStart} type="text" className="h-[46px] pr-[50px] w-full px-4 outline-none rounded-lg border border-gray-300 hover:border-gray-400 focus:border-blue-500 transition text-[15px]"/>
                                    <div onClick={()=>setShowPickerStart(true)} style={{ backgroundColor: `#${startColor}` }} className="w-[30px] h-[30px] rounded border border-gray-100 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer btn-picker-ref-gradStart"></div>
                                    {showPickerStart && (
                                    <ColorPickerRelative width={272} onChange={({ hex })=>{setStartColor(hex.replace('#',''));setStartColorPreview(hex)}} color={startColor} setState={setShowPickerStart} targetClass={'btn-picker-ref-gradStart'}/>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="mb-3 text-sm font-medium">End color</p>
                                <div className="relative">
                                    <input value={endColorPreview.toUpperCase()} onChange={handleChangeEnd} type="text" className="h-[46px] w-full pr-[50px] px-4 outline-none rounded-lg border border-gray-300 hover:border-gray-400 focus:border-blue-500 transition text-[15px]"/>
                                    <div onClick={()=>setShowPickerEnd(true)} style={{ backgroundColor: `#${endColor}` }} className="w-[30px] h-[30px] rounded border border-gray-100 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer btn-picker-ref-gradEnd"></div>
                                    {showPickerEnd && (
                                    <ColorPickerRelative width={272} onChange={({ hex })=>{setEndColor(hex.replace('#',''));setEndColorPreview(hex)}} color={endColor} setState={setShowPickerEnd} targetClass={'btn-picker-ref-gradEnd'}/>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-6 flex-col sm:flex-row lg:flex-[1]">
                            <div className="flex-1">
                                <p className="mb-3 text-sm font-medium">Number of colors</p>
                                <div className="relative">
                                    <input onChange={changeLengthColorInput} type="number" value={lengthColorPreview} className="h-[46px] w-full text-center number px-4 outline-none hover:z-[1] focus:z-[1] relative bg-transparent rounded-lg border border-gray-300 hover:border-gray-400 focus:border-blue-500 transition text-[15px]"/>
                                    <div className="absolute h-full flex flex-col right-0 top-0 group">
                                        <button onClick={()=>handleChangeColorLength('inc')} className={`px-1.5 flex-1 border-l border-t border-r rounded-tr-lg border-gray-300 transition ${lengthColor<30 ? 'hover:border-gray-400' : 'text-scondary cursor-default'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                            </svg>
                                        </button>
                                        <div className="w-full h-[1px] bg-gray-300 transition group-hover:bg-gray-400"></div>
                                        <button onClick={()=>handleChangeColorLength('dec')} className={`px-1.5 flex-1 border-l border-b border-r rounded-br-lg transition border-gray-300 ${lengthColor>2 ? 'hover:border-gray-400' : 'text-scondary cursor-default'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button onClick={()=>{setStartColor(chroma.random().hex().replace('#',''));setEndColor(chroma.random().hex().replace('#',''))}} className="h-[46px] mt-5 sm:mt-0 w-full rounded-lg sm:flex-1 border border-gray-300 transition hover:border-gray-400 self-end font-semibold">Random</button>
                        </div>
                        <div className="flex w-full mt-5 lg:mt-0 lg:flex-[0.5] h-[46px] divide-x self-end text-white">
                            <button onClick={()=>dispatch(setDataExportPalette(colorGradient))} className="font-semibold rounded-tl-lg rounded-bl-lg bg-blue-500 hover:bg-blue-600 transition flex-1">Export</button>
                            <div className="relative">
                                <button ref={btnMoreRef} onClick={()=>dispatch(setDataMenuMore({ width: 222, elementRef: btnMoreRef.current, Children: menuMore }))} className="px-2.5 h-full rounded-tr-lg rounded-br-lg bg-blue-500 hover:bg-blue-600 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-[120px]">
                        <h1 className="text-center font-extrabold tracking-tighter text-2xl">Example palettes</h1>
                        <div className='grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] mt-[60px] md:mt-[100px] gap-x-8 gap-y-6'>
                            {palettes?.data.map((palette,i)=>(
                            <Palette key={i} index={i} data={palette}/>
                            ))}
                        </div>
                        <Link href={'/palettes/popular/gradient'}>
                            <a className="px-5 mt-20 py-2.5 rounded-lg border transition border-gray-300 hover:border-gray-400 font-bold block mx-auto w-max">
                                Browse more gradient palettes
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer/>
        </Layout>
    )
}

export async function getServerSideProps(ctx){
    const { hex, number } = ctx.query;
    let colStartEnd = hex.split('-');
    if (colStartEnd.length>2) {
        colStartEnd = colStartEnd.splice(0,2);
    }
    if (!colStartEnd.map(color=>chroma.valid(color)).includes(false)) {
        const gradients = chroma.scale(colStartEnd).colors(number ? number<=2 ? 2 : number>30 ? 30 : number : 5).map(color=>color.replace('#',''));
        const examplePalettes = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/palettes/gradient-feed`);
        if (gradients.length>=2 && gradients.length<=10) {
            await axios.post(`${process.env.NEXT_PUBLIC_API}/api/palettes/create`,{
                data: {
                    ...dataCreatePalette(gradients.join('-'),'Gradient')
                }
            })
        }
        return { props: { colStartEnd, gradients, examples: examplePalettes.data } }
    }else {
        return { notFound: true }
    }
}