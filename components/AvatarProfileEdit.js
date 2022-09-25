import { Fragment } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../slices/userSlice";
import { setDataShowUploadImage } from "../slices/popupSlice";
import { addAvatarDelId } from "../slices/globalSlice";

export default function AvatarProfileEdit({ className }){
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    return (
        <Fragment>
            {!user?.avatar ? (
            <div onClick={()=>dispatch(setDataShowUploadImage(true))} className="rounded-full overflow-hidden group relative cursor-pointer">
                <div className="bg-black/30 w-full h-full top-0 left-0 absolute z-10 opacity-0 group-hover:opacity-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white absolute top-1/2 -translate-y-1/2 left-1/2 z-10 -translate-x-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div className={`w-[140px] h-[140px] bg-blue-100 flex items-center justify-center ${className}`}>
                    <span className="text-6xl font-extrabold uppercase">{user?.fullname.charAt(0)}</span>
                </div>
            </div>
            ) : (
            <div onClick={()=>{dispatch(addAvatarDelId(user.avatar.id));dispatch(setUser({...user, avatar: null}))}} className="relative cursor-pointer group rounded-full overflow-hidden">
                <div className="bg-black/30 w-full h-full top-0 left-0 absolute z-10 opacity-0 group-hover:opacity-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white absolute top-1/2 -translate-y-1/2 left-1/2 z-10 -translate-x-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <Image alt="avatar" width={140} height={140} className={`object-center object-cover ${className}`} src={user?.avatar.url} />
            </div>
            )}
        </Fragment>
    )
}