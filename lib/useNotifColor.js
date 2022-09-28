import { useDispatch } from "react-redux";
import copyColor from "./copyColor";

export default function useNotifColor(){
    const dispatch = useDispatch();
    return (color) => copyColor(dispatch,color);
}