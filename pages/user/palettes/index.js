import axios from "axios";
import { useLayoutEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLoading, DashboardSearch, DashboardTemplate, PaletteDashboard } from "../../../components";
import { colorsGroup, GetToken, stylesPalette } from "../../../lib";
import { fetchMorePalettesDashboard, selectDashboardPalettes, selectDashboardPalettesPage, selectLoadingFetchMoreDashboardPalettes, setDashboardPalettes } from "../../../slices/dashboardSlice";

export default function PalettesDashboard({ dataPalettes }){
    const palettes = useSelector(selectDashboardPalettes);
    const palettePage = useSelector(selectDashboardPalettesPage);
    const dispatch = useDispatch();
    const loadingFetch = useSelector(selectLoadingFetchMoreDashboardPalettes);
    const handleSearch = (e) => {
        e.preventDefault();
        console.log(e.target[0].value)
    }
    const filtersMenu = () => (
        <section className="p-4">
            <div className="mb-5">
                <h1 className="text-sm font-semibold mb-3.5">Style</h1>
                <div className="flex flex-wrap gap-2">
                    {stylesPalette.filter(data=>!data.value.includes('Colors')).map((data,i)=>(
                        <div key={i} className="h-8 px-3 rounded-lg border text-sm font-medium flex items-center transition hover:border-gray-400 cursor-pointer">{data.value}</div>
                    ))}
                </div>
            </div>
            <div className="mb-5">
                <h1 className="text-sm font-semibold mb-3.5">Color</h1>
                <div className="flex flex-wrap gap-2">
                    {colorsGroup.map((data,i)=>(
                        <div key={i} className="h-8 px-3 rounded-lg border text-sm font-medium flex items-center transition hover:border-gray-400 cursor-pointer gap-2">
                            <div style={{ backgroundColor: data.hex }} className={`w-3 h-3 rounded-full ${data.value==='White' && 'border'}`}></div>
                            <span>{data.value}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h1 className="text-sm font-semibold mb-3.5">Number of colors</h1>
                <div className="flex flex-wrap gap-2">
                    {stylesPalette.filter(data=>data.value.includes('Colors')).map((data,i)=>(
                        <div key={i} className="h-8 px-3 rounded-lg border text-sm font-medium flex items-center transition hover:border-gray-400 cursor-pointer">{data.value}</div>
                    ))}
                </div>
            </div>
        </section>
    )
    const fetchPalettes = async () => {
        dispatch(fetchMorePalettesDashboard(parseInt(palettePage)+1));
    }
    useLayoutEffect(()=>{
        dispatch(setDashboardPalettes(dataPalettes));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <DashboardTemplate>
            <DashboardSearch title={'Palette'} filtersMenu={filtersMenu} handleSearch={handleSearch}/>
            {palettes?.data.length>0 ? (
            <InfiniteScroll
                dataLength={palettes.data.length}
                hasMore={true}
                next={fetchPalettes}
            >
                <div className="grid gap-x-9 mt-10 gap-y-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                    {palettes.data.map((palette,i)=>(
                        <PaletteDashboard data={palette} key={i}/>
                    ))}
                </div>
            </InfiniteScroll>
            ) : (
            <div className="h-[calc(100vh-60px-60px-36px)] md:h-[calc(100vh-60px-80px-36px)] flex flex-col gap-4 items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                </svg>
                <p className="text-[15px]">You {"don't"} have any palette yet.</p>
            </div>
            )}
            {loadingFetch && (
            <DashboardLoading/>
            )}
        </DashboardTemplate>
    )
}

export async function getServerSideProps(ctx){
    try {
        const dataPalettes = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/saves-palettes/feed?page=1`,{
            headers: {
                Authorization: `bearer ${GetToken(ctx)}`
            }
        })
        return { props: { dataPalettes: dataPalettes.data } }
    } catch (error) {
        return { notFound: true }
    }
}