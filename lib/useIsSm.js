import { useEffect, useState } from "react";

export default function useIsSm(){
    const [isSm, setIsSm] = useState(false);
    
    useEffect(()=>{
        const handleResize = () => {
            setIsSm(window.matchMedia('(max-width: 640px)').matches);
        }
        handleResize();
        window.addEventListener('resize',handleResize);
        return () => window.removeEventListener('resize',handleResize);
    },[])
    
    return isSm;
}