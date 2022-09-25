import axios from "axios";
import { useLayoutEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLoading, DashboardSearch, DashboardTemplate, PaletteColorSaves } from "../../../components";
import { colorsGroup, GetToken, stylesPalette } from "../../../lib";
import { fetchMoreColorsDashboard, selectDashboardColors, selectDashboardColorsPage, selectLoadingFetchMoreDashboardColors, setDashboardColors } from "../../../slices/dashboardSlice";

export default function ColorsDashboard({ dataColors }){
    const colors = useSelector(selectDashboardColors);
    const colorsPage = useSelector(selectDashboardColorsPage);
    const dispatch = useDispatch();
    const loadingFetch = useSelector(selectLoadingFetchMoreDashboardColors);
    const fetchColors = () => {
        dispatch(fetchMoreColorsDashboard(parseInt(colorsPage)+1));
    }
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
    useLayoutEffect(()=>{
        dispatch(setDashboardColors(dataColors));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <DashboardTemplate>
            <DashboardSearch title={'Colors'} filtersMenu={filtersMenu} handleSearch={handleSearch}/>
            {colors.data.length > 0 ? (
            <InfiniteScroll
                dataLength={colors.data.length}
                hasMore={true}
                next={fetchColors}
            >
                <div className="grid gap-x-9 mt-10 gap-y-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                    {colors.data.map((data)=>(
                        <PaletteColorSaves data={data} key={data.id}/>
                    ))}
                </div>
            </InfiniteScroll>
            ) : (
            <div className="h-[calc(100vh-60px-60px-36px)] md:h-[calc(100vh-60px-80px-36px)] flex flex-col gap-4 items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" className="w-24 h-24" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M7.21.8C7.69.295 8 0 8 0c.109.363.234.708.371 1.038.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8zm.413 1.021A31.25 31.25 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
                    <path fillRule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448z"/>
                </svg>
                <p className="text-[15px]">You {"don't"} have any color yet.</p>
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
        const dataColors = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/saves-colors/feed?page=1`,{
            headers: {
                Authorization: `bearer ${GetToken(ctx)}`
            }
        })
        return { props: { dataColors: dataColors.data } }
    } catch (error) {
        return { notFound: true }
    }
}