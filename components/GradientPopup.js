import { Fragment, useRef, useState } from "react";
import ContainerPopup from "./ContainerPopup";
import Router from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import { closePopupViewGradient, handleSaveGradient, selectDataMenuMore, selectDataPopupViewGradient, setDataMenuMore, setDataShowCSSGradient } from "../slices/popupSlice";
import { selectUser } from "../slices/userSlice";

export default function GradientPopup(){
    const gradientRef = useRef(null);
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const { palettes } = useSelector(selectDataPopupViewGradient);
    const showMenuMore = useSelector(selectDataMenuMore);
    const [fullscreenGradient, setfullscreenGradient] = useState(false);
    const btnMoreRef = useRef(null);
    const removeBox = (time) => {
        gradientRef.current.classList.remove('sm:animate-fadeIn');
        gradientRef.current.classList.remove('animate-translateY');
        gradientRef.current.classList.add('sm:animate-fadeOut');
        gradientRef.current.classList.add('animate-translateY-reverse');
        setTimeout(()=>{
            dispatch(closePopupViewGradient());
        },time)
    }
    const getGradient = () => {
        const gradient = [];
        palettes.forEach(palette => {
            gradient.push(`#${palette}`);
        });
        return `linear-gradient(90deg, ${gradient.join(', ')})`;
    }
    const menuMore = ()=> (
        <Fragment>
            <section className="mb-2">
                <div onClick={()=>handleMenuMore('edit')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg  xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span className="md:text-sm font-medium">Edit gradient</span>
                </div>
                <div onClick={()=>handleMenuMore('fullscreen')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
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
                <div onClick={()=>handleMenuMore('copyCSS')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <span className="md:text-sm font-medium">Copy CSS</span>
                </div>
                <div onClick={()=>handleMenuMore('save')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="md:text-sm font-medium">Save gradient</span>
                </div>
            </section>
        </Fragment>
    )
    const handleMenuMore = (menu) => {
        if (menu==='edit') {
            Router.push(`/gradient-maker/${palettes.join('-')}`);
            dispatch(closePopupViewGradient());
        }else if (menu==='fullscreen') {
            setfullscreenGradient(true);
        }else if (menu==='copyCSS') {
            const data = {
                rotation: 90,
                type: 'linear'
            };
            data['color_position'] = palettes.map((color,i)=>({ color, position: (100/(palettes.length-1))*i }));
            console.log(data,'popup')
            removeBox(50);
            dispatch(setDataShowCSSGradient(data));
        }else if (menu==='save') {
            const palette = palettes.map((color,i)=>({ color, index: i, position: (100/(palettes.length-1)) * i }))
            removeBox(50);
            dispatch(handleSaveGradient(user,{ type: 'linear', rotation: 90, palette },'save'));
        }
    }
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={gradientRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[660px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl divide-y">
                <div className="flex justify-between items-center p-2">
                    <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 hover:bg-gray-100 transition cursor-pointer p-1.5 rounded-lg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="font-semibold">Palette Gradient</h1>
                    <div className="relative">
                        <svg ref={btnMoreRef} onClick={()=>dispatch(setDataMenuMore({ width: 222, elementRef: btnMoreRef.current, Children: menuMore }))} xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition cursor-pointer p-1.5 rounded-lg ${showMenuMore?.elementRef===btnMoreRef?.current ? 'bg-gray-100' : 'hover:bg-gray-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                    </div>
                </div>
                <div className="p-6">
                    <div style={{ backgroundImage: getGradient() }} className="h-[400px] w-full"></div>
                </div>
            </div>
            <div style={{ backgroundImage: getGradient() }} className={`fixed w-screen h-screen top-0 left-0 transition duration-300 ${fullscreenGradient ? 'translate-y-0' : 'translate-y-full'}`}>
                <svg onClick={()=>setfullscreenGradient(false)} xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 absolute right-5 top-5 bg-white border border-gray-300 cursor-pointer rounded-lg p-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        </ContainerPopup>
    )
}