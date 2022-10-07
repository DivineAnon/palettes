import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetToken, usePushNotif } from "../lib";
import { selectDataAddToFav, setDataAddToFav } from "../slices/popupSlice";
import ContainerPopup from "./ContainerPopup";
import Spinner from "./Spinner";

export default function PopupAddToFav(){
    const dispatch = useDispatch();
    const elementRef = useRef(null);
    const data = useSelector(selectDataAddToFav);
    const [loading,setLoading] = useState(false);
    const handlePushNotif = usePushNotif();
    const removeBox = (time) => {
        elementRef.current.classList.remove('sm:animate-fadeIn');
        elementRef.current.classList.remove('animate-translateY');
        elementRef.current.classList.add('sm:animate-fadeOut');
        elementRef.current.classList.add('animate-translateY-reverse');
        const close = setTimeout(()=>{
            dispatch(setDataAddToFav(null));
        },time);
        return ()=> clearTimeout(close);
    }
    const handleAdd = async () => {
        setLoading(true);
        const added = await axios.put(`${process.env.NEXT_PUBLIC_API}/api/favorites/add`,{
            ...data
        },{
            headers: {
                Authorization: `bearer ${GetToken()}`
            }
        })
        setLoading(false)
        dispatch(setDataAddToFav(null));
        handlePushNotif({ text: `${data.type.charAt(0).toUpperCase() + data.type.slice(1,-1)} added to favorite!`, className: 'bg-black', icon: 'checklist' });
    }
    return (
    <ContainerPopup remove={removeBox}>
        <div ref={elementRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[380px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl flex flex-col divide-y">
            <div className="p-3 relative">
                <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 transition cursor-pointer p-1.5 rounded-lg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <h1 className="font-semibold text-center">Add to favorite</h1>
            </div>
            <div className="min-h-[100px] flex items-center justify-center p-6">
                <p className="text-[15px] font-medium">Add this {data.type.slice(0,-1)} to favorite?</p>
            </div>
            <div className="flex p-4 gap-3">
                <button onClick={()=>removeBox(100)} className="h-[46px] text-center font-bold border hover:border-gray-400 bg-white transition w-full block rounded-xl">Cancel</button>
                <button onClick={handleAdd} className="h-[46px] text-center font-bold bg-blue-500 hover:bg-blue-600 transition text-white w-full block rounded-xl">{loading ? <Spinner/> : 'Add'}</button>
            </div>
        </div>
    </ContainerPopup>
    )
}