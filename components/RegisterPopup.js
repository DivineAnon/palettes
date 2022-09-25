import { useRef, useState } from "react";
import ContainerPopup from "./ContainerPopup";
import axios from "axios";
import Spinner from "./Spinner";
import nookies from 'nookies';
import { Authorization, generateString, handlePushNotif } from "../lib";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";
import { closeLoginRes, setLoginResView } from "../slices/popupSlice";

export default function RegisterPopup(){
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const init = { fullname: '',  email: '', password: '', username: ''};
    const [dataRegister, setDataRegister] = useState(init);
    const [loading, setLoading] = useState(false);
    const refRegister = useRef(null);
    const [invalid, setInvalid] = useState(['']);
    const removeBox = (time) => {
        refRegister.current.classList.remove('sm:animate-fadeIn');
        refRegister.current.classList.remove('animate-translateY');
        refRegister.current.classList.add('sm:animate-fadeOut');
        refRegister.current.classList.add('animate-translateY-reverse');
        setTimeout(()=>{
            dispatch(closeLoginRes('register'));
        },time)        
    }
    const handleChange = (e) => {
        if (e.target.name==='fullname') {
            setDataRegister({ ...dataRegister, username: e.target.value.toLowerCase(), fullname: e.target.value });
        }else {
            setDataRegister({ ...dataRegister, [e.target.name]: e.target.value });
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loading) {
            setInvalid(['']);
            if (dataRegister.username && dataRegister.email && dataRegister.password) {
                setLoading(true);
                let username = dataRegister.username;
                let find = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/users?filters[username][$eq]=${username}`);
                if (find.data.length>0) {
                    username += generateString(10);
                }
                let findEmail = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/users?filters[email][$eq]=${dataRegister.email}`);
                if (dataRegister.password.length<8) {
                    setLoading(false);
                    setInvalid(['password']);
                    handlePushNotif({ text: 'The password must be 8 chars in length.', className: 'bg-red-500', icon: 'danger' });
                }else if (findEmail.data.length>0){
                    setLoading(false);
                    setInvalid(['email']);
                    handlePushNotif({ text: 'This email is already registered.', className: 'bg-red-500', icon: 'danger' });
                }else {
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/auth/local/register`,{
                        fullname: dataRegister.fullname,
                        username: username,
                        email: dataRegister.email,
                        password: dataRegister.password,
                    });
                    if (res.data) {
                        nookies.set(null,'token',res.data.jwt,{
                            path: '/'
                        });
                        const user = await Authorization();
                        dispatch(setUser(user));
                        setLoading(false);
                        removeBox(50);
                        handlePushNotif({ text: 'You have succesfully signed up!', className: 'bg-black', icon: 'checklist' });
                    }
                }
            }else {
                setInvalid(['password','email','fullname']);
            }
        }
    }
    const showLoginHandle = () => {
        removeBox(50);
        dispatch(setLoginResView('login'));
    }
    return (
        <ContainerPopup remove={removeBox}>
            <div ref={refRegister} className="animate-translateY sm:animate-fadeIn bg-white w-full sm:w-[380px] sm:relative absolute bottom-0 rounded-tl-xl rounded-tr-xl sm:rounded-xl">
                <svg onClick={()=>removeBox(100)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 top-3 left-3 rounded-lg p-1.5 transition hover:bg-gray-100 absolute cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <form onSubmit={handleSubmit} method="post" className="px-7 pt-7">
                    <h1 className="font-black text-4xl text-center mb-3">Sign up</h1>
                    <p className="text-center text-gray-500 mb-6">Create a free account with your email.</p>
                    <input onChange={handleChange} type="text" name="fullname" className={`border w-full px-4 py-3 text-[15px] outline-none transition rounded-lg font-medium mb-4 ${invalid.includes('fullname') ? 'border-red-300' : 'border-gray-300 focus:border-blue-500 hover:border-gray-400'}`} placeholder="Fullname"/>
                    <input onChange={handleChange} type="email" name="email" className={`border w-full px-4 py-3 text-[15px] outline-none transition rounded-lg font-medium ${invalid.includes('email') ? 'border-red-300' : 'border-gray-300 focus:border-blue-500 hover:border-gray-400'}`} placeholder="Email"/>
                    <div className="my-4 relative">
                        <input onChange={handleChange} type={showPassword ? 'text' : 'password'} name="password" className={`border w-full pl-4 pr-12 py-3 text-[15px] outline-none transition rounded-lg font-medium ${invalid.includes('password') ? 'border-red-300' : 'border-gray-300 focus:border-blue-500 hover:border-gray-400'}`} placeholder="Password"/>
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
                    "Create your free account"
                    ) : (
                    <Spinner/>
                    )}
                    </button>
                    <p className="text-gray-500 text-xs text-center my-6">By continuing, you agree to our <span className="text-black">Terms of Service.</span></p>
                </form>
                <div className="text-sm text-center border-t py-5 font-medium text-gray-600">
                    <p>Already have an account? <button onClick={showLoginHandle} className="text-blue-500 transition hover:underline">Sign in</button></p>
                </div>
            </div>
        </ContainerPopup>
    )
}