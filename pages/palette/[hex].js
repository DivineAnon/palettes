import axios from "axios";
import chroma from "chroma-js";
import Link from "next/link";
import { Fragment, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Footer, Header, Layout, Palette, PaletteBox } from "../../components";
import { dataCreatePalette, colorsGroup, usePushNotif,  } from "../../lib";
import { handleAddQuery, selectPalettes, setPalettes } from "../../slices/palettesSlice";
import { handleSavePalette, setDataExportPalette, setDataFullscreenPalette, setDataMenuMore, setDataQuickView } from "../../slices/popupSlice";
import { selectSinglePalette, setSinglePalette } from "../../slices/singlePaletteSlice";
import { selectUser } from "../../slices/userSlice";
import { wrapper } from '../../store';

export default function PaletteView({ hexArray, palette }){
    const user = useSelector(selectUser);
    const singlePalette = useSelector(selectSinglePalette);
    const simillarPalettes = useSelector(selectPalettes);
    const dispatch = useDispatch();
    const btnMoreRef = useRef(null);
    const handlePushNotif = usePushNotif();
    const handleMenuMore = (menu) => {
        if (menu==='openPalette') {
            window.open(`/palette/${hexArray.join('-')}`);
        }
        if (menu==='openGenerator') {
            window.open(`/${hexArray.join('-')}`);
        }
        if (menu==='quickView') {
            dispatch(setDataQuickView(hexArray));
        }
        if (menu==='copyURL') {
            navigator.clipboard.writeText(window.location.origin+`/palette/${hexArray.join('-')}`);
            handlePushNotif({ text: 'URL copied to the clipboard!', className: 'bg-black', icon: 'checklist' });
        }
        if (menu==='exploreSimillar') {
            const [color] = colorsGroup.filter(q=>q.value===palette.colorGroup);
            dispatch(handleAddQuery({ type: 'colors', data: color }));
        }
        if (menu==='exportPalette'){
            dispatch(setDataExportPalette(hexArray));
        }
        if (menu==='fullscreen') {
            dispatch(setDataFullscreenPalette(palette.palette,'palette'));
        }
    }
    const menuMorePalette = ()=> (
        <Fragment>
            <section className="mb-2">
                <div onClick={()=>handleMenuMore('openGenerator')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-wand" width={20} height={20} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <polyline points="6 21 21 6 18 3 3 18 6 21" />
                        <line x1={15} y1={6} x2={18} y2={9} />
                        <path d="M9 3a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
                        <path d="M19 13a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
                    </svg>
                    <span className="md:text-sm font-medium">Open in the generator</span>
                </div>
                <div onClick={()=>handleMenuMore('copyURL')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="md:text-sm font-medium">Copy URL</span>
                </div>
                <div onClick={()=>handleMenuMore('exploreSimillar')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <span className="md:text-sm font-medium">Explore simillar</span>
                </div>
            </section>
            <section className="pt-2 mb-2">
                <div onClick={()=>handleMenuMore('quickView')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="md:text-sm font-medium">Quick View</span>
                </div>
                <div onClick={()=>handleMenuMore('fullscreen')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrows-diagonal" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <polyline points="16 4 20 4 20 8"></polyline>
                        <line x1="14" y1="10" x2="20" y2="4"></line>
                        <polyline points="8 20 4 20 4 16"></polyline>
                        <line x1="4" y1="20" x2="10" y2="14"></line>
                    </svg>
                    <span className="md:text-sm font-medium">View fullscreen</span>
                </div>
            </section>
            <section className="pt-2">
                <div onClick={()=>handleMenuMore('exportPalette')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="md:text-sm font-medium">Export Palette</span>
                </div>
                <div onClick={()=>dispatch(handleSavePalette(user,palette.palette,'save','single'))} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="md:text-sm font-medium">Save Palette</span>
                </div>
            </section>
        </Fragment>
    )
    return (
        <Layout title={"Palette - Palettes"}>
            <Header/>
            <div className="mt-[170px] px-6 md:px-10 max-w-screen-2xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <h1 className="text-5xl font-black tracking-tighter">Palette</h1>
                    <div className="flex group">
                        <div onClick={()=>dispatch(handleSavePalette(user,palette.palette,'save','single'))} className="flex items-center gap-2 border border-r-0 border-gray-300 hover:border-gray-400 transition px-4 py-2.5 rounded-tl-xl rounded-bl-xl cursor-pointer">
                            {singlePalette?.saves.map(data=>data.author.id).includes(user?.id) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            )}
                            <span className="font-semibold">{singlePalette?.saves.length}</span>
                        </div>
                        <div className="flex-1 w-[1px] bg-gray-300 group-hover:bg-gray-400 transition"></div>
                        <div className="relative">
                            <div ref={btnMoreRef} onClick={()=>dispatch(setDataMenuMore({ width: 222, elementRef: btnMoreRef.current, Children: menuMorePalette }))} className="border relative border-l-0 border-gray-300 hover:border-gray-400 transition py-3 px-3 cursor-pointer rounded-tr-xl rounded-br-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <PaletteBox palettes={hexArray}/>
                <h1 className="text-center text-4xl font-black tracking-tighter mb-[100px]">Simillar palettes</h1>
                {simillarPalettes.data.length>0 ? (
                <Fragment>
                    <div className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] mt-[100px] gap-9'>
                        {simillarPalettes.data.map((data,i)=>(
                        <Palette key={data.id} data={data} index={i}/>
                        ))}
                    </div>
                    <div className="my-[100px]">
                        <Link href={`/palettes/popular/${palette.colorGroup.toLowerCase()}`}>
                            <a className="block mx-auto border border-gray-300 px-5 py-2.5 rounded-lg font-semibold transition hover:border-gray-400 w-max">Explore more similar palettes</a>
                        </Link>
                    </div>
                </Fragment>
                ) : (
                <div className="bg-[#F7F7F8] mb-[100px] -mt-[50px] p-[50px] rounded-2xl">
                    <p className="text-center text-[#7d7c83]">No simillar palette found.</p>
                </div>
                )}
            </div>
            <Footer/>
        </Layout>
    )
}

export const getServerSideProps = wrapper.getServerSideProps(store=> async (ctx) => {
    const { hex } = ctx.query;
    const valid = hex.split('-').map(hex=>chroma.valid(hex));
    if (!valid.includes(false)) {
        try {
            const palette = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/palettes/get/${hex}`,{
                data: {
                    ...dataCreatePalette(hex)
                }
            });
            store.dispatch(setSinglePalette(palette.data.palette));
            store.dispatch(setPalettes({ data: palette.data.simillar, meta: { pagination: { page: 1 } } }));
            return { props: { hexArray: hex.split('-'), palette: palette.data.palette, simillar: palette.data.simillar } }
        } catch (error) {
            return { notFound: true }
        }
    }else {
        return { notFound: true }
    }
})