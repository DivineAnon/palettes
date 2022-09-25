import { useRef } from "react"
import { useDispatch, useSelector } from "react-redux";
import { selectHue, selectLuminosity, setHue, setLuminosity } from "../slices/generatorSlice";
import { setDataShowGenerateMethod } from "../slices/popupSlice";
import ContainerPopup from "./ContainerPopup";

export default function GenerateMethod(){
    const generateRef = useRef(null);
    const hue = useSelector(selectHue);
    const luminosity = useSelector(selectLuminosity);
    const dispatch = useDispatch();
    const removeBox = (time) => {
        generateRef.current.classList.remove('sm:animate-fadeIn');
        generateRef.current.classList.remove('animate-translateY');
        generateRef.current.classList.add('sm:animate-fadeOut');
        generateRef.current.classList.add('animate-translateY-reverse');
        setTimeout(()=>{
            dispatch(setDataShowGenerateMethod(null));
        },time)
    }
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={generateRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[480px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl divide-y">
                <div className="p-2.5">
                    <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 hover:bg-gray-100 transition cursor-pointer p-1.5 rounded-lg absolute top-1.5 left-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="font-semibold text-center">Generate Method</h1>
                </div>
                <div className="p-6">
                    <div className="border rounded-lg flex divide-x">
                        <div className="flex-1">
                            <h1 className="text-xs font-semibold mb-2 text-center border-b py-2">Luminosity</h1>
                            <div className="p-2">
                                <div onClick={()=>dispatch(setLuminosity('random'))} className={`px-2 py-0.5 mb-1 rounded cursor-pointer flex justify-between items-center ${luminosity==='random' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-sm">Random</span>
                                    {luminosity==='random' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setLuminosity('bright'))} className={`px-2 py-0.5 mb-1 rounded cursor-pointer ${luminosity==='bright' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-sm">Bright</span>
                                    {luminosity==='bright' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setLuminosity('light'))} className={`px-2 py-0.5 mb-1 rounded cursor-pointer ${luminosity==='light' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-sm">Light</span>
                                    {luminosity==='light' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setLuminosity('dark'))} className={`px-2 py-0.5 mb-1 rounded cursor-pointer ${luminosity==='dark' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-sm">Dark</span>
                                    {luminosity==='dark' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xs font-semibold mb-2 text-center border-b py-2">Hue</h1>
                            <div className="p-2">
                                <div onClick={()=>dispatch(setHue('random'))} className={`px-2 py-0.5 mb-1 rounded cursor-pointer ${hue==='random' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-sm">Random</span>
                                    {hue==='random' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setHue('monochrome'))} className={`px-2 py-0.5 mb-1 rounded cursor-pointer ${hue==='monochrome' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-sm">Monochrome</span>
                                    {hue==='monochrome' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setHue('red'))} className={`px-2 py-0.5 mb-1 rounded cursor-pointer ${hue==='red' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-sm">Red</span>
                                    {hue==='red' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setHue('orange'))} className={`px-2 py-0.5 mb-1 rounded cursor-pointer ${hue==='orange' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-sm">Orange</span>
                                    {hue==='orange' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setHue('yellow'))} className={`px-2 py-0.5 mb-1 rounded cursor-pointer ${hue==='yellow' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-sm">Yellow</span>
                                    {hue==='yellow' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setHue('green'))} className={`px-2 py-0.5 mb-1 rounded cursor-pointer ${hue==='green' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-sm">Green</span>
                                    {hue==='green' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setHue('blue'))} className={`px-2 py-0.5 mb-1 rounded cursor-pointer ${hue==='blue' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-sm">Blue</span>
                                    {hue==='blue' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setHue('purple'))} className={`px-2 py-0.5 mb-1 rounded cursor-pointer ${hue==='purple' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-sm">Purple</span>
                                    {hue==='purple' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                                <div onClick={()=>dispatch(setHue('pink'))} className={`px-2 py-0.5 mb-1 rounded cursor-pointer ${hue==='pink' ? 'bg-blue-100 hover:bg-blue-200/70 text-blue-400 flex justify-between items-center' : 'hover:bg-gray-100'}`}>
                                    <span className="font-medium text-sm">Pink</span>
                                    {hue==='pink' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ContainerPopup>
    )
}