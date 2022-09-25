import { useRef, useState } from "react";
import ContainerPopup from "./ContainerPopup";
import { openFullscreen } from "../lib";
import { useDispatch, useSelector } from "react-redux";
import { selectIsolateColor, selectSecondaryInfo, selectZenMode, setIsolateColor, setSecondaryInfo, setZenMode } from "../slices/generatorSlice";
import { setDataShowSettingPalette } from "../slices/popupSlice";

export default function SettingsPalette(){
    const settingsRef = useRef(null);
    const secondaryInfo = useSelector(selectSecondaryInfo);
    const isolateColor = useSelector(selectIsolateColor);
    const zenMode = useSelector(selectZenMode);
    const dispatch = useDispatch();
    const [showScondaryInfo, setShowSecondaryInfo] = useState(false);
    const removeBox = (time) => {
        settingsRef.current.classList.remove('sm:animate-fadeIn');
        settingsRef.current.classList.remove('animate-translateY');
        settingsRef.current.classList.add('sm:animate-fadeOut');
        settingsRef.current.classList.add('animate-translateY-reverse');
        setTimeout(()=>{
            dispatch(setDataShowSettingPalette(null));
        },time)        
    }
    const handleFullScreen = (e) => {
        dispatch(setZenMode(e.target.checked));
        if (e.target.checked) {
            openFullscreen(document.body);
        }else{
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
    }
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={settingsRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[380px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl">
                <div className="relative p-3 border-b">
                    <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 rounded-lg p-1.5 top-2 left-2 transition hover:bg-gray-100 cursor-pointer absolute" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="text-center font-semibold">Settings</h1>
                </div>
                <div className="p-6 relative">
                    <div className="mb-6 mt-2">
                        <p className="font-medium text-sm">Secondary info</p>
                        {showScondaryInfo && (
                        <div onClick={()=>setShowSecondaryInfo(false)} className="fixed w-screen h-screen top-0 left-0"></div>
                        )}
                        <div onClick={()=>setShowSecondaryInfo(state=>!state)} className={`border w-[140px] rounded-md shadow-sm transition bg-white divide-y cursor-pointer absolute top-6 right-6 ${!showScondaryInfo ? 'hover:border-gray-400' : ''}`}>
                            <div className="flex justify-between items-center px-3 py-1.5">
                                <span className="font-medium text-[15px]">{secondaryInfo}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {showScondaryInfo && (
                            <div className="p-1 max-h-[200px]">
                                <div onClick={()=>dispatch(setSecondaryInfo('Name'))} className={`px-2 py-0.5 mb-1 rounded ${secondaryInfo==='Name' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-[15px]">Name</span>
                                    {secondaryInfo==='Name' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setSecondaryInfo('RGB'))} className={`px-2 py-0.5 mb-1 rounded ${secondaryInfo==='RGB' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-[15px]">RGB</span>
                                    {secondaryInfo==='RGB' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setSecondaryInfo('HSB'))} className={`px-2 py-0.5 mb-1 rounded ${secondaryInfo==='HSB' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-[15px]">HSB</span>
                                    {secondaryInfo==='HSB' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setSecondaryInfo('HSL'))} className={`px-2 py-0.5 mb-1 rounded ${secondaryInfo==='HSL' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-[15px]">HSL</span>
                                    {secondaryInfo==='HSL' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setSecondaryInfo('CMYK'))} className={`px-2 py-0.5 mb-1 rounded ${secondaryInfo==='CMYK' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-[15px]">CMYK</span>
                                    {secondaryInfo==='CMYK' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setSecondaryInfo('LAB'))} className={`px-2 py-0.5 mb-1 rounded ${secondaryInfo==='LAB' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-[15px]">LAB</span>
                                    {secondaryInfo==='LAB' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-[14px]">
                        <p className="font-medium text-sm">Isolate color</p>
                        <input checked={isolateColor} onChange={e=>dispatch(setIsolateColor(e.target.checked))} id="remember" type="checkbox" value="" className="w-6 h-6 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 cursor-pointer"/>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">Zen mode</p>
                        <input onClick={()=>dispatch(setDataShowSettingPalette(null))} checked={zenMode} onChange={handleFullScreen} id="remember" type="checkbox" value="" className="w-6 h-6 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 cursor-pointer"/>
                    </div>
                </div>
            </div>
        </ContainerPopup>
    )
}