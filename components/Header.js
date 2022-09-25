import Link from 'next/link';
import nookies from 'nookies';
import Router from 'next/router';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from '../slices/userSlice';
import { setLoginRes } from '../slices/popupSlice';
import { useState } from 'react';
import { handlePushNotif } from '../lib';

export default function Header({ isFixed }){
    const [menuLeft, setMenuLeft] = useState(false);
    const user = useSelector(selectUser);
    const dispacth = useDispatch();
    const showMenuLeft = () => {
        setMenuLeft(true);
        document.body.classList.add('overflow-hidden');
    }
    const removeMenuLeft = (e) => {
        setMenuLeft(false);
        document.body.classList.remove('overflow-hidden');
    }
    const handleSignOut = () => {
        nookies.destroy(null,'token',{
            path: '/'
        });
        handlePushNotif({ text: 'You have succesfully signed out!"', className: 'bg-black', icon: 'checklist' })
        dispacth(setUser(null));
        if (Router.pathname==='/account/[pages]') {
            Router.replace('/');
        }
    }
    return (
        <>
        <div className={`bg-white z-30 h-[60px] sticky ${!isFixed && 'md:absolute'} top-0 left-0 w-full flex items-center justify-center md:justify-between border-b px-6`}>
            <Link href='/'>
                <a className='font-display text-[28px] text-blue-500'>Palettes</a>
            </Link>
            <div className="hidden md:flex divide-x items-center font-medium gap-5 ralative">
                <div className='relative parent-tool py-1'>
                    <div className='transition btn-tool flex items-center gap-1.5'>
                        <span>Tools</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div className='absolute border tool-menu right-0 top-full shadow-lg hidden rounded-lg overflow-hidden'>
                        <div className='bg-white p-5'>
                            <Link href='/generate'>
                                <a className='flex whitespace-nowrap gap-[15px] hover:bg-green-100 transition px-[10px] py-[14px] rounded-lg group'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='w-[55px]' viewBox="0 0 100 100">
                                        <g>
                                            <path d="M21,17H38a0,0,0,0,1,0,0V83a0,0,0,0,1,0,0H21a7,7,0,0,1-7-7V24A7,7,0,0,1,21,17Z" style={{fill: '#02d1ac'}} />
                                            <rect x={38} y={17} width={24} height={66} style={{fill: '#74e6d1'}} />
                                            <path d="M62,17H79a7,7,0,0,1,7,7V76a7,7,0,0,1-7,7H62a0,0,0,0,1,0,0V17A0,0,0,0,1,62,17Z" style={{fill: '#ccf6ee'}} />
                                            </g>
                                            <path d="M22,29.57l-2-1-2-1a.6.6,0,0,0-.48,0l-2,1-2,1A3.43,3.43,0,0,1,8.88,25l1-2,1-2a.6.6,0,0,0,0-.48l-1-2-1-2a3.43,3.43,0,0,1,4.58-4.58l2,1,2,1a.6.6,0,0,0,.48,0l2-1,2-1a3.43,3.43,0,0,1,4.59,4.58l-1,2-1,2a.6.6,0,0,0,0,.48l1,2,1,2A3.43,3.43,0,0,1,22,29.57Z" style={{fill: '#a6efe2'}} />
                                            <path d="M23.22,60.55l-1.95,1.11-1.95,1.1a.79.79,0,0,0-.19.17.85.85,0,0,0-.09.24l-.33,2.21-.33,2.22A3.43,3.43,0,0,1,12,68.79l-1.11-2-1.1-2a.73.73,0,0,0-.17-.18.5.5,0,0,0-.23-.09l-2.22-.33L5,64a3.43,3.43,0,0,1-1.18-6.38l2-1.1,1.95-1.11a.58.58,0,0,0,.18-.17A.5.5,0,0,0,8,55l.33-2.22.34-2.22A3.43,3.43,0,0,1,15,49.34l1.1,1.95,1.11,2a.52.52,0,0,0,.17.19.65.65,0,0,0,.23.09l2.22.33,2.22.33a3.43,3.43,0,0,1,1.18,6.37Z" style={{fill: '#019278'}} />
                                            <path d="M66.08,26.46,64,25.65l-2.09-.81a.52.52,0,0,0-.25,0,.57.57,0,0,0-.24.08L59.48,26l-1.92,1.15a3.43,3.43,0,0,1-5-4.17l.8-2.1.81-2.09a.52.52,0,0,0,0-.25.48.48,0,0,0-.07-.23L53,16.42,51.86,14.5a3.39,3.39,0,0,1,.32-4,3.35,3.35,0,0,1,3.85-1l2.1.8,2.09.81a.69.69,0,0,0,.25,0,.75.75,0,0,0,.24-.08L62.63,10,64.55,8.8a3.43,3.43,0,0,1,5,4.18l-.8,2.09-.81,2.09a.54.54,0,0,0,0,.25.55.55,0,0,0,.07.24l1.16,1.92,1.15,1.93a3.43,3.43,0,0,1-4.17,5Z" style={{fill: '#02d1ac'}} />
                                            <g>
                                            <path d="M38.1,37.35h9.73a4,4,0,0,1,4,4v8a0,0,0,0,1,0,0H34.1a0,0,0,0,1,0,0v-8A4,4,0,0,1,38.1,37.35Z" transform="translate(-18.05 44.12) rotate(-45.98)" style={{fill: '#ccf6ee'}} />
                                            <path d="M57.41,39.34H75.14a0,0,0,0,1,0,0v49a4,4,0,0,1-4,4H61.41a4,4,0,0,1-4-4v-49a0,0,0,0,1,0,0Z" transform="translate(-27.13 67.76) rotate(-45.98)" style={{fill: '#02a78a'}} />
                                        </g>
                                    </svg>
                                    <div>
                                        <h1 className='font-bold text-[22px] group-hover:text-green-700 transition'>Palette Generator</h1>
                                        <p className='font-light text-sm'>Create your palettes in seconds</p>
                                    </div>    
                                </a>
                            </Link>
                            <Link href='/palettes'>
                                <a className='flex whitespace-nowrap gap-[15px] hover:bg-red-100 transition px-[10px] pr-[30px] py-[14px] rounded-lg group'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='w-[55px]' viewBox="0 0 100 100">
                                        <g><path d="M21,17H38a0,0,0,0,1,0,0V45.92a0,0,0,0,1,0,0H21a7,7,0,0,1-7-7V24A7,7,0,0,1,21,17Z" style={{fill: '#ff4cb5'}} />
                                        <rect x={38} y={17} width={24} height="28.92" style={{fill: '#ff8cd0'}} />
                                        <path d="M62,17H79a7,7,0,0,1,7,7V38.92a7,7,0,0,1-7,7H62a0,0,0,0,1,0,0V17A0,0,0,0,1,62,17Z" style={{fill: '#ffccea'}} /></g>
                                        <g><path d="M21,54.08H38a0,0,0,0,1,0,0V83a0,0,0,0,1,0,0H21a7,7,0,0,1-7-7V61.08A7,7,0,0,1,21,54.08Z" style={{fill: '#ffa6da'}} />
                                        <rect x={38} y="54.08" width={24} height="28.92" style={{fill: '#ff73c5'}} />
                                        <path d="M62,54.08H79a7,7,0,0,1,7,7V76a7,7,0,0,1-7,7H62a0,0,0,0,1,0,0V54.08A0,0,0,0,1,62,54.08Z" style={{fill: '#ff0096'}} /></g>
                                        <path d="M78.51,73A6.54,6.54,0,0,0,70,72.42a6.62,6.62,0,0,0-.83.74,7.27,7.27,0,0,0-.65.84,6.39,6.39,0,0,0-1.29-1.42,6.16,6.16,0,0,0-1.84-1,6.66,6.66,0,0,0-3.3-.33,6.2,6.2,0,0,0-3,1.33,6.44,6.44,0,0,0-.5,9.58l3.93,3.94L66.43,90a3,3,0,0,0,4.17,0l3.93-3.93,3.93-3.94a6.41,6.41,0,0,0,1.9-4.53A6.49,6.49,0,0,0,78.51,73Z" style={{fill: '#ffccea'}} />
                                        <path d="M28.61,50.57a6.44,6.44,0,0,0-4.13-1.89,6.38,6.38,0,0,0-5.2,2,6.4,6.4,0,0,0-.66.84,6.34,6.34,0,0,0-1.28-1.42,6.6,6.6,0,0,0-5.15-1.36,6.19,6.19,0,0,0-3,1.33,6.46,6.46,0,0,0-.5,9.58l3.94,3.94,3.93,3.93a2.95,2.95,0,0,0,4.16,0l3.93-3.93,3.94-3.94a6.46,6.46,0,0,0,0-9.09Z" style={{fill: '#e50087'}} />
                                        <path d="M57.64,10.35a6.44,6.44,0,0,0-4.13-1.89,6.54,6.54,0,0,0-4.38,1.27,6.37,6.37,0,0,0-1.48,1.58,6.11,6.11,0,0,0-1.28-1.42,6.33,6.33,0,0,0-1.85-1,6.63,6.63,0,0,0-3.3-.32,6.28,6.28,0,0,0-3,1.33,6.46,6.46,0,0,0-.5,9.58l3.94,3.94,3.93,3.93a2.92,2.92,0,0,0,2.08.86,2.89,2.89,0,0,0,2.08-.86l3.94-3.93,3.93-3.94a6.46,6.46,0,0,0,0-9.09Z" style={{fill: '#b20069'}} />
                                    </svg>
                                    <div>
                                        <h1 className='font-bold text-[22px] group-hover:text-pink-700 transition'>Explore Palettes</h1>
                                        <p className='font-light text-sm'>Browse millions of trending color schemes</p>
                                    </div>    
                                </a>
                            </Link>
                            <Link href='/contrast-checker'>
                                <a className='flex whitespace-nowrap gap-[15px] hover:bg-orange-100 transition px-[10px] pr-[30px] py-[14px] rounded-lg group'>
                                    <svg
                                    version="1.1"
                                    id="Livello_1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    y="0px"
                                    viewBox="0 0 100 100"
                                    className='w-[55px]'
                                    style={{ enableBackground: "new 0 0 100 100" }}
                                    xmlSpace="preserve"
                                    >
                                    <g>
                                        <g>
                                        <path
                                            style={{ fill: "#FCECB8" }}
                                            d="M83.8,18.9L66.6,34.7C70,38.6,72,43.6,72,49.1c0,12.1-9.8,22-22,22c-6.1,0-11.7-2.5-15.6-6.6
                                                                                L16.3,81.2c1.2,1.1,2.9,1.8,4.7,1.8h58c3.9,0,7-3.1,7-7V24C86,22,85.2,20.2,83.8,18.9z"
                                        />
                                        <path
                                            style={{ fill: "#F6CF45" }}
                                            d="M28,49.1c0-12.1,9.8-22,22-22c6.7,0,12.6,3,16.6,7.6l17.2-15.8C82.6,17.7,80.9,17,79,17H21
                                                                                c-3.9,0-7,3.1-7,7v52c0,2,0.9,3.9,2.3,5.2l18.1-16.7C30.4,60.5,28,55.1,28,49.1z"
                                        />
                                        <path
                                            style={{ fill: "#F6CF45" }}
                                            d="M50,71c12.1,0,22-9.8,22-22c0-5.5-2-10.5-5.3-14.3L34.4,64.5C38.3,68.5,43.9,71,50,71z"
                                        />
                                        <path
                                            style={{ fill: "#FCECB8" }}
                                            d="M50,27.1c-12.1,0-22,9.8-22,22c0,6,2.4,11.4,6.3,15.4l32.3-29.7C62.6,30.1,56.7,27.1,50,27.1z"
                                        />
                                        </g>
                                        <g>
                                        <path
                                            style={{ fill: "#DAAB00" }}
                                            d="M75,94.1H63.5c-1.4,0-2.8-0.5-3.8-1.5s-1.5-2.4-1.6-3.8V77.3c0-2.9,2.4-5.3,5.3-5.3l0,0H75
                                                                                c2.9,0,5.3,2.4,5.4,5.3l0,0v11.5c0,1.4-0.6,2.8-1.6,3.8C77.8,93.6,76.4,94.1,75,94.1z"
                                        />
                                        <g>
                                            <polyline
                                            style={{
                                                fill: "none",
                                                stroke: "#FCECB8",
                                                strokeWidth: "3.4577",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeMiterlimit: 10
                                            }}
                                            points="
                                                                                    63.9,83 67.5,86.6 74.6,79.4 			"
                                            />
                                        </g>
                                        </g>
                                        <g>
                                        <path
                                            style={{ fill: "#A98502" }}
                                            d="M19.8,46.6H8.2c-1.4,0-2.8-0.5-3.8-1.5s-1.5-2.4-1.6-3.8V29.8c0-2.9,2.4-5.3,5.3-5.3l0,0h11.5
                                                                                c2.9,0,5.3,2.4,5.4,5.3l0,0v11.5c0,1.4-0.6,2.8-1.6,3.8C22.5,46.1,21.2,46.6,19.8,46.6z"
                                        />
                                        <g>
                                            <line
                                            style={{
                                                fill: "none",
                                                stroke: "#FCECB8",
                                                strokeWidth: 3,
                                                strokeLinecap: "round",
                                                strokeMiterlimit: 10
                                            }}
                                            x1="19.5"
                                            y1="30.1"
                                            x2="8.5"
                                            y2={41}
                                            />
                                            <line
                                            style={{
                                                fill: "none",
                                                stroke: "#FCECB8",
                                                strokeWidth: 3,
                                                strokeLinecap: "round",
                                                strokeMiterlimit: 10
                                            }}
                                            x1="19.5"
                                            y1={41}
                                            x2="8.5"
                                            y2="30.1"
                                            />
                                        </g>
                                        </g>
                                    </g>
                                    </svg>
                                    <div>
                                        <h1 className='font-bold text-[22px] group-hover:text-orange-700 transition'>Contrast Checker</h1>
                                        <p className='font-light text-sm'>Check the contrast between two colors</p>
                                    </div>    
                                </a>
                            </Link>
                        </div>
                        <div className='bg-[#F7F7F8] p-6 text[15px] font-light'>
                            <h1 className='text-red-400 font-bold text-[14px] mb-3'>OTHER</h1>
                            <Link href='/gradients'>
                                <a className='whitespace-nowrap hover:text-blue-500 transition block mb-2'>Explore Gradients</a>
                            </Link>
                            <Link href='/gradient-maker'>
                                <a className='whitespace-nowrap hover:text-blue-500 transition block mb-2'>Create a Gradient</a>
                            </Link>
                            <Link href='/gradient-palette'>
                                <a className='whitespace-nowrap hover:text-blue-500 mb-3 transition block'>Make a Gradient Palette</a>
                            </Link>
                            <Link href='/color-picker'>
                                <a className='whitespace-nowrap hover:text-blue-500 transition block'>Color Picker</a>
                            </Link>
                            <h1 className='text-orange-400 font-bold text-[14px] mt-5 mb-3'>APPS</h1>
                            <Link href='/'>
                                <a className='whitespace-nowrap hover:text-blue-500 transition block mb-2'>Instagram Page</a>
                            </Link>
                            <Link href='/'>
                                <a className='whitespace-nowrap hover:text-blue-500 transition block mb-2'>Github Page</a>
                            </Link>
                        </div>
                    </div>
                </div>
                {!user ? (
                <div className='pl-5 flex gap-5 items-center text-[15px]'>
                    <button onClick={()=>dispacth(setLoginRes('login'))} className='transition hover:text-blue-500 font-medium'>Sign in</button>
                    <button onClick={()=>dispacth(setLoginRes('register'))} className='bg-blue-500 transition hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium'>Sign up</button>
                </div>
                ) : (
                <div className='relative pl-5 group'>
                    {user.avatar ? (
                        <Image alt='avatar' suppressHydrationWarning={true} width={40} height={40} src={user.avatar.url} className="rounded-full object-cover object-center"/>
                    ) : (
                        <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                            <span className='font-extrabold uppercase'>{user.fullname.charAt(0)}</span>
                        </div>
                    )}
                    <div className='absolute top-full hidden group-hover:block border border-gray-100 right-0 w-[150px] bg-white rounded-lg shadow-lg p-2 divide-y'>
                        <div className='pb-2'>
                            <Link href="/user">
                                <a className='text-[15px] hover:bg-gray-100 block px-3 py-1.5 rounded-lg'>Dashboard</a>
                            </Link>
                        </div>
                        <div className='pt-2'>
                            <Link href={`/u/${user.username}`}>
                                <a className='text-[15px] hover:bg-gray-100 block px-3 py-1.5 rounded-lg'>Profile</a>
                            </Link>
                            <Link href="/account">
                                <a className='text-[15px] hover:bg-gray-100 block px-3 py-1.5 rounded-lg'>Account</a>
                            </Link>
                            <div onClick={handleSignOut} className='text-[15px] cursor-pointer hover:bg-gray-100 block px-3 py-1.5 rounded-lg'>Sign out</div>
                        </div>
                    </div>
                </div>
                )}
            </div>
            <div onClick={showMenuLeft} className='md:hidden cursor-pointer absolute left-4'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </div>
        </div>
        <div className={`bg-white fixed z-50 top-0 left-0 max-w-[320px] mr-4 p-[30px] h-screen duration-300 transition-all ${menuLeft ? 'translate-x-0' : '-translate-x-full'}`}>
            <Link href="/">
                <a className='font-bold text-[#18D39E] text-[22px] block mb-5'>Palette Generator</a>
            </Link>
            <Link href="/">
                <a className='font-bold text-[#FF0096] text-[22px] block mb-10'>Explore Palettes</a>
            </Link>
            <h1 className='font-bold text-gray-400 mb-5'>OTHER</h1>
            <Link href="/">
                <a className='font-medium block mb-3.5 text-lg'>Create a Gradients</a>
            </Link>
            <Link href="/">
                <a className='font-medium block mb-10 text-lg'>Color Picker</a>
            </Link>
            <h1 className='font-bold text-gray-400 mb-5'>APPS</h1>
            <Link href="/">
                <a className='font-medium block mb-3.5 text-lg'>Instagram Page</a>
            </Link>
            <Link href="/">
                <a className='font-medium block mb-10 text-lg'>Github Page</a>
            </Link>
            <h1 className='font-bold text-gray-400 mb-5'>ACCOUNT</h1>
            <button onClick={()=>dispacth(setLoginRes('login'))} className='font-medium block mb-3.5 text-lg'>Sign in</button>
            <button onClick={()=>dispacth(setLoginRes('register'))} className='font-medium block text-lg'>Sign up</button>
        </div>
        {menuLeft && (
        <div onClick={removeMenuLeft} className="fixed w-screen h-screen bg-black/30 top-0 left-0 z-40"></div>
        )}
        </>
    )
}