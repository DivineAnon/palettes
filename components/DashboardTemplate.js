import Link from "next/link";
import { useRouter } from "next/router";
import randomColor from "randomcolor";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header, Layout } from "../components";
import { getRandomRangeNumber } from "../lib";
import { handleSaveColor, handleSaveGradient, handleSavePalette, openPopupCollection, openPopupProject, setDataMenuMore } from "../slices/popupSlice";
import { selectUser } from "../slices/userSlice";

export default function DashboardTemplate({ children }){
    const Router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const btnRef = useRef(null);
    const handleAdd = (option) => {
        if (option==='palette') {
            dispatch(handleSavePalette(user,randomColor({ count: 5 }).map(hex=>hex.slice(1)),'save'));
        }
        if (option==='color') {
            dispatch(handleSaveColor(user,'save',randomColor().slice(1)));
        }
        if (option==='collection') {
            dispatch(openPopupCollection());
        }
        if (option==='project') {
            dispatch(openPopupProject());
        }
        if (option==='gradient') {
            let colors = randomColor({ count: getRandomRangeNumber(2,4) });
            colors = colors.map((hex,i)=>({ color: hex.slice(1), index: i, position: (100/(colors.length-1))*i }));
            dispatch(handleSaveGradient(user,{ palette: JSON.stringify(colors), type: 'linear', rotation: 90 },'save'));
        }
    }
    const menuMore = ()=> (
        <section>
            <div onClick={()=>handleAdd('palette')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                </svg>
                <span className="md:text-sm font-medium">Palette</span>
            </div>
            <div onClick={()=>handleAdd('color')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M7.21.8C7.69.295 8 0 8 0c.109.363.234.708.371 1.038.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8zm.413 1.021A31.25 31.25 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
                    <path fillRule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448z"/>
                </svg>
                <span className="md:text-sm font-medium">Color</span>
            </div>
            <div onClick={()=>handleAdd('gradient')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <span className="md:text-sm font-medium">Gradient</span>
            </div>
            <div onClick={()=>handleAdd('project')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
                <span className="md:text-sm font-medium">Project</span>
            </div>
            <div onClick={()=>handleAdd('collection')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
                <span className="md:text-sm font-medium">Collection</span>
            </div>
        </section>
    )
    return (
        <Layout title={'Dashboard - Palettes'}>
            <Header isFixed={true}/>
            <div className="fixed hidden md:flex flex-col left-0 w-[220px] lg:w-[250px] border-r h-[calc(100%-60px)]">
                <div className="p-5 flex-1">
                    <Link href={'/user/palettes'}>
                        <a className={`flex items-center gap-3 py-2.5 px-3 rounded-lg mb-2.5 ${Router.asPath==='/user/palettes' ? 'bg-gray-200/80 font-semibold' : 'hover:bg-gray-100 transition'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                            </svg>
                            <span>Palettes</span>
                        </a>
                    </Link>
                    <Link href={'/user/colors'}>
                        <a className={`flex items-center gap-3 py-2.5 px-3 rounded-lg mb-2.5 ${Router.asPath==='/user/colors' ? 'bg-gray-200/80 font-semibold' : 'hover:bg-gray-100 transition'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M7.21.8C7.69.295 8 0 8 0c.109.363.234.708.371 1.038.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8zm.413 1.021A31.25 31.25 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
                                <path fillRule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448z"/>
                            </svg>
                            <span>Colors</span>
                        </a>
                    </Link>
                    <Link href={'/user/gradients'}>
                        <a className={`flex items-center gap-3 py-2.5 px-3 rounded-lg mb-[30px] ${Router.asPath==='/user/gradients' ? 'bg-gray-200/80 font-semibold' : 'hover:bg-gray-100 transition'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            <span>Gradients</span>
                        </a>
                    </Link>
                    <Link href={'/user/projects'}>
                        <a className={`flex items-center gap-3 py-2.5 px-3 rounded-lg mb-2.5 ${Router.asPath==='/user/projects' ? 'bg-gray-200/80 font-semibold' : 'hover:bg-gray-100 transition'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                            </svg>
                            <span>Projects</span>
                        </a>
                    </Link>
                    <Link href={'/user/collections'}>
                        <a className={`flex items-center gap-3 py-2.5 px-3 rounded-lg mb-2.5 ${Router.asPath==='/user/collections' ? 'bg-gray-200/80 font-semibold' : 'hover:bg-gray-100 transition'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                            </svg>
                            <span>Collections</span>
                        </a>
                    </Link>
                    <Link href={'/user/favorites'}>
                        <a className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${Router.asPath==='/user/favorites' ? 'bg-gray-200/80 font-semibold' : 'hover:bg-gray-100 transition'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                            <span>Favorites</span>
                        </a>
                    </Link>
                </div>
                <div className="p-5">
                    <button onClick={()=>dispatch(setDataMenuMore({ elementRef: btnRef.current, width: btnRef.current.getBoundingClientRect().width, Children: menuMore }))} ref={btnRef} className="bg-blue-500 transition hover:bg-blue-600 h-9 flex text-white items-center w-full rounded-lg text-sm px-3">
                        <span className="flex-1">New</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="md:w-[calc(100%-220px)] lg:w-[calc(100%-250px)] md:ml-[220px] lg:ml-[250px] p-[30px] md:p-10">
                {children}
                <button onClick={()=>dispatch(setDataMenuMore({ elementRef: btnRef.current, width: 179, Children: menuMore }))} className="md:hidden z-20 fixed right-5 bottom-5 bg-blue-500 w-[50px] h-[50px] rounded-full flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </Layout>
    )
}
