import axios from 'axios';
import { Fragment, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Footer, Header, Layout } from '../../../components';
import { getGradientPreview, GetToken, lightOrDark, saveGradientAsImg, useNotifColor, usePushNotif } from '../../../lib';
import { selectDetailDashboardGradient, setDetailDashboardGradient } from '../../../slices/dashboardSlice';
import { selectCopyPaletteIndex, setCopyPaletteIndex } from '../../../slices/globalSlice';
import { handleSaveGradient, selectDataMenuMore, setDataFullscreenPalette, setDataMenuMore, setDataShowCSSGradient, setIdDeleteGradient } from '../../../slices/popupSlice';
import { selectUser } from '../../../slices/userSlice';
import { wrapper } from '../../../store';

export default function Gradient(){
    const data = useSelector(selectDetailDashboardGradient);
    const btnMoreRef = useRef(null);
    const menuMoreChildren = useSelector(selectDataMenuMore);
    const dispatch = useDispatch();
    const gradient = JSON.parse(data.gradient.palette);
    const copyPaletteIndex = useSelector(selectCopyPaletteIndex);
    const copyColor = useNotifColor();
    const handlePushNotif = usePushNotif();
    const user = useSelector(selectUser);
    const menuMore = ()=> (
        <Fragment>
            <section className="mb-2">
                <div onClick={()=>handleMenuMore('openEditor')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-wand" width={20} height={20} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <polyline points="6 21 21 6 18 3 3 18 6 21" />
                        <line x1={15} y1={6} x2={18} y2={9} />
                        <path d="M9 3a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
                        <path d="M19 13a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
                    </svg>
                    <span className="md:text-sm font-medium">Open in the editor</span>
                </div>
                <div onClick={()=>handleMenuMore('copyURL')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="md:text-sm font-medium">Copy URL</span>
                </div>
                <div onClick={()=>handleMenuMore('downloadIMG')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="md:text-sm font-medium">Download as image</span>
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
                <div onClick={()=>handleMenuMore('edit')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                    <span className="md:text-sm font-medium">Edit gradient</span>
                </div>
                <div onClick={()=>handleMenuMore('delete')} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span className="md:text-sm font-medium">Delete gradient</span>
                </div>
            </section>
        </Fragment>
    )
    const handleMenuMore = (menu) => {
        if (menu==='openEditor') {
            window.open(`/gradient-maker/${gradient.map(data=>data.color).join('-')}?position=${gradient.map(data=>data.position).join(',')}&type=${data.gradient.type}&rotation=${data.gradient.rotation}`);
        }
        if (menu==='copyURL') {
            navigator.clipboard.writeText(window.location.origin+`/user/gradients/${data.id}`);
            handlePushNotif({ text: 'URL copied to the clipboard!', className: 'bg-black', icon: 'checklist' });
        }
        if (menu==='fullscreen') {
            dispatch(setDataFullscreenPalette(data.gradient,'gradient'));
        }
        if (menu==='delete') {
            dispatch(setIdDeleteGradient(data.id));
        }
        if (menu==='edit') {
            dispatch(handleSaveGradient(user,data.gradient,'edit',data));
        }
        if (menu==='downloadIMG') {
            const dataImg = {
                rotation: 90,
                colors: gradient.map((grad)=>({ pos: grad.position/100, color: `#${grad.color}` }))
            }
            saveGradientAsImg(data.gradient.type,dataImg,'gradient');
        }
    }
    const handleShowCSS = () => {
        const dataGradient = {
            rotation: data.gradient.rotation,
            type: data.gradient.type
        };
        dataGradient['color_position'] = gradient;
        dispatch(setDataShowCSSGradient(dataGradient));
    }
    return (
        <Layout title={`${data.name} - Palettes`}>
            <Header/>
            <div className="pt-[60px] md:pt-[160px] pb-[60px] md:pb-[160px] px-6 sm:px-[35px] lg:px-[42px]">
                <div className="flex flex-col gap-[50px] lg:gap-0 lg:flex-row items-center justify-between">
                    <h1 className="text-5xl font-black tracking-tighter text-center">{data.name}</h1>
                    <div className="h-[46px] leading-[46px] flex">
                        <div onClick={handleShowCSS} className={`flex gap-2.5 items-center pl-[14px] pr-[21px] border border-r-0 transition peer rounded-tl-[10px] rounded-bl-[10px] ${menuMoreChildren?.elementRef.id==='btnMore' ? '' : 'hover:border-gray-400 cursor-pointer'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M14.447 3.027a.75.75 0 01.527.92l-4.5 16.5a.75.75 0 01-1.448-.394l4.5-16.5a.75.75 0 01.921-.526zM16.72 6.22a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 010-1.06zm-9.44 0a.75.75 0 010 1.06L2.56 12l4.72 4.72a.75.75 0 11-1.06 1.06L.97 12.53a.75.75 0 010-1.06l5.25-5.25a.75.75 0 011.06 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-bold">Copy CSS</span>
                        </div>
                        <div ref={btnMoreRef} id="btnMore" onClick={()=>dispatch(setDataMenuMore({ width: 222, elementRef: btnMoreRef.current, Children: menuMore }))} className={`flex items-center px-3 border transition rounded-br-[10px] rounded-tr-[10px] ${menuMoreChildren?.elementRef.id==='btnMore' ? 'border-gray-400 bg-gray-100' : 'peer-hover:border-l-gray-400 hover:border-gray-400 cursor-pointer'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="mt-[80px] md:mt-[100px]">
                    <div className='h-[400px] flex divide-x-8 divide-white'>
                        <div style={{ backgroundImage: getGradientPreview(data.gradient) }} className='flex-1 rounded-2xl'></div>
                        <div className='w-[200px] flex flex-col rounded-2xl overflow-hidden'>
                            {gradient.map(data=>data.color).map((hex,i)=>(
                                <div onMouseLeave={()=>dispatch(setCopyPaletteIndex(null))} key={i} onClick={()=>{copyColor(hex);dispatch(setCopyPaletteIndex(i))}} style={{ backgroundColor: `#${hex}` }} className='flex-1 group relative cursor-pointer'>
                                    <span className={`${lightOrDark(hex)==='light' ? 'text-black' : 'text-white'} absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 font-medium opacity-0 group-hover:opacity-100 transition`}>{copyPaletteIndex===i ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-scale-check" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        hex.toUpperCase()
                                    )}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </Layout>
    )
}


export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx)=> {
    const { id } = ctx.query;
    try {
        const gradient = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/saves-gradients/detail/${id}`,{
            headers: {
                Authorization: `bearer ${GetToken(ctx)}`
            }
        })
        store.dispatch(setDetailDashboardGradient(gradient.data));
    } catch (error) {
        return { notFound: true }
    }
})