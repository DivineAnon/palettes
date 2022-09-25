import { useEffect } from "react";
import { useState } from "react";

export default function useIsMd() {
    const [isMd, setIsMd] = useState(false);
    
    useEffect(()=>{
        const handleResize = () => {
            setIsMd(window.matchMedia('(max-width: 768px)').matches);
        }
        handleResize();
        window.addEventListener('resize',handleResize);
        return () => window.removeEventListener('resize',handleResize);
    },[])
    
    return isMd;
}