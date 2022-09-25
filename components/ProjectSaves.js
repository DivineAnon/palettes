import { useRef, Fragment } from "react";
import { useDispatch } from "react-redux";
import { getGradientPreview } from "../lib";
import { setDataMenuMore, setDataPopupProject, setIdDeleteProject } from "../slices/popupSlice";

export default function ProjectSaves({ data }){
    const dispatch = useDispatch();
    const refMore = useRef(null);
    const handleMenuMore = (menu) => {
        if (menu==='edit') {
            dispatch(setDataPopupProject(data))
        }
        if (menu==='delete') {
            dispatch(setIdDeleteProject(data.id));
        }
    }
    const menuMore = ()=> (
        <Fragment>
            <section>
                <div onClick={()=>handleMenuMore('edit')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                    <span className="md:text-sm font-medium">Edit project</span>
                </div>
                <div onClick={()=>handleMenuMore('delete')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span className="md:text-sm font-medium">Delete Project</span>
                </div>
            </section>
        </Fragment>
    )
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex border rounded-lg overflow-hidden h-[109px] lg:h-[129px]">
                <div className="flex flex-1 flex-col">
                    {data.palettes.palette?.palette ? (
                    <div className="flex-1 flex">
                        {data.palettes.palette.palette.map((hex,i)=>(
                            <div key={i} style={{ backgroundColor: `#${hex}` }} className="flex-1"></div>
                        ))}
                    </div>
                    ) : (
                    <div className="bg-gray-100 flex-1"></div>
                    )}
                    <p className="text-xs p-1.5 text-gray-600 border-r text-center">Palettes <span className="font-semibold">{data.palettes.count}</span></p>
                </div>
                <div className="flex flex-1 flex-col">
                    {data.gradients.gradient?.palette ? (
                        <div style={{ backgroundImage: getGradientPreview(data.gradients.gradient) }} className="flex-1"></div>
                    ) : (
                        <div className="flex-1 bg-gray-200"></div>
                    )}
                    <p className="text-xs p-1.5 text-gray-600 text-center">Gradients <span className="font-semibold">{data.gradients.count}</span></p>
                </div>
                <div className="flex flex-1 flex-col">
                    {data.colors.color ? (
                        <div style={{ background: `#${data.colors.color}` }} className="flex-1"></div>
                    ) : (
                        <div className="flex-1 bg-gray-300"></div>
                    )}
                    <p className="text-xs p-1.5 text-gray-600 border-l text-center">Colors <span className="font-semibold">{data.colors.count}</span></p>
                </div>
            </div>
            <div className="flex items-center justify-between px-2">
                <p className="text-sm font-medium">{data.name}</p>
                <svg ref={refMore} xmlns="http://www.w3.org/2000/svg" onClick={()=>dispatch(setDataMenuMore({ width: 222, elementRef: refMore.current, Children: menuMore }))} className="h-5 w-5 text-[#7d7c83] hover:text-black transition cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
            </div>
        </div>
    )
}