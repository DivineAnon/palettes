import { GetColorName } from "hex-color-to-color-name";
import { useRef } from "react";
import ContainerPopup from "./ContainerPopup";
import { saveAs } from 'file-saver';
import { handlePushNotif, hexToRgb } from "../lib";
import { useDispatch, useSelector } from "react-redux";
import { closeCodePopup, selectDataCodePopup, setDataExportPalette } from "../slices/popupSlice";

export default function CodePopup(){
    const codePopupRef = useRef(null);
    const dispatch = useDispatch();
    const { view, palettes } = useSelector(selectDataCodePopup);
    const textEditor = useRef(null);
    const removeBox = (time) => {
        codePopupRef.current.classList.remove('sm:animate-fadeIn');
        codePopupRef.current.classList.remove('animate-translateY');
        codePopupRef.current.classList.add('sm:animate-fadeOut');
        codePopupRef.current.classList.add('animate-translateY-reverse');
        setTimeout(()=>{
            dispatch(closeCodePopup());
        },time)
    }
    function getCSSCode(){
        return (
            <>
            <section className="mb-3">
                <span className="text-[#969896]">{"/* CSS HEX */"}</span>
                {palettes.map((palette,i)=>(
                <span className="block" key={i}>--{GetColorName(palette).toLowerCase().split(' ').join('-')}: <span className="text-[#005cc5]">#{palette}</span>;</span>
                ))}
            </section>
            <section className="mb-3">
                <span className="text-[#969896]">{"/* CSS RGB */"}</span>
                {palettes.map((palette,i)=>(
                <span className="block" key={i}>--{GetColorName(palette).toLowerCase().split(' ').join('-')}: <span className="text-[#005cc5]">{`rgb(${hexToRgb(palette).join(', ')})`}</span>;</span>
                ))}
            </section>
            </>
        )
    }
    function getCode(){
        function getObject(){
            let obj = new Object;
            palettes.forEach(palette => {
                let name = GetColorName(palette);
                obj[name] = palette;
            });
            return obj;
        }
        return (
            <>
            <section className="mb-3">
                <span className="text-[#969896]">{"/* CSV */"}</span>
                <span className="block">{palettes.join(',')}</span>
            </section>
            <section className="mb-3">
                <span className="text-[#969896]">{"/* With # */"}</span>
                <span className="block text-[#6f42c1]">{palettes.map(pal=>`#${pal}`).join(', ')}</span>
            </section>
            <section className="mb-3">
                <span className="text-[#969896]">{"/* Array */"}</span>
                <span className="block text-[#6f42c1]">{JSON.stringify(palettes)}</span>
            </section>
            <section className="mb-3">
                <span className="text-[#969896]">{"/* Object */"}</span>
                <span className="block text-[#032f62]">{JSON.stringify(getObject())}</span>
            </section>
            </>
        )
    }
    const handleCopy = () => {
        navigator.clipboard.writeText(textEditor.current.innerText);
        handlePushNotif({ text: 'Copied to the clipboard!', className: 'bg-black', icon: 'checklist' });
        dispatch(closeCodePopup());
    }
    const handleDownload = () => {
        let file = new Blob([textEditor.current.innerText], { type: "text/plain;charset=utf-8" });
        if (view==='css') {
            saveAs(file, 'palettes.css');
        }else {
            saveAs(file, 'palettes.txt');
        }
    }
    const handleClose = () => {
        removeBox(50);
        dispatch(setDataExportPalette(palettes));
    }
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={codePopupRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[468px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl divide-y">
                <div className="p-2.5">
                    <svg onClick={handleClose} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 hover:bg-gray-100 transition cursor-pointer p-1.5 rounded-lg absolute top-1.5 left-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="font-semibold text-center">{view==='css' ? 'CSS' : 'Code'}</h1>
                </div>
                <div className="p-6">
                    <div className="max-h-[300px] overflow-auto border border-gray-300 hover:border-gray-400 transition hide-scrollbar p-3">
                        <code ref={textEditor} className="text-xs select-text">
                            {view==='css' ? getCSSCode() : getCode()}
                        </code>
                    </div>
                </div>
                <div className="p-4 flex gap-3">
                    <button onClick={handleDownload} className="flex-1 border py-2.5 font-semibold rounded-lg hover:border-gray-400 transition">Download</button>
                    <button onClick={handleCopy} className="flex-1 bg-blue-500 text-white py-2.5 font-semibold rounded-lg hover:bg-blue-600 transition">Copy</button>
                </div>
            </div>
        </ContainerPopup>
    )
}