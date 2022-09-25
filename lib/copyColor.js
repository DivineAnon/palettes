import { nanoid } from "@reduxjs/toolkit";
import { pushNotif, removeNotif } from "../slices/popupSlice";
import { store } from "../store";

export default function copyColor(color){
    window.navigator.clipboard.writeText(color);
    const id = nanoid();
    store.dispatch(pushNotif('Color copied to the clipboard!','bg-black','checklist',id));
    const timeout = setTimeout(()=>{
        store.dispatch(removeNotif(id));
    },3000)
    return () => clearTimeout(timeout);
}