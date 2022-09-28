import axios from "axios";
import { useState, useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetToken, usePushNotif,  } from "../lib";
import { resetAvatarDelId, selectAvatarDelId } from "../slices/globalSlice";
import { setDataShowUploadImage } from "../slices/popupSlice";
import { selectUser, updateAvatar } from "../slices/userSlice";
import ContainerPopup from "./ContainerPopup";
import Spinner from "./Spinner";

export default function PopupUploadImg(){
    const [activeMenu, setActiveMenu] = useState('upload');
    const uploadImgRef = useRef(null);
    const [dataUrl, setDataUrl] = useState('');
    const [loading, setLoading] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const avatarDelID = useSelector(selectAvatarDelId);
    const inputRef = useRef(null);
    const handlePushNotif = usePushNotif();
    const removeBox = (time) => {
        uploadImgRef.current.classList.remove('sm:animate-fadeIn');
        uploadImgRef.current.classList.remove('animate-translateY');
        uploadImgRef.current.classList.add('sm:animate-fadeOut');
        uploadImgRef.current.classList.add('animate-translateY-reverse');
        setTimeout(()=>{
            dispatch(setDataShowUploadImage(null));
        },time)
    }
    const handleUploadImg = async (e) => {
        if (!loading) {
            setLoading('upload');
            if (avatarDelID.length!==0) {
                for (let i = 0; i < avatarDelID.length; i++) {
                    const del = await axios.delete(`${process.env.NEXT_PUBLIC_API}/api/upload/files/${avatarDelID[i]}`,{
                        headers: {
                            Authorization: `bearer ${GetToken()}`
                        }
                    })
                }
                dispatch(resetAvatarDelId());
            }
            const formData = new FormData();
            formData.append('files',e.target.files[0]);
            let res = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/upload`,formData,{
                headers: {
                    Authorization: `bearer ${GetToken()}`
                }
            })
            let update = await axios.put(`${process.env.NEXT_PUBLIC_API}/api/users/${user.id}`,{
                avatar: res.data[0].id,
            },{
                headers: {
                    Authorization: `bearer ${GetToken()}`
                }
            })
            dispatch(updateAvatar(res.data[0]));
            setLoading(null);
            removeBox(50);
            handlePushNotif({ text: 'Profile updated successfully!', className: 'bg-black', icon: 'checklist' });
        }
    }
    const handleUploadFromURL = async () => {
        if (dataUrl) {
            if (loading!=='url') {
                setLoading('url');
                if (avatarDelID.length!==0) {
                    for (let i = 0; i < avatarDelID.length; i++) {
                        const del = await axios.delete(`${process.env.NEXT_PUBLIC_API}/api/upload/files/${avatarDelID[i]}`,{
                            headers: {
                                Authorization: `bearer ${GetToken()}`
                            }
                        })
                    }
                    dispatch(resetAvatarDelId());
                }
                fetch(dataUrl)
                .then(res=>res.blob())
                .then(async blob=>{
                    if (blob.type==='image/jpeg') {
                        const formData = new FormData();
                        formData.append('files',blob);
                        let res = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/upload`,formData,{
                            headers: {
                                Authorization: `bearer ${GetToken()}`
                            }
                        })
                        let update = await axios.put(`${process.env.NEXT_PUBLIC_API}/api/users/${user.id}`,{
                            avatar: res.data[0].id,
                        },{
                            headers: {
                                Authorization: `bearer ${GetToken()}`
                            }
                        })
                        dispatch(updateAvatar(res.data[0]));
                        setLoading(null);
                        removeBox(50);
                        handlePushNotif({ text: 'Profile updated successfully!', className: 'bg-black', icon: 'checklist' });
                    }
                })
            }
        }
    }
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={uploadImgRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[468px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl flex flex-col divide-y">
                <div className="p-3 relative">
                    <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 transition cursor-pointer p-1.5 rounded-lg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="font-semibold text-center">Select image</h1>
                </div>
                <div className="flex justify-center items-center">
                    <button onClick={()=>setActiveMenu('upload')} className={`py-3.5 px-2 transition relative text-scondary ${activeMenu==='upload' ? "before:content-[''] before:w-full before:left-0 before:top-full before:h-[2px] before:bg-blue-500 before:-translate-y-[2px] before:absolute text-blue-500" : 'hover:text-black' }`}>Upload</button>
                    <button onClick={()=>setActiveMenu('url')} className={`py-3.5 px-2 transition relative text-scondary ${activeMenu==='url' ? "before:content-[''] before:w-full before:left-0 before:top-full before:h-[2px] before:bg-blue-500 before:-translate-y-[2px] before:absolute text-blue-500" : 'hover:text-black' }`}>URL</button>
                </div>
                <div className="p-[20px]">
                    {activeMenu==='upload' && (
                    <div onClick={()=>inputRef.current.click()} className="h-[200px] cursor-pointer transition hover:border-gray-300 rounded-lg border-dashed border-2 flex flex-col items-center justify-center gap-1">
                        <input type="file" onChange={handleUploadImg} ref={inputRef} hidden accept="image/*" className="hidden"/>
                        {loading==='upload' ? (
                            <Spinner/>
                        ) : (
                            <Fragment>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-11 w-11 text-scondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-[15px] font-medium text-scondary">Browse or drop image</p>
                            </Fragment>
                        )}
                    </div>
                    )}
                    {activeMenu==='url' && (
                    <div>
                        <p className="text-sm font-medium mb-2">Image URL</p>
                        <input value={dataUrl} onChange={(e)=>setDataUrl(e.target.value)} type="text" name="identifier" className="border border-gray-300 w-full px-4 py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-xl font-medium" placeholder="https://"/>
                        <button onClick={handleUploadFromURL} className="h-[46px] text-center font-bold bg-blue-500 hover:bg-blue-600 transition text-white w-full block mt-4 rounded-xl">{loading==='url' ? (
                            <Spinner/>
                        ) : (
                            "OK"
                        )}</button>
                    </div>
                    )}
                </div>
            </div>
        </ContainerPopup>
    )
}