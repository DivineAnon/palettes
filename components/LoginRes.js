import Link from "next/link";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeLoginRes, selectLoginRes, setLoginResView } from "../slices/popupSlice";
import ContainerPopup from "./ContainerPopup";

export default function LoginRes(){
    const loginResRef = useRef(null);
    const loginRes = useSelector(selectLoginRes);
    const dispatch = useDispatch();
    const removeBox = (time) => {
        loginResRef.current.classList.remove('sm:animate-fadeIn');
        loginResRef.current.classList.remove('animate-translateY');
        loginResRef.current.classList.add('sm:animate-fadeOut');
        loginResRef.current.classList.add('animate-translateY-reverse');
        setTimeout(()=>{
            dispatch(closeLoginRes('provider'));
        },time)
    }
    const showLoginRegister = () => {
        removeBox(50);
        dispatch(setLoginResView(loginRes.nextView));
    }
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={loginResRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[380px] sm:relative absolute bottom-0 p-7 rounded-tl-xl rounded-tr-xl sm:rounded-xl">
                <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 top-3 left-3 rounded-lg p-1.5 transition hover:bg-gray-100 absolute cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <h1 className="font-black text-4xl text-center mb-3">Hello!</h1>
                <p className="text-center text-gray-500 mb-6">Use your email or another service to continue with Palettes.</p>
                <button className="flex items-center bg-gray-100 hover:bg-gray-200 transition w-full px-6 rounded-lg py-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                    </svg>
                    <span className="font-bold flex-1 self-center">Continue with Google</span>
                </button>
                <Link href={`${process.env.NEXT_PUBLIC_API}/api/connect/github`}>
                    <button className="flex items-center bg-gray-100 hover:bg-gray-200 transition w-full px-6 rounded-lg py-3 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                        <span className="font-bold flex-1 self-center">Continue with Github</span>
                    </button>
                </Link>
                <button onClick={showLoginRegister} className="transition w-full px-6 rounded-lg py-3 mb-6 bg-blue-500 font-bold text-white hover:bg-blue-600">Continue with email</button>
                <p className="text-gray-500 text-xs text-center">By continuing, you agree to our <span className="text-black">Terms of Service.</span></p>
            </div>
        </ContainerPopup>
    )
}