import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closePopupFullscreenPalette, selectDataFullscreenPalette } from "../slices/popupSlice";

export default function FullscreenPalette(){
    const { palette, type } = useSelector(selectDataFullscreenPalette);
    const dispatch = useDispatch();
    const containerRef = useRef(null);
    const handleClose = () => {
        containerRef.current.classList.remove('animate-translateY');
        containerRef.current.classList.add('animate-translateY-reverse');
        const timeout = setTimeout(()=>{
            dispatch(closePopupFullscreenPalette());
        },100)
        return ()=> clearTimeout(timeout);
    }
    const getGradientPreview = () => {
        return `${palette.type}-gradient(${palette.type==='linear' ? palette.rotation+'deg' : 'circle'}, ${palette.palette.map(obj=>[`#${obj.color} ${obj.position}%`]).join(',')}`;
    }
    return (
        <div ref={containerRef} className="flex fixed z-[100] top-0 left-0 w-full h-full animate-translateY">
            <button onClick={handleClose} className="absolute z-10 right-5 top-5 bg-white border p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
            </button>
            {type==='palette' ? (
                palette.map((color,i)=>(
                <div key={i} style={{ background: `#${color}`}} className="flex-1"></div>
                ))
            ) : (
                <div style={{ backgroundImage: getGradientPreview()}} className="flex-1"></div>
            )}
        </div>
    )
}