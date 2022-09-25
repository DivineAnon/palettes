import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CustomPicker } from "react-color";
import {
  Saturation,
  Hue,
  EditableInput,
} from "react-color/lib/components/common";

export const MyPicker = ({ hex, hsl, hsv, onChange, setState, targetClass, width }) => {
    const isShow = useRef(false);
    const containerRef = useRef(null);
    const arrow = useRef(null);
    const [resize, setResize] = useState(0);
    const [scroll, setScroll] = useState(0);
    const styles = {
        input: {
            height: 34,
            border: `1px solid #ddd`,
            outline: 'none',
            borderRadius: '8px',
            padding: '0 10px',
            width: 240,
            fontSize: 14
        },
    };
    const Pointer = () => {
        return (
        <div className="p-1 cursor-grab border rounded-full bg-white">
            <div style={{ backgroundColor: hex }} className="w-3.5 h-3.5 border rounded-full"></div>
        </div>
        )
    }
    const setPosition = () => {
        const rect = document.querySelector(`.${targetClass}`).getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const arrowSatu = arrow.current.firstElementChild;
        const arrowDua = arrowSatu.nextElementSibling;
        const reset = () => {
            arrow.current.classList.remove('top-0','-translate-y-full');
            arrow.current.classList.remove('bottom-0','translate-y-full');
            arrow.current.classList.remove('left-0','translate-x-3');
            arrow.current.classList.remove('left-1/2','-translate-x-1/2');
            arrow.current.classList.remove('right-0','-translate-x-3');
            arrowSatu?.classList.remove('border-t-[12px]','border-t-gray-300');
            arrowDua?.classList.remove('border-t-[11px]','border-t-white');
            arrowSatu?.classList.remove('border-b-[11px]','border-b-gray-300');
            arrowDua?.classList.remove('border-b-[12px]','border-b-white');
        }
        if (rect.y-containerRect.height<=0) {
            reset();
            arrow.current.classList.add('top-0','-translate-y-full');
            arrowSatu?.classList.add('border-b-[11px]','border-b-gray-300');
            arrowDua?.classList.add('border-b-[12px]','border-b-white');
            containerRef.current.style.top = `${rect.y+rect.height+(rect.height/2)}px`
            if (rect.x<containerRect.width/2) {
                arrow.current.classList.add('left-0','translate-x-3');
                containerRef.current.style.left = `${rect.x+(rect.width/2)-22}px`;
            }else {
                if (rect.x+containerRect.width<window.innerWidth) {
                    arrow.current.classList.add('left-1/2','-translate-x-1/2');
                    containerRef.current.style.left = `${rect.x+(rect.width/2)-(containerRect.width/2)}px`;
                }else {
                    arrow.current.classList.add('right-0','-translate-x-3');
                    containerRef.current.style.left = `${rect.x+(rect.width/2)+22-containerRect.width}px`;
                }
            }
        }else {
            reset();
            arrow.current.classList.add('bottom-0','translate-y-full');
            arrowSatu?.classList.add('border-t-[12px]','border-t-gray-300');
            arrowDua?.classList.add('border-t-[11px]','border-t-white');
            containerRef.current.style.top = `${(rect.y-(rect.height/2)-containerRect.height)}px`
            if (rect.x<containerRect.width/2) {
                arrow.current.classList.add('left-0','translate-x-3');
                containerRef.current.style.left = `${rect.x+(rect.width/2)-22}px`;
            }else {
                if (rect.x+containerRect.width<window.innerWidth) {
                    arrow.current.classList.add('left-1/2','-translate-x-1/2');
                    containerRef.current.style.left = `${rect.x+(rect.width/2)-(containerRect.width/2)}px`;
                }else {
                    arrow.current.classList.add('right-0','-translate-x-3');
                    containerRef.current.style.left = `${rect.x+(rect.width/2)+22-containerRect.width}px`;
                }
            }
        }
    }
    useEffect(()=>{
        isShow.current = true;
        const resizeEvent = () => {
            setResize(window.innerWidth);
        }
        const clickEvent = (e) => {
            if (!e.target.closest('#pickerArea') && isShow.current) {
                setState(null);
            }
        }
        const scrollEvent = () => {
            setScroll(window.scrollY);
        }
        window.addEventListener('click',clickEvent);
        window.addEventListener('resize',resizeEvent);
        window.addEventListener('scroll',scrollEvent);
        return ()=> { 
            window.removeEventListener('click',clickEvent);
            window.removeEventListener('resize',resizeEvent);
            window.removeEventListener('scroll',scrollEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useLayoutEffect(()=>{
        setPosition();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[resize, scroll])
    return (
        <div id="pickerArea" ref={containerRef} style={{ width }} className={`bg-white p-4 shadow rounded-xl fixed z-[9999]`}>
            <div className="relative h-[150px] mb-4 rounded-lg overflow-hidden">
                <Saturation pointer={Pointer} hsl={hsl} hsv={hsv} onChange={onChange} />
            </div>
            <div className="relative h-[10px] rounded-full overflow-hidden mb-4">
                <Hue hsl={hsl} onChange={onChange}/>
            </div>
            <div className="relative">
                <EditableInput
                style={{ input: styles.input }}
                value={hex}
                onChange={onChange}
                />
                <div style={{ backgroundColor: hex }} className="w-6 h-6 rounded absolute right-[5px] top-[5px]"></div>
            </div>
            <div ref={arrow} className="absolute ">
                <div className={`h-0 w-0 relative border-x-[11px] border-x-transparent`}></div>
                <div className={`h-0 w-0 absolute top-0 border-x-[11px] border-x-transparent`}></div>
            </div>
        </div>
    );
};

export default CustomPicker(MyPicker);
