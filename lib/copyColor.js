import { nanoid } from "@reduxjs/toolkit";
import { pushNotif, removeNotif } from "../slices/popupSlice";

export default function copyColor(dispatch,color){
    window.navigator.clipboard.writeText(color);
    const id = nanoid();
    dispatch(pushNotif('Color copied to the clipboard!','bg-black','checklist',id));
    const timeout = setTimeout(()=>{
        dispatch(removeNotif(id));
    },3000)
    return () => clearTimeout(timeout);
}