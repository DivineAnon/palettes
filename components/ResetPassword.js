import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { closeLoginRes, setLoginResView } from "../slices/popupSlice";
import ContainerPopup from "./ContainerPopup";

export default function ResetPassword(){
    const dispacth = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const resetRef = useRef(null);
    const removeBox = (time) => {
        resetRef.current.classList.remove('sm:animate-fadeIn');
        resetRef.current.classList.remove('animate-translateY');
        resetRef.current.classList.add('sm:animate-fadeOut');
        resetRef.current.classList.add('animate-translateY-reverse');
        setTimeout(()=>{
            dispacth(closeLoginRes('reset'));
        },time)
    }
    const handleShowLogin = () => {
        removeBox(50);
        dispacth(setLoginResView('login'));
    }
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={resetRef} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[380px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl">
                <div className="p-3 border-b">
                    <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 top-2 left-2 rounded-lg p-1.5 transition hover:bg-gray-100 absolute cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <h1 className="text-center font-bold">Reset Password</h1>
                </div>
                <form method="post" className="px-6 pt-6 font-medium">
                    <p className="text-[15px] mb-5 text-gray-600">Enter your email address below and choose a new password.</p>
                    <label for="email_" className="text-sm mb-3 block">Email / Username</label>
                    <input type="text" id="email_" name="email_username" className="border border-gray-300 w-full px-4 py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-lg font-medium" placeholder="john@email.com"/>
                    <label for="password_" className="text-sm my-3 block">Choose a new password</label>
                    <div className="relative">
                        <input id="password_" type={showPassword ? 'text' : 'password'} name="password" className="border border-gray-300 w-full pl-4 pr-12 py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-lg font-medium" placeholder="Min 8 characters"/>
                        {!showPassword ? (
                        <svg onClick={()=>setShowPassword(true)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transition hover:bg-gray-100 cursor-pointer p-1.5 rounded absolute right-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        ) : (
                        <svg onClick={()=>setShowPassword(false)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 transition hover:bg-gray-100 cursor-pointer p-1.5 rounded absolute right-3 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                        )}
                    </div>
                    <button className="px-4 py-3 mt-4 mb-5 text-[15px] w-full text-white transition bg-blue-500 hover:bg-blue-600 font-bold rounded-lg">Send reset link</button>
                </form>
                <div className="text-sm text-center border-t py-4">
                    <p>Back to <button onClick={handleShowLogin} className="text-blue-500 transition hover:underline">Sign in</button></p>
                </div>
            </div>
        </ContainerPopup>
    )
}