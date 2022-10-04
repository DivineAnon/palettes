import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePushNotif } from "../lib";
import { closePopupExportPalette, selectDataExportPalette, setDataCodePopup, setDataExportPaletteAsImg } from "../slices/popupSlice";
import ContainerPopup from "./ContainerPopup";

export default function ExportPalettePopup(){
    const exportRef = useRef(null);
    const dispatch = useDispatch();
    const handlePushNotif = usePushNotif();
    const { palettes } = useSelector(selectDataExportPalette);
    const removeBox = (time) => {
        exportRef.current.classList.remove('sm:animate-fadeIn');
        exportRef.current.classList.remove('animate-translateY');
        exportRef.current.classList.add('sm:animate-fadeOut');
        exportRef.current.classList.add('animate-translateY-reverse');
        setTimeout(()=>{
            dispatch(closePopupExportPalette());
        },time)
    }
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.origin+`/${[...palettes].splice(0,10).join('-')}`);
        handlePushNotif({ text: 'URL copied to the clipboard!', className: 'bg-black', icon: 'checklist' });
        dispatch(closePopupExportPalette());
    }
    const handleShow = (option) => {
        removeBox(50);
        if (option==='css') {
            dispatch(setDataCodePopup('css',palettes));
        }else if (option==='code') {
            dispatch(setDataCodePopup('code',palettes));
        }else if (option==='exportAsImg') {
            dispatch(setDataExportPaletteAsImg(palettes,'exportPalette'));
        }
    }
    console.log(palettes)
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={exportRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[468px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl divide-y">
                <div className="p-2.5">
                    <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 hover:bg-gray-100 transition cursor-pointer p-1.5 rounded-lg absolute top-1.5 left-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="font-semibold text-center">Export Palette</h1>
                </div>
                <div className="p-6 flex gap-3">
                    <div onClick={handleCopyLink} className="bg-gray-100 hover:bg-blue-100 cursor-pointer transition hover:text-blue-500 flex-1 p-5 flex flex-col gap-4 items-center rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span className="font-medium text-sm">URL</span>
                    </div>
                    <div onClick={()=>handleShow('css')} className="bg-gray-100 hover:bg-blue-100 cursor-pointer transition hover:text-blue-500 flex-1 p-5 flex flex-col gap-4 items-center rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-css3" width="36" height="36" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M20 4l-2 14.5l-6 2l-6 -2l-2 -14.5z"></path>
                            <path d="M8.5 8h7l-4.5 4h4l-.5 3.5l-2.5 .75l-2.5 -.75l-.1 -.5"></path>
                        </svg>
                        <span className="font-medium text-sm">CSS</span>
                    </div>
                    <div onClick={()=>handleShow('code')} className="bg-gray-100 hover:bg-blue-100 cursor-pointer transition hover:text-blue-500 flex-1 p-5 flex flex-col gap-4 items-center rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-file-earmark-code" viewBox="0 0 16 16">
                            <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                            <path d="M8.646 6.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 9 8.646 7.354a.5.5 0 0 1 0-.708zm-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 9l1.647-1.646a.5.5 0 0 0 0-.708z"/>
                        </svg>
                        <span className="font-medium text-sm">Code</span>
                    </div>
                    <div onClick={()=>handleShow('exportAsImg')} className="bg-gray-100 hover:bg-blue-100 cursor-pointer transition hover:text-blue-500 flex-1 p-5 flex flex-col gap-4 items-center rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium text-sm">Image</span>
                    </div>

                </div>
            </div>
        </ContainerPopup>
    )
}