import { nanoid } from "@reduxjs/toolkit";
import { pushNotif, removeNotif } from "../slices/popupSlice";
import { store } from '../store';

export default function handlePushNotif({ text, className, icon }){
    const id = nanoid();
    store.dispatch(pushNotif(text,className,icon,id));
    const timeout = setTimeout(()=>{
        store.dispatch(removeNotif(id));
    },3000)
    return ()=> clearTimeout(timeout);
}