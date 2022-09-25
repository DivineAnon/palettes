import { useRef, useState } from "react";
import ContainerPopup from "./ContainerPopup";
import { savePalettesAsImg } from "../lib";
import { useDispatch, useSelector } from "react-redux";
import { closePopupExportPaletteAsImg, selectDataExportPaletteAsImg, setDataExportPalette, setDataSingleQuickView } from "../slices/popupSlice";

export default function ExportPaletteAsImg(){
    const { origin, palettes } = useSelector(selectDataExportPaletteAsImg);
    const dispatch = useDispatch();
    const paletteToImg = useRef();
    const [showColorSpace, setShowColorSpace] = useState(false);
    const [colorSpace, setColorSpace] = useState('HEX');
    const [title, setTitle] = useState(null);
    const removeBox = (time) => {
        paletteToImg.current.classList.remove('sm:animate-fadeIn');
        paletteToImg.current.classList.remove('animate-translateY');
        paletteToImg.current.classList.add('sm:animate-fadeOut');
        paletteToImg.current.classList.add('animate-translateY-reverse');
        setTimeout(()=>{
            dispatch(closePopupExportPaletteAsImg());
        },time)
    }
    const handleClose = () => {
        removeBox(50);
        if (origin==='exportPalette') {
            dispatch(setDataExportPalette(palettes));
        }else if (origin==='singleQuick'){
            dispatch(setDataSingleQuickView(palettes.join('')));
        }
    }
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={paletteToImg} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[468px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl divide-y">
                <div className="p-3">
                    <svg onClick={handleClose} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 hover:bg-gray-100 transition cursor-pointer p-1.5 rounded-lg absolute top-2 left-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="font-semibold text-center">Export palette as image</h1>
                </div>
                <div className="p-6">
                    <label htmlFor="title_" className="block text-sm font-semibold mb-3">Title</label>
                    <input onChange={e=>setTitle(e.target.value)} id="title_" type="text" className="px-4 py-2.5 rounded-lg border-gray-300 hover:border-gray-400 transition focus:border-blue-500 w-full border outline-none mb-4"/>
                    <label className="block text-sm font-semibold mb-3">Color Space</label>
                    <div className="relative mb-14">
                        {showColorSpace && (
                        <div onClick={()=>setShowColorSpace(false)} className="fixed w-screen h-screen top-0 left-0"></div>
                        )}
                        <div onClick={()=>setShowColorSpace(state=>!state)} className={`border w-full rounded-md shadow-sm transition bg-white divide-y cursor-pointer absolute top-0 left-0 ${!showColorSpace ? 'hover:border-gray-400' : ''}`}>
                            <div className="flex justify-between items-center px-4 py-3">
                                <span className="font-medium text-[15px]">{colorSpace}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {showColorSpace && (
                            <div className="p-2 max-h-[200px] overflow-auto hide-scrollbar">
                                <div onClick={()=>setColorSpace('None')} className={`px-2.5 py-1 mb-1 rounded ${colorSpace==='None' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-[15px]">None</span>
                                    {colorSpace==='None' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>setColorSpace('HEX')} className={`px-2.5 py-1 mb-1 rounded ${colorSpace==='HEX' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-[15px]">HEX</span>
                                    {colorSpace==='HEX' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>setColorSpace('Name')} className={`px-2.5 py-1 mb-1 rounded ${colorSpace==='Name' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-[15px]">Name</span>
                                    {colorSpace==='Name' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>setColorSpace('RGB')} className={`px-2.5 py-1 mb-1 rounded ${colorSpace==='RGB' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-[15px]">RGB</span>
                                    {colorSpace==='RGB' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>setColorSpace('HSB')} className={`px-2.5 py-1 mb-1 rounded ${colorSpace==='HSB' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-[15px]">HSB</span>
                                    {colorSpace==='HSB' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>setColorSpace('HSL')} className={`px-2.5 py-1 mb-1 rounded ${colorSpace==='HSL' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-[15px]">HSL</span>
                                    {colorSpace==='HSL' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>setColorSpace('CMYK')} className={`px-2.5 py-1 mb-1 rounded ${colorSpace==='CMYK' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-[15px]">CMYK</span>
                                    {colorSpace==='CMYK' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>setColorSpace('LAB')} className={`px-2.5 py-1 mb-1 rounded ${colorSpace==='LAB' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-[15px]">LAB</span>
                                    {colorSpace==='LAB' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <button onClick={()=>savePalettesAsImg(palettes, colorSpace, title)} className="block w-full font-semibold text-white bg-blue-500 transition hover:bg-blue-600 py-3 rounded-xl">Export</button>
                </div>
            </div>
        </ContainerPopup>
    )
}