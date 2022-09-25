import { GeneratorTemplate, SingleColor } from "../components";
import chroma from "chroma-js";
import { dataCreatePalette } from "../lib";
import axios from "axios";

export default function GeneratorView({ colorProps, exampleColor }){
    if (colorProps.length>1) {
        return <GeneratorTemplate colorProps={colorProps}/>
    }else{
        return (
            <SingleColor colorProps={colorProps} exampleColor={exampleColor}/>
        )
    }
}

export async function getServerSideProps(ctx){
    const { hex } = ctx.query;
    const colorProps = hex.split('-');
    if (colorProps.length>10) {
        return { notFound: true }
    }
    try {
        const validHex = colorProps.map(hex=>chroma(chroma(hex).get('rgb')).hex().slice(1));
        let exampleColor;
        if (colorProps.length>1) {
            await axios.post(`${process.env.NEXT_PUBLIC_API}/api/palettes/create`,{
                data: {
                    ...dataCreatePalette(validHex.join('-'))
                }
            })
        }
        if (colorProps.length===1) {
            exampleColor = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/palettes/colorInfo-feed?hex=${colorProps.join('')}`);
        }
        return { props: { colorProps: validHex, exampleColor: exampleColor ? exampleColor.data : [] } }
    } catch (error) {
        return { notFound: true }
    }
}