import Link from 'next/link';
import { useEffect, useState } from 'react';
import randomColor from 'randomcolor';
import { useRouter } from 'next/router';

export default function Hero(){
    const Router = useRouter();
    const initial = { c1: randomColor(), c2: randomColor(), c3: randomColor(), c4: randomColor(), c5: randomColor() };
    const [bgLaptop, setBgLaptop] = useState({ c1: randomColor(), c2: randomColor(), c3: randomColor(), c4: randomColor(), c5: randomColor() });
    const handleClick = (id) => {
        if (id==='homepage_hero-generate' || id==='homepage_hero-generate-btn') {
            Router.push('/generate');
        }else {
            Router.push('/palettes');
        }
    }
    useEffect(()=>{
        const timeInterval = setInterval(()=>{
            setBgLaptop(initial);
        },600);
        return ()=> clearInterval(timeInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[bgLaptop])
    return (
        <div className="mt-[120px] md:mt-[180px] md:pl-10 max-w-screen-2xl mx-auto flex-col flex md:flex-row mb-[150px]">
            <div className='max-w-[400px] mx-auto xl:max-w-[500px] order-2 md:order-1'>
                <h1 className='text-5xl xl:text-7xl mb-8 tracking-tighter font-black text-center'>The super fast color palettes generator!</h1>
                <p className='text-center px-6 mb-10 text-lg xl:w-[80%] mx-auto'>Create the perfect palette or get inspired by thousands of beautiful color schemes.</p>
                <Link href='/generate'>
                    <a className='block mx-auto w-max px-12 rounded-xl py-2.5 bg-blue-500 transition hover:bg-blue-600 mb-4 text-white font-medium'>Start the generator!</a>
                </Link>
                <Link href='/palettes'>
                    <a className='block mx-auto w-max px-7 rounded-xl py-2.5 transition hover:border-gray-400 border border-gray-300 font-medium'>Explore trending palettes</a>
                </Link>
            </div>
            <div className='flex-1 order-1 md:order-2 relative overflow-hidden'>
                <img alt='hero' className='w-[560px] xl:w-[690px] 2xl:w-[660px] hidden md:block h-auto bg-repeat-y img-hero -z-10 top-0 left-[210px] xl:left-[255px] 2xl:left-[310px] absolute' src="/hero_palettes.png" />
                <div className='h-full w-full overflow-hidden hidden md:block'>
                    <svg className='top-0 h-full overflow-hidden' version="1.1" id="homepage_hero_image-desktop" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 980.6 548" xmlSpace="preserve">
                        <path className='fill-white' d="M0,0v759h980.6V0H0z M956.6,461.5h-655v-450h655V461.5z"></path>
                        <path className='hidden fill-white' d="M438.5,281v-9.7c0-2.9-2.4-5.3-5.3-5.3l0,0H58.8c-2.9,0-5.3,2.4-5.3,5.3l0,0v9.7H438.5z"></path>
                        <g id="homepage_hero-generate-btn" onClick={()=>handleClick('homepage_hero-generate-btn')} className='cursor-pointer'>
                            <g id="homepage_hero-generate-btn-text" className="st319">
                                <rect x="48.7" y="170.9" className="fill-white" width="123.4" height="25.4"></rect>
                                <path className="fill-black" d="M55,182.1c0.1-3.9,0.4-6.6,1-6.6h0.1c0.1,0.1,0.7,0.2,0.8,0.8c0.4,1.8,1.1,4.9,2.5,7
                                            c0.2-0.1,1.1-1.7,1.6-2.6l0.1-0.2c0.9-1.6,1.5-2.8,2.1-4.3c0.1-0.3,0.3-0.4,0.7-0.4c0.3,0,0.5,0.1,0.8,0.4
                                            c-0.2,5.3-0.1,10.7-0.2,16v1.2c-0.1,0.3-0.4,0.6-0.8,0.6c-0.2,0-0.4-0.2-0.6-0.3v-1.4c0.1-4.3-0.1-8.7,0.1-13
                                            c-0.6,1-1.2,2.1-1.7,3.1c-0.2,0.4-1.2,2.3-1.4,2.8c-0.1,0.3-0.8,1.1-1.2,0.2c-2.4-5.4-2.5-5.4-2.5-5.4c-0.5,4.3-0.6,8.8-0.6,13.2
                                            c0,0.3-0.3,0.5-0.5,0.5c-0.1,0-0.6-0.2-0.7-0.3L55,182.1z"></path>
                                <path className="fill-black" d="M68.9,189.1l-0.1,0.1l-0.4,2.7c0,0.4,0,1.4-0.7,1.4c-0.3,0-0.5-0.6-0.5-0.9c2.5-17.4,2.5-17.4,2.5-17.4
                                            c0.1-0.5,0.3-1.1,0.9-1.1c0.3,0,0.6,0.1,0.7,0.4l0.2,0.5c1.4,5.5,2,11.1,2.7,16.8l0.1,1.6l0,0c-0.2,0.5-0.3,0.6-0.7,0.6h-0.1
                                            c-0.1,0-0.4,0-0.4-0.2l-0.6-4.6L68.9,189.1L68.9,189.1z M69.2,187.6l3,0.1l-1.6-11.2L69.2,187.6z"></path>
                                <path className="fill-black" d="M76.6,175.4c0-0.4,0.3-0.7,0.7-0.7c0.5,0,0.7,0.3,0.7,0.9l0.2,8c1.4-2.9,2.6-5.4,3.2-7.4
                                            c0.2-0.7,0.2-1.6,1.1-1.6c0.3,0,1,0.1,0.6,1.2l-3.9,9l4.5,8.3c0.2,0.4,0,1.1-0.6,1.1c-0.3,0-0.4,0-0.6-0.3
                                            c-1.3-2.4-2.6-5.6-4.3-8.1v0.2c0,1.1,0.3,5,0.3,8.1c-0.3,0.6-1.3,0.9-1.3,0L76.6,175.4z"></path>
                                <path className="fill-black" d="M85.8,176.8c0-0.4,0.4-0.8,0.8-0.8h3.8c0.1,0,0.6,0.4,0.6,0.5v0.1c0,0.5-0.6,0.7-1,0.7h-2.9l0.1,8l2.6-0.4
                                            H90c1.1,0,0.7,1.1-0.3,1.2l-2.4,0.4l-0.1,6.3c0.2,0,1,0,1.2,0c1.6,0,2.8-0.6,2.9,0.6c0,0.8-5.3,0.7-5.3,0.3L85.8,176.8z"></path>
                                <path className="fill-black" d="M102.8,189.1l-0.1,0.1l-0.4,2.7c0,0.4,0,1.4-0.7,1.4c-0.3,0-0.5-0.6-0.5-0.9c2.5-17.4,2.5-17.4,2.5-17.4
                                            c0.1-0.5,0.3-1.1,0.9-1.1c0.3,0,0.6,0.1,0.7,0.4l0.2,0.5c1.4,5.5,2,11.1,2.7,16.8l0.1,1.6l0,0c-0.2,0.5-0.3,0.6-0.7,0.6h-0.1
                                            c-0.1,0-0.4,0-0.4-0.2l-0.6-4.6L102.8,189.1L102.8,189.1z M103.1,187.6l3,0.1l-1.6-11.2L103.1,187.6z"></path>
                                <path className="fill-black" d="M117.7,188.4c0-1.9,0.1-10.9,0.2-12.8c0.1-0.3,0.7-0.3,1-0.3c2.5,0,4.3,2.2,4.3,4.6c0,2.6-1.8,5.5-4.2,6.6
                                            c0,0.4-0.1,2.3-0.1,2.6c0,0.8,0,4.5,0,5.3c-0.1,0.2-0.5,0.3-0.7,0.3s-0.3,0-0.5-0.1C117.7,194.6,117.7,188.4,117.7,188.4z
                                            M119,184.9c0.2,0,0.4,0,0.5-0.2c1.4-1.3,2.2-2.7,2.2-4.7c0-1.2-0.9-3.5-2.5-3.5L119,184.9z"></path>
                                <path className="fill-black" d="M125.7,189.1l-0.1,0.1l-0.4,2.7c0,0.4,0,1.4-0.7,1.4c-0.3,0-0.5-0.6-0.5-0.9c2.5-17.4,2.5-17.4,2.5-17.4
                                            c0.1-0.5,0.3-1.1,0.9-1.1c0.3,0,0.6,0.1,0.7,0.4l0.2,0.5c1.4,5.5,2,11.1,2.7,16.8l0.1,1.6l0,0c-0.2,0.5-0.3,0.6-0.7,0.6h-0.1
                                            c-0.1,0-0.4,0-0.4-0.2l-0.6-4.6L125.7,189.1L125.7,189.1z M126.1,187.6l3,0.1l-1.6-11.2L126.1,187.6z"></path>
                                <path className="fill-black" d="M133.4,194.1c0,0-0.3-12.4-0.3-14c0-0.5-0.3-4.1-0.3-4.6v-0.2c0-0.2,0-0.3,0.2-0.4c0.1,0,0.4,0,0.5,0
                                            c0.4,0,0.6,0,0.8,0.5c0.2,0.9,0.1,1.5,0.1,2.4c0.1,4.9,0.2,9.9,0.5,14.8h0.2c1,0,2-0.3,3-0.3c0.4,0,0.8,0.1,0.8,0.6
                                            c0,0.3-0.1,0.5-0.5,0.5L133.4,194.1z"></path>
                                <path className="fill-black" d="M140.2,176.8c0-0.4,0.4-0.8,0.8-0.8h3.8c0.1,0,0.6,0.4,0.6,0.5v0.1c0,0.5-0.6,0.7-1,0.7h-2.9l0.1,8l2.6-0.4
                                            h0.1c1.1,0,0.7,1.1-0.3,1.2l-2.4,0.4l-0.1,6.3c0.2,0,1,0,1.2,0c1.6,0,2.8-0.6,2.9,0.6c0,0.8-5.3,0.7-5.3,0.3L140.2,176.8z"></path>
                                <path className="fill-black" d="M149.7,176.5c-1.5,0.1-2.2,0.1-2.2-0.3c0-0.8,0-1.1,2.5-1h2c0.5,0,1.4,0.1,1.4,0.8c0,0.2-0.3,0.5-0.5,0.5
                                            h-2l0.5,15.2c0,0.2-0.5,0.3-0.6,0.3s-0.6-0.1-0.6-0.3L149.7,176.5z"></path>
                                <path className="fill-black" d="M157.1,176.5c-1.5,0.1-2.2,0.1-2.2-0.3c0-0.8,0-1.1,2.5-1h2c0.5,0,1.4,0.1,1.4,0.8c0,0.2-0.3,0.5-0.5,0.5
                                            h-2l0.5,15.2c0,0.2-0.5,0.3-0.6,0.3s-0.6-0.1-0.6-0.3L157.1,176.5z"></path>
                                <path className="fill-black" d="M162,176.8c0-0.4,0.4-0.8,0.8-0.8h3.8c0.1,0,0.6,0.4,0.6,0.5v0.1c0,0.5-0.6,0.7-1,0.7h-2.9l0.1,8l2.6-0.4
                                        h0.1c1.1,0,0.7,1.1-0.3,1.2l-2.4,0.4l-0.1,6.3c0.2,0,1,0,1.2,0c1.6,0,2.8-0.6,2.9,0.6c0,0.8-5.3,0.7-5.3,0.3L162,176.8z"></path>
                            </g>
                            <g id="homepage_hero-generate-btn-arrow">
                                <path className="fill-white stroke-black" d="M186.5,188.1c0,0,16.6,5.3,17.2,24.7"></path>
                                <polygon className="fill-black" points="199.4,209.8 200,209 203.6,212.5 206.8,208.7 207.5,209.3 203.7,213.9"></polygon>
                            </g>
                        </g>
                        <g id="homepage_hero-explore" onClick={()=>handleClick('homepage_hero-explore')} className='cursor-pointer'>
                            <rect x="570.2" y="464.6" className='fill-[#E1E1E5]' width="118.4" height="73.9"></rect>
                            <path className='fill-black' d="M958,6H299.6c-8.4,0-15.1,6.8-15.1,15.1v431.7c0,8.4,6.8,15.1,15.1,15.1H958c8.4,0,15.1-6.8,15.1-15.1V21.1
                                    C973.1,12.8,966.3,6,958,6z M963,20.3v433.5c0,2.3-1.9,4.2-4.2,4.2h-660c-2.3,0-4.2-1.9-4.2-4.2V20.3c0-2.3,1.9-4.2,4.2-4.2h660.1
                                    C961.1,16.1,963,18,963,20.3z"></path>
                            <path className='fill-[#C9C8CC]' d="M532.6,532h193l0,0c0,5.5-4.5,10-10,10h-173C537.1,542,532.6,537.5,532.6,532L532.6,532z"></path>
                            <path className='fill-transparent' d="M963,20.3v433.5c0,2.3-1.9,4.2-4.2,4.2h-660c-2.3,0-4.2-1.9-4.2-4.2V20.3c0-2.3,1.9-4.2,4.2-4.2h660.1
                                    C961.1,16.1,963,18,963,20.3z"></path>
                        </g>
                        <g id="homepage_hero-explore-btn" onClick={()=>handleClick('homepage_hero-explore-btn')} className='cursor-pointer'>
                            <g id="homepage_hero-explore-btn-text">
                                <rect x="167.4" y="62.9" className='fill-white' width="62.9" height="25.4"></rect>
                                <path className="fill-black" d="M172.4,81.5v-4.8c0-3.4-0.3-5.6-0.3-9.1v-1.2c3.8-0.3,4.3,0,4.3,0.5c0,0.2-0.1,0.5-0.3,0.6h-2.6
                                            c-0.2,0-0.2,0.1-0.2,0.2c0,2.5,0.2,4.4,0.4,7c0.4,0.1,2.4,0,2.8,0c0.8,0,1.4,1.4,0.3,1.4h-3v5.6c0.6,0.1,3.6-0.5,3.6,0.6
                                            c0,0.3-0.1,0.6-0.5,0.6h-0.1c-0.9,0.1-4.3,0.3-4.3-0.4L172.4,81.5z"></path>
                                <path className="fill-black" d="M181,84.6c-0.1,0-0.4,0-0.5,0c-0.3,0-0.8,0-0.8-0.4v-0.1c0-0.1,0.3-0.7,0.3-0.8c0.4-1.2,2.3-6.9,2.6-8.1
                                            v-0.3c0-0.5-0.1-0.7-0.3-1.4c-0.2-0.6-1.2-3.3-1.4-3.9c-0.1-0.3-0.8-2-0.9-2.4c-0.1-0.3-0.3-0.6-0.3-0.9c0-0.5,0.1-0.5,0.6-0.5
                                            c0.9,0,1.2,1.1,1.5,1.8c0.2,0.7,1.5,4.1,1.7,4.8l1.4-4.6c0.1-0.6,0.4-2.6,1.4-2.3c0.5,0.1,0.5,0.8,0.5,1.2l-1.4,4.1
                                            c-0.3,0.9-0.9,3.2-0.9,3.3V75c0,0,0.7,2.4,1.1,3.3c0.7,2,1.6,4.1,2.2,6.1c-0.2,0.4-0.3,0.5-0.7,0.5c-0.2,0-0.4,0-0.6-0.2l-0.1-0.3
                                            c-0.1-0.2-0.7-2-0.8-2.2c-0.5-1.4-1-2.9-1.6-4.4c-0.1-0.2-0.3-0.8-0.3-0.8L181,84.6z"></path>
                                <path className="fill-black" d="M189.5,84.4c0-2.8,0.1-15.7,0.2-18.6c0.2-0.3,0.8-0.5,1.1-0.5c3.1,0,4.6,2.6,4.6,5.5c0,3.4-1.4,5.4-4.3,7
                                            l-0.2,1.5c0,0.8-0.1,4.5-0.2,5.2c-0.1,0.4-0.2,0.5-0.6,0.5C189.9,85.1,189.5,85,189.5,84.4L189.5,84.4z M191,75.2v1
                                            c0.3,0,0.8-0.3,0.8-0.4c1.6-1.3,2-2.8,2-4.7c0-1.5-0.2-4.3-2.3-4.3c-0.1,0-0.3,0-0.3,0.2L191,75.2z"></path>
                                <path className="fill-black" d="M198.3,65.5c0.4,0,0.7,0.5,0.8,0.8c0.2,5.4,0.2,10.9,0.6,16.4c0.7-0.2,1.9-0.5,2.9-0.5
                                            c0.4,0,0.8,0.1,0.8,0.6c0,0.3-0.1,0.6-0.5,0.7c-0.8,0.3-1.9,0.2-2.7,0.5c-0.3,0.1-0.6,0.3-1,0.3c-0.3,0-0.7-0.3-0.7-0.6
                                            c-0.3-2.9-0.2-6-0.3-8.8l-0.3-5.9v-3C198,65.6,198.1,65.5,198.3,65.5z"></path>
                                <path className="fill-black" d="M207,66.2c5.3,0,6,17.1,0.8,17.5c-0.1,0-0.2,0-0.3,0c-2,0-3.1-1.2-3.7-3.4C203.5,78.9,201,66.2,207,66.2z
                                                M205,79.2c0.2,0.8,1,3.1,2.2,3.2c0.1,0,0.2,0,0.3,0c1.6-0.1,2.1-3,2.4-4.1c0.4-1.9,0.7-10.8-2.7-10.8H207
                                            C203.3,67.8,204.5,77.5,205,79.2z"></path>
                                <path className="fill-black" d="M213,74.4c0-0.7-0.1-5.1-0.2-6.2c0-0.2-0.1-2.4-0.2-2.6v-0.1c0-0.6,0.6-0.7,1.1-0.7c3.3,0,4.5,2.4,4.5,5.1
                                            c0,2.2-0.8,3.6-2.4,4.7c2.8,1.2,3.4,5.1,3.4,7.8c0,0.4-0.3,0.6-0.7,0.6c-0.3,0-0.4,0-0.5-0.4c-0.1-1.8-0.6-6.9-3.4-6.9h-0.2
                                            c-0.3,2.7,0,5.4-0.2,8.2c-0.3,0.4-1,0.5-1.3,0C213.1,82.5,213.1,75.9,213,74.4z M214.4,73.8c1.7-0.3,2.6-2.2,2.6-3.7
                                            c0-1.3-0.5-3.9-2.3-3.9c-0.1,0-0.8,0-0.8,0.2L214.4,73.8z"></path>
                                <path className="fill-black" d="M221.7,81.5v-4.8c0-3.4-0.3-5.6-0.3-9.1v-1.2c3.8-0.3,4.3,0,4.3,0.5c0,0.2-0.1,0.5-0.3,0.6h-2.6
                                            c-0.2,0-0.2,0.1-0.2,0.2c0,2.5,0.2,4.4,0.4,7c0.4,0.1,2.4,0,2.8,0c0.8,0,1.4,1.4,0.3,1.4h-3v5.6c0.6,0.1,3.6-0.5,3.6,0.6
                                            c0,0.3-0.1,0.6-0.5,0.6H226c-0.9,0.1-4.3,0.3-4.3-0.4V81.5z"></path>
                            </g>
                            <g id="homepage_hero-explore-btn-arrow" className='w-[300px]'>
                                <path className="fill-white stroke-black" d="M220.3,102.2c0,0,5.3,16.6,24.7,17.2"></path>
                                <polygon className="st320" points="241.5,123.3 240.9,122.5 244.7,119.4 241.2,115.8 242,115.2 246.1,119.5"></polygon>
                            </g>
                        </g>
                        <g id="homepage_hero-generate" onClick={()=>handleClick('homepage_hero-generate')} className='cursor-pointer'>
                            <path className="fill-black" d="M448.5,535.5V267c0.1-7.6-6.1-13.9-13.8-14c0,0,0,0-0.1,0H57.3c-7.7,0.1-13.9,6.3-13.9,13.9c0,0,0,0,0,0.1v268.5H448.5z"></path>
                            <g id="homepage_hero-generator-laptop">
                                <path style={{ fill: bgLaptop.c1 }} d="M322.5,262.9h112c2.2,0,4,1.8,4,4v255h-116V262.9z"></path>
                                <rect style={{ fill: bgLaptop.c2 }} x="247.5" y="262.9" width="115" height="259"></rect>
                                <rect style={{ fill: bgLaptop.c3 }} x="169.5" y="262.9" width="115" height="259"></rect>
                                <rect style={{ fill: bgLaptop.c4 }} x="92.5" y="262.9" width="116" height="259"></rect>
                                <path style={{ fill: bgLaptop.c5 }} d="M57.5,262.9h74v259h-78v-255C53.5,264.7,55.3,262.9,57.5,262.9z"></path>
                            </g>
                            <path className='fill-[#C9C8CC]' d="M7.5,532h480l0,0c0,5.5-4.5,10-10,10h-460C12,542,7.5,537.5,7.5,532L7.5,532z"></path>
                        </g>
                        <g>
                            <path className="fill-[#02D1AC]" d="M780.7,454.9v61.2h30.7v-61.2c0-9.3-6.9-16.8-15.3-16.8l0,0C787.6,438.2,780.7,445.7,780.7,454.9z"></path>
                            <g>
                                <path className="fill-[#02D1AC]" d="M820.1,492.9h-21.7c-3.7,0-6.7-3-6.7-6.7s3-6.7,6.7-6.7h21.7c0.8,0,1.4-0.6,1.4-1.4V470
                                        c0-3.7,3-6.7,6.7-6.7s6.7,3,6.7,6.7v8.1C834.9,486.3,828.2,492.9,820.1,492.9z"></path>
                            </g>
                            <g>
                                <path className="fill-[#02D1AC]" d="M791.5,502.9h-19.8c-7.6,0-13.7-6.5-13.7-14.4v-3.2c0-3.5,2.8-6.4,6.4-6.4c3.5,0,6.4,2.8,6.4,6.4v3.2
                                        c0,1,0.6,1.7,1,1.7h19.8c3.5,0,6.4,2.8,6.4,6.4S795.1,502.9,791.5,502.9z"></path>
                            </g>
                            <g>
                                <path className="fill-[#E1E1E5]" d="M765.1,513.5l2.4,18.3l0.1,0.8c0,0.2,0.1,0.5,0.1,0.7h56.4c0-0.2,0.1-0.5,0.1-0.7l0.1-0.8l2.4-18.3H765.1z"></path>
                                <path className="fill-[#C9C8CC]" d="M767.7,533.3c1,5.1,5.4,8.8,10.6,8.8c10.8,0,24.3,0,35.1,0c5.2,0,9.6-3.7,10.6-8.8H767.7z"></path>
                            </g>
                        </g>
                    </svg>
                </div>
                <div className='block md:hidden px-4 mb-16'>
                    <svg version="1.1" id="homepage_hero_image-mobile" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 498.94 301.86" style={{enableBackground: 'new 0 0 498.94 301.86'}} xmlSpace="preserve">
                        <style type="text/css" dangerouslySetInnerHTML={{__html: "\n\t.st01{fill:#9B5DE5;}\n\t.st11{fill:#F15BB5;}\n\t.st21{fill:#FEE440;}\n\t.st31{fill:#00BBF9;}\n\t.st41{fill:#00F5D4;}\n\t.st51{fill:#C9C8CC;}\n" }} />
                        <path d="M450.79,288.72V20.22c0.1-7.6-6.1-13.9-13.8-14c0,0,0,0-0.1,0H59.59c-7.7,0.1-13.9,6.3-13.9,13.9c0,0,0,0,0,0.1v268.5
                        H450.79z" />
                        <g id="homepage_hero-generator-laptop-mobile">
                        <path className="st01" d="M324.79,16.12h112c2.2,0,4,1.8,4,4v255h-116V16.12z" style={{fill: bgLaptop.c1}} />
                        <rect x="249.79" y="16.12" className="st11" width={115} height={259} style={{fill: bgLaptop.c2}} />
                        <rect x="171.79" y="16.12" className="st21" width={115} height={259} style={{fill: bgLaptop.c3}} />
                        <rect x="94.79" y="16.12" className="st31" width={116} height={259} style={{fill: bgLaptop.c4}} />
                        <path className="st41" d="M59.79,16.12h74v259h-78v-255C55.79,17.92,57.59,16.12,59.79,16.12z" style={{fill: bgLaptop.c5}} />
                        </g>
                        <path className="st51" d="M9.79,285.22h480l0,0c0,5.5-4.5,10-10,10h-460C14.29,295.22,9.79,290.72,9.79,285.22L9.79,285.22z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}