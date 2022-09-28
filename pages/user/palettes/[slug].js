import axios from "axios";
import { useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Footer, Header, Layout, PaletteBox } from "../../../components";
import { GetToken, usePushNotif,  } from "../../../lib";
import { selectDetailDashboardPalette, selectDetailDashboardPaletteData, setDetailDashboardPalette } from "../../../slices/dashboardSlice";
import { handleSavePalette, setDataExportPalette, setDataFullscreenPalette, setDataMenuMore, setDataPaletteDetail, setIdDeletePalette } from "../../../slices/popupSlice";
import { selectUser } from "../../../slices/userSlice";
import { wrapper } from "../../../store";

export default function PaletteEdit(){
    const data = useSelector(selectDetailDashboardPaletteData);
    const palette = useSelector(selectDetailDashboardPalette);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const btnMoreRef = useRef(null);
    const handlePushNotif = usePushNotif();
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
                <div onClick={()=>handleMenuMore('details')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                    <span className="md:text-sm font-medium">View details</span>
                </div>
                <div onClick={()=>handleMenuMore('edit')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                    <span className="md:text-sm font-medium">Edit palette</span>
                </div>
                <div onClick={()=>handleMenuMore('delete')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span className="md:text-sm font-medium">Delete palette</span>
                </div>
            </section>
        </Fragment>
    )
    const handleMenuMore = (menu) => {
        if (menu==='openPalette') {
            window.open(`/palette/${palette.join('-')}`);
        }
        if (menu==='openGenerator') {
            window.open(`/${palette.join('-')}`);
        }
        if (menu==='copyURL') {
            navigator.clipboard.writeText(window.location.origin+`/palette/${palette.join('-')}`);
            handlePushNotif({ text: 'URL copied to the clipboard!', className: 'bg-black', icon: 'checklist' });
        }
        if (menu==='fullscreen') {
            dispatch(setDataFullscreenPalette(palette,'palette'));
        }
        if (menu==='delete') {
            dispatch(setIdDeletePalette(data.id));
        }
        if (menu==='edit') {
            dispatch(handleSavePalette(user,data.palette.palette,'edit',null,data));
        }
        if (menu==='details') {
            dispatch(setDataPaletteDetail(data));
        }
    }
    return (
        <Layout title={`My new palette - Palettes`}>
            <Header/>
            <div className="mt-[170px] px-6 md:px-10 max-w-screen-2xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <h1 className="text-5xl font-black tracking-tighter">{data?.name}</h1>
                    <div className="flex group">
                        <div onClick={()=>dispatch(setDataExportPalette(palette))} className="flex items-center font-semibold gap-2 border border-r-0 border-gray-300 hover:border-gray-400 transition px-4 py-2.5 rounded-tl-xl rounded-bl-xl cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span>Export palette</span>
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
                <PaletteBox palettes={palette}/>
            </div>
            <Footer/>
        </Layout>
    )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    const { slug } = ctx.query;
    try {
        const palette = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/saves-palettes/get/${slug}`,{
            headers: {
                Authorization: `bearer ${GetToken(ctx)}`
            }
        })
        store.dispatch(setDetailDashboardPalette(palette.data));
    } catch (error) {
        return { notFound: true }
    }
})