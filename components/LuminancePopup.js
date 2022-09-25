import { useRef, useState } from "react";
import ContainerPopup from "./ContainerPopup";
import { lightOrDark, getLuminance, getGray } from "../lib";
import { useDispatch, useSelector } from "react-redux";
import { closePopupLuminance, selectDataPopupLuminance, setDataMenuMore } from "../slices/popupSlice";

export default function LuminancePopup(){
    const luminanceRef = useRef(null);
    const { palettes } = useSelector(selectDataPopupLuminance);
    const dispatch = useDispatch();
    const [showMore, setShowMore] = useState(false);
    const btnMoreRef = useRef(null);
    const [fullscreenGradient, setfullscreenGradient] = useState(false);
    const removeBox = (time) => {
        luminanceRef.current.classList.remove('sm:animate-fadeIn');
        luminanceRef.current.classList.remove('animate-translateY');
        luminanceRef.current.classList.add('sm:animate-fadeOut');
        luminanceRef.current.classList.add('animate-translateY-reverse');
        setTimeout(()=>{
            dispatch(closePopupLuminance());
        },time)
    }
    const menuMore = ()=> (
        <section>
            <div onClick={()=>{setfullscreenGradient(true);setShowMore(false)}} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
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
    )
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={luminanceRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[660px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl divide-y">
                <div className="flex justify-between items-center p-2">
                    <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 hover:bg-gray-100 transition cursor-pointer p-1.5 rounded-lg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="font-semibold">Palette Luminance</h1>
                    <div className="relative">
                        <svg ref={btnMoreRef} onClick={()=>dispatch(setDataMenuMore({ width: 222, elementRef: btnMoreRef.current, Children: menuMore }))} xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition cursor-pointer p-1.5 rounded-lg ${showMore ? 'bg-gray-100' : 'hover:bg-gray-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                    </div>
                </div>
                <div className="p-6">
                    <div className="h-[400px] flex">
                        {palettes.map((palette,i)=>(
                        <div key={i} style={{ backgroundColor: getGray(palette) }} className="flex-1 flex items-center justify-center">
                            <span className={`font-semibold text-sm ${lightOrDark(palette)==='light' ? 'text-black' : 'text-white'}`}>{Math.round(getLuminance(palette)*100)}%</span>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={`fixed w-screen h-screen top-0 left-0 transition flex duration-300 ${fullscreenGradient ? 'translate-y-0' : 'translate-y-full'}`}>
                {palettes.map((palette,i)=>(
                <div key={i} style={{ backgroundColor: getGray(palette) }} className="flex-1 flex items-center justify-center">
                    <span className={`font-semibold text-sm ${lightOrDark(palette)==='light' ? 'text-black' : 'text-white'}`}>{Math.round(getLuminance(palette)*100)}%</span>
                </div>
                ))}
                <svg onClick={()=>setfullscreenGradient(false)} xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 absolute right-5 top-5 bg-white border border-gray-300 cursor-pointer rounded-lg p-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </ContainerPopup>
    )
}