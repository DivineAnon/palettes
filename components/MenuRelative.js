import { useLayoutEffect } from "react";
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useIsMd } from "../lib";
import { selectDataMenuMore, setDataMenuMore } from "../slices/popupSlice";

export default function MenuRelative({ className }){
    const { elementRef, width, Children, customClickEvent } = useSelector(selectDataMenuMore);
    const dispatch = useDispatch();
    const elRef = useRef(null);
    const chlidContainRef = useRef(null);
    const containScroll = useRef(null);
    const arrowPopup = useRef(null);
    const arrowTopScroll = useRef(null);
    const arrowBottomScroll = useRef(null);
    const [scroll, setScroll] = useState(null);
    const [resize, setResize] = useState(null);
    const isMd = useIsMd();
    const isMounted = useRef(false);
    const handleScrollDown = () => {
        containScroll.current.scrollTop += 80;
        if (containScroll.current.clientHeight+containScroll.current.scrollTop>=(containScroll.current.scrollHeight-arrowBottomScroll.current.clientHeight-40)) {
            arrowBottomScroll.current.style.display = 'none';
        }
        arrowTopScroll.current.style.display = 'block';
    }
    const handleScrollTop = () => {
        containScroll.current.scrollTop -= 80;
        if (containScroll.current.scrollTop<=(0+arrowTopScroll.current.clientHeight+40)) {
            arrowTopScroll.current.style.display = 'none';
        }
        arrowBottomScroll.current.style.display = 'block';
    }
    const handleRemove = (e) => {
        const closeFunc = () => {
            if (isMd) {
                if (e.target.closest('#con-menu-rlv')) {
                    chlidContainRef.current?.classList.remove('animate-translateY');
                    chlidContainRef.current?.classList.add('animate-translateY-reverse');
                    const timeout = setTimeout(()=>{
                        dispatch(setDataMenuMore(null));
                    },100)
                    return ()=> clearTimeout(timeout);
                }
            }else {
                dispatch(setDataMenuMore(null));
            }
        }
        if (isMounted.current) {
            if (customClickEvent) {
                const isCLose = customClickEvent(e, isMd);
                if (isCLose) {
                    closeFunc();
                }
            }else {
                closeFunc();
            }
        }else {
            isMounted.current = true;
        }
    }
    const setPosition = () => {
        const elementRefClient = elementRef?.getBoundingClientRect();
        const elRefClient = elRef.current.getBoundingClientRect();
        const arrowFirstChild = arrowPopup.current.firstElementChild;
        const arrowSecondChild = arrowFirstChild.nextElementSibling;
        const reset = () => {
            arrowPopup.current.classList.remove('left-1/2','-translate-x-1/2');
            arrowPopup.current.classList.remove('right-0','-translate-x-3');
            arrowBottomScroll.current.style.display = 'none';
            arrowTopScroll.current.style.display = 'none';
            arrowPopup.current.classList.remove('top-0','-translate-y-full');
            arrowFirstChild.classList.remove('border-b-gray-300','border-b-[10px]')
            arrowSecondChild.classList.remove('border-b-white','border-b-[10px]')
            arrowPopup.current.classList.remove('bottom-0','translate-y-full');
            arrowFirstChild.classList.remove('border-t-gray-300','border-t-[10px]')
            arrowSecondChild.classList.remove('border-t-white','border-t-[10px]')
            containScroll.current.classList.remove('max-h-[280px]','overflow-hidden');
            elRef.current.removeAttribute('style');
        }
        reset();
        const checkArrowPosition = () => {
            if (elementRefClient.x+elRefClient.width<window.innerWidth) {
                arrowPopup.current.classList.add('left-1/2','-translate-x-1/2');
                elRef.current.style.left = `${elementRefClient.x-(elRefClient.width/2)+(elementRefClient.width/2)}px`;
            }else {
                arrowPopup.current.classList.add('right-0','-translate-x-3');
                elRef.current.style.left = `${elementRefClient.x-elRefClient.width+(elementRefClient.width/2)+20}px`;
            }
        }
        const getArrowPos = (arrow) => {
            if (arrow==='top') {
                arrowPopup.current.classList.add('top-0','-translate-y-full');
                arrowFirstChild.classList.add('border-b-gray-300','border-b-[10px]')
                arrowSecondChild.classList.add('border-b-white','border-b-[10px]')
                checkArrowPosition();
                elRef.current.style.top = `${elementRefClient.y+elementRefClient.height+10}px`;
            }else {
                arrowPopup.current.classList.add('bottom-0','translate-y-full');
                arrowFirstChild.classList.add('border-t-gray-300','border-t-[10px]')
                arrowSecondChild.classList.add('border-t-white','border-t-[10px]')
                checkArrowPosition();
                elRef.current.style.top = `${elementRefClient.y-(elRefClient.height>280 ? 280 : elRefClient.height)-(elementRefClient.height/2)}px`;
            }
        }
        if (elementRefClient && !isMd) {
            containScroll.current.style.width = `${width}px`;
            if ((elementRefClient.y+elRefClient.height)>window.innerHeight) {
                if (elRefClient.height>280) {
                    containScroll.current.classList.add('max-h-[280px]','overflow-hidden');
                    arrowBottomScroll.current.style.display = 'block';
                }
                if ((elementRefClient.y+(elRefClient.height>280 ? 280 : elRefClient.height))>window.innerHeight) {
                    getArrowPos('bottom');
                }else {
                    getArrowPos('top');
                }
            }else {
                getArrowPos('top');
            }
        }
        if (isMd){
            containScroll.current.removeAttribute('style');
            containScroll.current.classList.add('w-full');
        }
    }
    useEffect(()=>{
        const scrollEvent = () => {
            setScroll(window.scrollY);
        }
        const resizeEvent = () => {
            setResize(window.innerWidth);
        }
        window.addEventListener('scroll',scrollEvent);
        window.addEventListener('resize',resizeEvent);
        return ()=> {
            window.removeEventListener('scroll',scrollEvent);
            window.removeEventListener('resize',resizeEvent);
        }

    },[])
    useEffect(()=>{
        const clickEvent = (e) => {
            handleRemove(e);
        }
        window.addEventListener('click',clickEvent);
        return ()=> window.removeEventListener('click',clickEvent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isMd])
    useLayoutEffect(()=>{
        setPosition();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[resize,scroll, isMd])
    return (
        <div ref={elRef} id="con-menu-rlv" className={`fixed z-[200] flex translate-x-0 md:block justify-end flex-col w-full md:w-auto bg-black/30 md:bg-transparent h-full bottom-0 cursor-auto md:bottom-auto md:h-auto left-0 md:left-auto ${className ? className : ''} `}>
            <div ref={chlidContainRef} id="con-menu-md" className="relative animate-translateY md:animate-none bg-white md:shadow-md md:border md:rounded-xl rounded-tl-xl rounded-tr-xl overflow-hidden">
                <div ref={arrowTopScroll} style={{ display: 'none' }} onMouseOver={handleScrollTop} className="absolute top-0 w-full h-4 bg-white left-0 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mx-auto">
                        <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
                    </svg>
                </div>
                <div ref={containScroll} style={{ width }} className={`p-3 md:p-2 divide-y md:w-auto scroll-smooth`}>
                    <Children/>
                </div>
                <div ref={arrowBottomScroll} style={{ display: 'none' }} onMouseOver={handleScrollDown} className="absolute bottom-0 w-full h-4 bg-white left-0 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mx-auto">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            <div ref={arrowPopup} className="absolute">
                <div className={`h-0 w-0 relative border-x-[11px] -translate-x-[1px] border-x-transparent`}></div>
                <div className={`h-0 w-0 absolute top-0 border-x-[10px] border-x-transparent`}></div>
            </div>
        </div>
    )
}