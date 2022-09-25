import { useRef } from "react";
import ContainerPopup from "./ContainerPopup";
import { saveAs } from 'file-saver';
import chroma from "chroma-js";
import { useDispatch, useSelector } from "react-redux";
import { selectDataShowCSSGradient, setDataShowCSSGradient } from "../slices/popupSlice";
import { handlePushNotif } from "../lib";

export default function PopupCSSGradient(){
    const dispatch = useDispatch();
    const { color_position, type, rotation } = useSelector(selectDataShowCSSGradient);
    const codePopupRef = useRef(null);
    const textEditor = useRef(null);
    const removeBox = (time) => {
        codePopupRef.current.classList.remove('sm:animate-fadeIn');
        codePopupRef.current.classList.remove('animate-translateY');
        codePopupRef.current.classList.add('sm:animate-fadeOut');
        codePopupRef.current.classList.add('animate-translateY-reverse');
        setTimeout(()=>{
            dispatch(setDataShowCSSGradient(null));
        },time)
    }
    function getCSSCode(){
        return (
            <section className="mb-3 flex flex-col gap-2">
                {[1,2,3].map(num=>(
                <span key={num} className="block"><span className="text-blue-500">background</span>: {num===1 ? `${type}-gradient` : num===2 ? `-moz-${type}-gradient` : `-webkit-${type}-gradient` }({Number(rotation) ? <span className="text-blue-500">{rotation}deg</span> : rotation}, {color_position.map((obj,i)=>(
                <span key={i} className={i!==color_position.length-1 ? 'mr-1' : 'mr-0'}>
                    <span className="mr-1">hsla(
                        {chroma(obj.color).get('hsl').map((value,i)=>(
                            <span key={i} className="text-blue-500">{i===0 ? Math.round(value) : i!== 3 ? `${Math.round(value*100)}%` : value}{i!==chroma(obj.color).get('hsl').length-1 && <span className="text-black">, </span>}</span>
                        ))}
                    )</span>
                    <span className="text-blue-500">{Math.floor(obj.position)}%</span>
                    {i!==color_position.length-1 && ','}
                </span>
                ))});</span>
                ))}
            </section>
        )
    }
    const handleCopy = () => {
        navigator.clipboard.writeText(textEditor.current.innerText);
        handlePushNotif({ text: 'Copied to the clipboard!', className: 'bg-black', icon: 'checklist' });
        dispatch(setDataShowCSSGradient(null));
    }
    const handleDownload = () => {
        let file = new Blob([textEditor.current.innerText], { type: "text/plain;charset=utf-8" });
        saveAs(file, 'gradient.css');
    }
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={codePopupRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[468px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl divide-y">
                <div className="p-2.5">
                    <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 hover:bg-gray-100 transition cursor-pointer p-1.5 rounded-lg absolute top-1.5 left-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="font-semibold text-center">Gradient CSS</h1>
                </div>
                <div className="p-6">
                    <div className="max-h-[300px] overflow-auto border border-gray-300 hover:border-gray-400 transition hide-scrollbar p-3">
                        <code ref={textEditor} className="text-xs select-text">
                            {getCSSCode()}
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