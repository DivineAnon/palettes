import { useDispatch } from "react-redux";
import { handlePushNotif } from ".";

export default function usePushNotif(){
    const dispatch = useDispatch();
    return ({ text, className, icon }) => handlePushNotif({ text, className, icon, dispatch });
}