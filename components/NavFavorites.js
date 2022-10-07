import Link from "next/link";
import { useRouter } from "next/router";

export default function NavFavorites() {
    const Router = useRouter();
    return (
        <div className="mb-10">
            <div className='flex flex-wrap gap-2 justify-center'>
                <Link href={'/user/favorites/palettes'}>
                    <a className={`border flex items-center gap-2 px-3 rounded-full py-1.5 ${Router.pathname==='/user/favorites/palettes' ? 'bg-gray-100 font-bold' : 'hover:bg-gray-100 transition'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                        </svg>
                        <span className='text-[15px]'>Palettes</span>
                    </a>
                </Link>
                <Link href={'/user/favorites/colors'}>
                    <a className={`border font-medium flex items-center gap-2 px-3 rounded-full py-1.5 ${Router.pathname==='/user/favorites/colors' ? 'bg-gray-100 font-bold' : 'hover:bg-gray-100 transition'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M7.21.8C7.69.295 8 0 8 0c.109.363.234.708.371 1.038.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8zm.413 1.021A31.25 31.25 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
                            <path fillRule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448z"/>
                        </svg>
                        <span className='text-[15px]'>Colors</span>
                    </a>
                </Link>
                <Link href={'/user/favorites/gradients'}>
                    <a className={`border font-medium flex items-center gap-2 px-3 rounded-full py-1.5 ${Router.pathname==='/user/favorites/gradients' ? 'bg-gray-100 font-bold' : 'hover:bg-gray-100 transition'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                        <span className='text-[15px]'>Gradients</span>
                    </a>
                </Link>
                <Link href={'/user/favorites/projects'}>
                    <a className={`border font-medium flex items-center gap-2 px-3 rounded-full py-1.5 ${Router.pathname==='/user/favorites/projects' ? 'bg-gray-100 font-bold' : 'hover:bg-gray-100 transition'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                        </svg>
                        <span className='text-[15px]'>Projects</span>
                    </a>
                </Link>
                <Link href={'/user/favorites/collections'}>
                    <a className={`border font-medium flex items-center gap-2 px-3 rounded-full py-1.5 ${Router.pathname==='/user/favorites/collections' ? 'bg-gray-100 font-bold' : 'hover:bg-gray-100 transition'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                        </svg>
                        <span className='text-[15px]'>collections</span>
                    </a>
                </Link>
            </div>
        </div>
    )
}