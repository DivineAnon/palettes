import Link from "next/link";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDataDetailPalette, setDataPaletteDetail } from "../slices/popupSlice";
import ContainerPopup from "./ContainerPopup";

export default function PopupPaletteDetail(){
    const data = useSelector(selectDataDetailPalette);
    const elementRef = useRef(null);
    const dispatch = useDispatch();
    const removeBox = (time) => {
        elementRef.current.classList.remove('sm:animate-fadeIn');
        elementRef.current.classList.remove('animate-translateY');
        elementRef.current.classList.add('sm:animate-fadeOut');
        elementRef.current.classList.add('animate-translateY-reverse');
        const close = setTimeout(()=>{
            dispatch(setDataPaletteDetail(null));
        },time);
        return ()=> clearTimeout(close);
    }
    const months = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
    }
    const date = new Date(data.createdAt);
    return (
    <ContainerPopup remove={removeBox}>
        <div ref={elementRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[468px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl flex flex-col divide-y">
            <div className="p-3 relative">
                <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 transition cursor-pointer p-1.5 rounded-lg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <h1 className="font-semibold text-center">Palette details</h1>
            </div>
            <div className="p-6">
                <div className="mb-[35px]">
                    <h1 className="mb-3.5 font-bold">Projects</h1>
                    {data.projects?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {data.projects.map((project)=>(
                            <Link href={'/'} key={project.id}>
                                <a className="bg-gray-200 text-[13px] font-medium px-3 py-1 rounded-md transition hover:bg-gray-300">{project.name}</a>
                            </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">None</p>
                    )}
                </div>
                <div className="mb-[35px]">
                    <h1 className="mb-3.5 font-bold">Collections</h1>
                    {data.collections?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {data.collections.map((collection)=>(
                            <Link href={'/'} key={collection.id}>
                                <a className="bg-gray-200 text-[13px] font-medium px-3 py-1 rounded-md transition hover:bg-gray-300">{collection.name}</a>
                            </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">None</p>
                    )}
                </div>
                <div className="mb-[35px]">
                    <h1 className="mb-3.5 font-bold">Tags</h1>
                    {data.tags?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {data.tags.map((tag,i)=>(
                            <Link href={'/'} key={i}>
                                <a className="bg-gray-200 text-[13px] font-medium px-3 py-1 rounded-md transition hover:bg-gray-300">{tag}</a>
                            </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">None</p>
                    )}
                </div>
                <div className="mb-[35px]">
                    <h1 className="mb-3.5 font-bold">Keywords</h1>
                    <div className="flex flex-wrap gap-2">
                        <Link href={'/'}>
                            <a className="bg-gray-200 text-[13px] font-medium px-3 py-1 rounded-md transition hover:bg-gray-300">{data.palette.colorGroup}</a>
                        </Link>
                    </div>
                </div>
                <p className="text-sm text-gray-500">Created on {months[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</p>
            </div>
        </div>
    </ContainerPopup>
    )
}