import { Fragment, useEffect, useRef, useState } from "react";
import { Footer, Header, Layout, ColorPickerRelative } from "../../components";
import chroma from "chroma-js";
import { checkContrast } from "../../lib";
import { setDataMenuMore } from "../../slices/popupSlice";

export default function ContrastChecker({ hexArray }){
    const [textColor, setTextColor] = useState(hexArray[0]);
    const [textColorPreview, setTextColorPreview] = useState(`#${hexArray[0]}`);
    const [backgroundColor, setBackgroundColor] = useState(hexArray[1]);
    const [backgroundColorPreview, setBackgroundColorPreview] = useState(`#${hexArray[1]}`);
    const [showPickerText, setShowPickerText] = useState(false);
    const [showPickerBackground, setShowPickerBackground] = useState(false);
    const btnAdjustRef = useRef(null);
    const btnAdjustFix = useRef(null);
    const handleAdjust = (menu) => {
        if (menu==='adjustText') {
            if (chroma(textColor).get('lab.l')<70 && chroma(backgroundColor).get('lab.l')>70){
                setTextColor(chroma(textColor).darken(10).hex().replace('#',''));
                setTextColorPreview(chroma(textColor).darken(10).hex().replace('#',''));
            }
            if (chroma(textColor).get('lab.l')>70 && chroma(backgroundColor).get('lab.l')<70) {
                setTextColor(chroma(textColor).brighten(10).hex().replace('#',''));
                setTextColorPreview(chroma(textColor).brighten(10).hex().replace('#',''));
            }
            if (chroma(textColor).get('lab.l')<70 && chroma(backgroundColor).get('lab.l')<70) {
                setTextColor(chroma(textColor).darken(10).hex().replace('#',''));
                setTextColorPreview(chroma(textColor).darken(10).hex().replace('#',''));
            }
            if (chroma(textColor).get('lab.l')>70 && chroma(backgroundColor).get('lab.l')>70) {
                setTextColor(chroma(textColor).brighten(10).hex().replace('#',''));
                setTextColorPreview(chroma(textColor).brighten(10).hex().replace('#',''));
            }
        }
        if (menu==='adjustBackground') {
            if (chroma(backgroundColor).get('lab.l')<70 && chroma(textColor).get('lab.l')>70){
                setBackgroundColor(chroma(backgroundColor).darken(10).hex().replace('#',''));
                setBackgroundColorPreview(chroma(backgroundColor).darken(10).hex().replace('#',''));
            }
            if (chroma(backgroundColor).get('lab.l')>70 && chroma(textColor).get('lab.l')<70) {
                setBackgroundColor(chroma(backgroundColor).brighten(10).hex().replace('#',''));
                setBackgroundColorPreview(chroma(backgroundColor).brighten(10).hex().replace('#',''));
            }
            if (chroma(backgroundColor).get('lab.l')<70 && chroma(textColor).get('lab.l')<70) {
                setBackgroundColor(chroma(backgroundColor).darken(10).hex().replace('#',''));
                setBackgroundColorPreview(chroma(backgroundColor).darken(10).hex().replace('#',''));
            }
            if (chroma(backgroundColor).get('lab.l')>70 && chroma(textColor).get('lab.l')>70) {
                setBackgroundColor(chroma(backgroundColor).brighten(10).hex().replace('#',''));
                setBackgroundColorPreview(chroma(backgroundColor).brighten(10).hex().replace('#',''));
            }
        }
        if (menu==='adjustBoth') {
            if (chroma(backgroundColor).get('lab.l')<70 && chroma(textColor).get('lab.l')>70){
                setBackgroundColor(chroma(backgroundColor).darken(10).hex().replace('#',''));
                setBackgroundColorPreview(chroma(backgroundColor).darken(10).hex().replace('#',''));
                setTextColor(chroma(textColor).brighten(10).hex().replace('#',''));
                setTextColorPreview(chroma(textColor).brighten(10).hex().replace('#',''));
            }
            if (chroma(backgroundColor).get('lab.l')>70 && chroma(textColor).get('lab.l')<70) {
                setBackgroundColor(chroma(backgroundColor).brighten(10).hex().replace('#',''));
                setBackgroundColorPreview(chroma(backgroundColor).brighten(10).hex().replace('#',''));
                setTextColor(chroma(textColor).darken(10).hex().replace('#',''));
                setTextColorPreview(chroma(textColor).darken(10).hex().replace('#',''));
            }
            if (chroma(backgroundColor).get('lab.l')<70 && chroma(textColor).get('lab.l')<70) {
                setBackgroundColor(chroma(backgroundColor).darken(10).hex().replace('#',''));
                setBackgroundColorPreview(chroma(backgroundColor).darken(10).hex().replace('#',''));
                setTextColor(chroma(textColor).brighten(10).hex().replace('#',''));
                setTextColorPreview(chroma(textColor).brighten(10).hex().replace('#',''));
            }
            if (chroma(backgroundColor).get('lab.l')>70 && chroma(textColor).get('lab.l')>70) {
                setBackgroundColor(chroma(backgroundColor).brighten(10).hex().replace('#',''));
                setBackgroundColorPreview(chroma(backgroundColor).brighten(10).hex().replace('#',''));
                setTextColor(chroma(textColor).darken(10).hex().replace('#',''));
                setTextColorPreview(chroma(textColor).darken(10).hex().replace('#',''));
            }
        }
    }
    const menuMoreAdjust = () => (
        <section>
            <div onClick={()=>handleAdjust('adjustText')} className={`px-3 py-2 rounded-md ${!['ffffff','fff','000000','000'].includes(textColor.toLowerCase()) ? 'cursor-pointer hover:bg-gray-100' : 'text-scondary'}`}>
                <span className="md:text-sm font-medium">Adjust text color</span>
            </div>
            <div onClick={()=>handleAdjust('adjustBackground')} className={`px-3 py-2 rounded-md ${!['ffffff','fff','000000','000'].includes(backgroundColor.toLowerCase()) ? 'cursor-pointer hover:bg-gray-100' : 'text-scondary'}`}>
                <span className="md:text-sm font-medium">Adjust background color</span>
            </div>
            <div onClick={()=>handleAdjust('adjustBoth')} className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <span className="md:text-sm font-medium">Adjust both color</span>
            </div>
        </section>
    )
    const menuMoreAdjustGood = () => (
            <section>
                <div onClick={()=>handleAdjust('adjustText')} className={`px-3 py-2 rounded-md ${!['ffffff','fff','000000','000'].includes(textColor.toLowerCase()) ? 'cursor-pointer hover:bg-gray-100' : 'text-scondary'}`}>
                    <span className="md:text-sm font-medium">Adjust text color</span>
                </div>
                <div onClick={()=>handleAdjust('adjustBackground')} className={`px-3 py-2 rounded-md ${!['ffffff','fff','000000','000'].includes(backgroundColor.toLowerCase()) ? 'cursor-pointer hover:bg-gray-100' : 'text-scondary'}`}>
                    <span className="md:text-sm font-medium">Adjust background color</span>
                </div>
                <div onClick={()=>handleAdjust('adjustBoth')} className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <span className="md:text-sm font-medium">Adjust both color</span>
                </div>
            </section>
    )
    const handleChangeText = (e) => {
        setTextColorPreview(e.target.value);
        if (chroma.valid(e.target.value)) {
            setTextColor(e.target.value.replace('#',''));
        }
    }
    const handleChangeBackground = (e) => {
        setBackgroundColorPreview(e.target.value);
        if (chroma.valid(e.target.value)) {
            setBackgroundColor(e.target.value.replace('#',''));
        }
    }
    useEffect(()=>{
        window.history.pushState('','',`/contrast-checker/${[textColor,backgroundColor].join('-')}`);
    },[textColor,backgroundColor])
    useEffect(()=>{
        setTextColor(hexArray[0]);
        setTextColorPreview(hexArray[0]);
        setBackgroundColor(hexArray[1]);
        setBackgroundColorPreview(hexArray[1]);
    },[hexArray])
    return (
        <Layout title={'Color Contrast Checker - Palettes'}>
            <Header/>
            <div className="mt-[159px] mb-[100px] max-w-screen-xl mx-auto">
                <h1 className="font-black text-5xl mb-8 text-center tracking-tighter px-2">Color Contrast Checker</h1>
                <p className="text-center text-xl text-[#7d7c83] mb-[100px] px-2">Calculate the contrast ratio of text and background colors.</p>
                <div className="px-6 md:px-12 xl:px-20">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex-1 order-2 md:order-1 border border-t-0 md:border-t md:border-r-0 md:rounded-tl-xl rounded-br-xl md:rounded-br-none rounded-bl-xl p-[30px]">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1">
                                    <p className="mb-3 text-sm font-medium">Text color</p>
                                    <div className="relative">
                                        <input value={textColorPreview} onChange={handleChangeText} placeholder={textColor} type="text" className="h-[46px] pr-[50px] w-full px-4 outline-none rounded-lg border border-gray-300 hover:border-gray-400 focus:border-blue-500 transition text-[15px]"/>
                                        <div onClick={()=>setShowPickerText(true)} style={{ backgroundColor: `#${textColor}` }} className="w-[30px] border border-gray-100 h-[30px] rounded absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer btn-picker-ref-text"></div>
                                        {showPickerText && (
                                        <ColorPickerRelative width={272}  onChange={({ hex })=>{setTextColor(hex.replace('#',''));setTextColorPreview(hex)}} color={textColor} setState={setShowPickerText} targetClass={'btn-picker-ref-text'}/>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="mb-3 text-sm font-medium">Background color</p>
                                    <div className="relative">
                                        <input value={backgroundColorPreview} onChange={handleChangeBackground} placeholder={backgroundColor} type="text" className="h-[46px] w-full pr-[50px] px-4 outline-none rounded-lg border border-gray-300 hover:border-gray-400 focus:border-blue-500 transition text-[15px]"/>
                                        <div onClick={()=>setShowPickerBackground(true)} style={{ backgroundColor: `#${backgroundColor}` }} className="w-[30px] border border-gray-100 h-[30px] rounded absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer btn-picker-ref-bg"></div>
                                        {showPickerBackground && (
                                        <ColorPickerRelative width={272}  onChange={({ hex })=>{setBackgroundColor(hex.replace('#',''));setBackgroundColorPreview(hex)}} color={backgroundColor} setState={setShowPickerBackground} targetClass={'btn-picker-ref-bg'}/>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <p className="mb-3 text-sm font-medium">Contrast</p>
                                <div className={`flex items-center justify-between p-[30px] rounded-xl ${checkContrast(textColor,backgroundColor)[1]===1 || checkContrast(textColor,backgroundColor)[1]===2 ? 'bg-[#fbd0da] text-[#5f071c]' : checkContrast(textColor,backgroundColor)[1]===3 ? 'bg-[#fbf5d0] text-[#5f5207]' : checkContrast(textColor,backgroundColor)[1]>3 && 'bg-[#d2fbd0] text-[#0d5f07]'}`}>
                                    <h1 className="font-extrabold text-5xl">{chroma.contrast(textColor,backgroundColor)%1===0 ? chroma.contrast(textColor,backgroundColor) : chroma.contrast(textColor,backgroundColor).toFixed(2)}</h1>
                                    <div className="text-center">
                                        <p className="font-bold mb-2 capitalize">{checkContrast(textColor,backgroundColor)[0].toLowerCase()}</p>
                                        <div className="flex gap-[1px]">
                                            {[1,2,3,4,5].map(i=>(
                                                <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i<=checkContrast(textColor,backgroundColor)[1] ? 'opacity-100' : 'opacity-30'}`} viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className="text-sm flex gap-0.5">
                                    {checkContrast(textColor,backgroundColor)[1]<=2 ? (
                                    <Fragment>
                                        <span>Poor contrast. </span>
                                        <div className="relative">
                                            <button ref={btnAdjustFix} onClick={()=>dispatch(setDataMenuMore({ width: 222, elementRef: btnAdjustFix.current, Children: menuMoreAdjust }))} className="text-blue-500 hover:underline">Click to fix</button>
                                        </div>
                                    </Fragment>
                                    ) : checkContrast(textColor,backgroundColor)[1]<=4 ? (
                                    <Fragment>
                                        <span>Good contrast. </span>
                                        <div className="relative">
                                            <button ref={btnAdjustRef} onClick={()=>dispatch(setDataMenuMore({ width: 222, elementRef: btnAdjustRef.current, Children: menuMoreAdjustGood }))} className="text-blue-500 hover:underline">Click to enhance</button>
                                        </div>
                                    </Fragment>
                                    ) : checkContrast(textColor,backgroundColor)[1]===5 && (
                                    <Fragment>
                                        <span>Great contrast. </span>
                                    </Fragment>
                                    ) }
                                </div>
                            </div>
                        </div>
                        <div style={{ backgroundColor: `#${backgroundColor}`, color: `#${textColor}` }} className="flex-1 order-1 md:order-2 border rounded-tr-xl rounded-tl-xl md:rounded-tl-none md:rounded-br-xl p-[50px] text-center flex flex-col items-center justify-center">
                            <h1 className="mb-[30px] text-4xl font-medium">Quote n. 1</h1>
                            <p>There’s so much comedy on television. Does that cause comedy in the streets?</p>
                            <br/>
                            <h2 className="font-medium">Dick Cavett</h2>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </Layout>
    )
}


export async function getServerSideProps(ctx){
    const { hex } = ctx.query;
    const hexArray = hex.split('-');
    if (!hexArray.map(color=>chroma.valid(color)).includes(false)) {
        return { props: { hexArray } }
    }else {
        return {
            notFound: true
        }
    }
}