import { Fragment } from "react";
import { useSelector } from "react-redux";
import { selectALlNotif } from "../slices/popupSlice";

export default function Notif(){
    const notif = useSelector(selectALlNotif);
    return (
        <div className="fixed bottom-4 z-50 w-full flex flex-col items-center justify-center pointer-events-none">
            {notif.map((not,i)=>(
                <Fragment key={i}>
                    {not}
                </Fragment>
            ))}
        </div>
    )
}