import { copyColor, handlePushNotif, lightOrDark, saveGradientAsImg } from "../lib";
import { Fragment, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { handleSaveGradient, setDataFullscreenPalette, setDataMenuMore, setDataShowCSSGradient } from "../slices/popupSlice";
import { selectCopyPaletteIndex, setCopyPaletteIndex } from "../slices/globalSlice";

export default function PaletteGradient({ palette }){
    const copyPaletteIndex = useSelector(selectCopyPaletteIndex);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const refMore = useRef(null);
    const handleMenuMore = (menu) => {
        if (menu==='openGradient') {
            window.open(`/gradient-maker/${palette.palette.join('-')}`);
        }
        if (menu==='openGenerator') {
            window.open(`/${palette.palette.join('-')}`);
        }
        if (menu==='copyURL') {
            navigator.clipboard.writeText(window.location.origin+`/palette/${palette.palette.join('-')}`);
            handlePushNotif({ text: 'URL copied to the clipboard!', className: 'bg-black', icon: 'checklist' })
        }
        if (menu==='copyCSS') {
            const gradient = {
                rotation: palette.rotation,
                type: palette.type
            };
            gradient['color_position'] = palette.palette;
            dispatch(setDataShowCSSGradient(gradient));
        }
        if (menu==='downloadIMG'){
            const data = {
                rotation: 90,
                colors: palette.palette.map((color,i)=>({ pos: 1*i, color: `#${color}` }))
            }
            saveGradientAsImg('linear',data,'gradient');
        }
        if (menu==='fullscreen') {
            dispatch(setDataFullscreenPalette(palette,'gradient'));
        }
        if (menu==='save') {
            dispatch(handleSaveGradient(user,palette,'save',null,'list'));
        }
    }
    const menuMore = ()=> (
        <Fragment>
            <section className="mb-2">
                <div onClick={()=>handleMenuMore('openGradient')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                    <span className="md:text-sm font-medium">Open in the editor</span>
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
            </section>
            <section className="pt-2 mb-2">
                <div onClick={()=>handleMenuMore('copyURL')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="md:text-sm font-medium">Copy URL</span>
                </div>
                <div onClick={()=>handleMenuMore('copyCSS')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <span className="md:text-sm font-medium">Copy CSS code</span>
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
                <div onClick={()=>handleMenuMore('downloadIMG')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="md:text-sm font-medium">Download as image</span>
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
    const getGradientPreview = () => {
        return `${palette.type}-gradient(${palette.type==='linear' ? palette.rotation+'deg' : 'circle'}, ${palette.palette.map(obj=>[`#${obj.color} ${obj.position}%`]).join(',')}`;
    }
    return (
        <div className='flex flex-col gap-1.5'>
            <div className='h-[104px] lg:h-[124px] flex rounded-xl overflow-hidden border border-gray-100 relative parent-gradient'>
                <div style={{ backgroundImage: getGradientPreview() }} className="layer absolute top-0 left-0 w-full h-full z-10 cursor-pointer transition"></div>
                {palette.palette.map(obj=>obj.color).map((color,i)=>(
                <div onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} key={i} onClick={()=>{copyColor(color);dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: `#${color}` }} className='cursor-pointer transition-all flex-1 hover:basis-20 relative group'>
                    <span className={`absolute opacity-0 group-hover:opacity-100 transition left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-semibold uppercase text-[15px] ${lightOrDark(color)==='light' ? 'text-black' : 'text-white'}`}>{copyPaletteIndex===i ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-scale-check" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    ) : color}</span>
                </div>
                ))}
            </div>
            <div className='flex gap-2 items-center justify-end px-2'>
                <div onClick={()=>dispatch(handleSaveGradient(user,palette,'save',null,'list'))} className='flex items-center gap-0.5 text-[#7d7c83] hover:text-black transition cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className='text-sm font-medium'>{palette.saveCount}</span>
                </div>
                <div className='relative'>
                    <svg ref={refMore} xmlns="http://www.w3.org/2000/svg" onClick={()=>dispatch(setDataMenuMore({ width: 222, elementRef: refMore.current, Children: menuMore }))} className="h-5 w-5 text-[#7d7c83] hover:text-black transition cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}