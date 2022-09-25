import { Footer, Header, Layout, PaletteGradient } from "../components";
import Link from 'next/link';
import axios from "axios";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDataGradients, setGradients } from "../slices/gradientsSlice";

export default function Gradients({ dataGradients }){
    const dispatch = useDispatch();
    const gradientList = useSelector(selectDataGradients);
    useLayoutEffect(()=>{
        dispatch(setGradients(dataGradients));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <Layout title={'Browse Gradients - Palettes'}>
            <Header/>
            <div className="mt-[159px] mb-[100px] max-w-screen-xl mx-auto">
                <h1 className="font-black text-5xl mb-8 text-center tracking-tighter px-2">Gradients</h1>
                <div className="text-center text-xl text-[#7d7c83] mb-[100px] px-4 max-w-[576px] mx-auto">Explore beautiful gradients for your projects or create your own gradient with the <Link href="/gradient-maker"><a className="text-blue-500 hover:underline">Gradient Maker.</a></Link></div>
                <div className="max-w-[1200px] px-10 mx-auto grid gap-x-5 gap-y-9 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                    {gradientList?.data.map((palette,i)=>(
                    <PaletteGradient palette={palette} index={i} key={i}/>
                    ))}
                </div>
            </div>
            <Footer/>
        </Layout>
    )
}



export async function getServerSideProps(ctx){
    const dataGradients = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/gradients/feed?page=1`);
    return { props: { dataGradients: dataGradients.data } }
}
