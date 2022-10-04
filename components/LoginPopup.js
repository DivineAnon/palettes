import axios from "axios";
import { useRef, useState } from "react";
import ContainerPopup from "./ContainerPopup";
import nookies from 'nookies';
import Spinner from "./Spinner";
import { Authorization, usePushNotif } from "../lib";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";
import { closeLoginRes, setLoginResView } from "../slices/popupSlice";

export default function LoginPopup(){
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const refLogin = useRef(null);
    const [dataLogin, setDataLogin] = useState({ identifier: '', password: '' });
    const [loading, setLoading] = useState(false);
    const handlePushNotif = usePushNotif();
    const removeBox = (time) => {
        refLogin.current.classList.remove('sm:animate-fadeIn');
        refLogin.current.classList.remove('animate-translateY');
        refLogin.current.classList.add('sm:animate-fadeOut');
        refLogin.current.classList.add('animate-translateY-reverse');
        setTimeout(()=>{
            dispatch(closeLoginRes('login'));
        },time)        
    }
    const handleChange = (e) => {
        setDataLogin({ ...dataLogin, [e.target.name]: e.target.value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loading) {
            setLoading(true);
            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/auth/local`,dataLogin);
                if (res.data) {
                    nookies.set(null,'token',res.data.jwt,{
                        path: '/',
                        maxAge: 30 * 24 * 60 * 60,
                    });
                    const user = await Authorization();
                    dispatch(setUser(user));
                    removeBox(50);
                    handlePushNotif({ text: 'You have succesfully signed in!', className: 'bg-black', icon: 'checklist' });
                }
            } catch (error) {
                handlePushNotif({ text: 'Email or password not valid.', className: 'bg-red-500', icon: 'danger' });
            }
            setLoading(false);
        }
    }
    const showRegisterHandle = () => {
        removeBox(50);
        dispatch(setLoginResView('register'));
    }
    const showResetHandle = () => {
        removeBox(50);
        dispatch(setLoginResView('reset'));
    }
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={refLogin} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[380px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl">
                <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 top-3 left-3 rounded-lg p-1.5 transition hover:bg-gray-100 absolute cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <form onSubmit={handleSubmit} method="post" className="px-7 pt-7">
                    <h1 className="font-black text-4xl text-center mb-3">Sign in</h1>
                    <p className="text-center text-gray-500 mb-6">Sign in with your email here.</p>
                    <input required onChange={handleChange} type="text" name="identifier" className="border border-gray-300 w-full px-4 py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-lg font-medium" placeholder="Email / Username"/>
                    <div className="my-4 relative">
                        <input required onChange={handleChange} type={showPassword ? 'text' : 'password'} name="password" className="border border-gray-300 w-full pl-4 pr-12 py-3 text-[15px] focus:border-blue-500 outline-none transition hover:border-gray-400 rounded-lg font-medium" placeholder="Password"/>
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
                    <button className="px-4 py-3 text-[15px] w-full text-white transition bg-blue-500 hover:bg-blue-600 font-bold rounded-lg">
                    {!loading ? (
                    "Sign in"
                    ) : (
                    <Spinner/>
                    )}
                    </button>
                    <p className="text-gray-500 text-xs text-center my-6">By continuing, you agree to our <span className="text-black">Terms of Service.</span></p>
                </form>
                <div className="text-sm text-center border-t py-5 font-medium text-gray-600">
                    <p className="mb-1">Forgot password? <button onClick={showResetHandle} className="text-blue-500 transition hover:underline">Reset</button></p>
                    <p>{"Don't"} have an account? <button onClick={showRegisterHandle} className="text-blue-500 transition hover:underline">Sign up</button></p>
                </div>
            </div>
        </ContainerPopup>
    )
}