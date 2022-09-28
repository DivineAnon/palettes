import { nanoid } from "@reduxjs/toolkit";
import { pushNotif, removeNotif } from "../slices/popupSlice";

export default function handlePushNotif({ text, className, icon, dispatch }){
    const id = nanoid();
    dispatch(pushNotif(text,className,icon,id));
    const timeout = setTimeout(()=>{
        dispatch(removeNotif(id));
    },3000)
    return ()=> clearTimeout(timeout);
}