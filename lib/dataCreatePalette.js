import chroma from "chroma-js";
import getColorGroup from "./getColorGroup";
import lightOrDark from "./lightOrDark";

export default function dataCreatePalette(slug,gradient){
    let list = slug.split('-');
    list = list.map(hex=>chroma(hex).get('hex').slice(1));
    const average = chroma.average(list).hex();
    const predict = lightOrDark(average.slice(1));
    const colorGroup = getColorGroup(average);
    const colors = list.map(hex=>getColorGroup(hex)).join(',');
    if (gradient) {
        return {
            slug: list.join('-'),
            colorGroup,
            colors,
            palette: list,
            styles: [predict==='light' ? 'Bright' : 'Dark', 'Gradient', `${list.length} Colors`].join(','),
        }    
    }
    return {
        slug: list.join('-'),
        colorGroup,
        colors,
        palette: list,
        styles: [predict==='light' ? 'Bright' : 'Dark', `${list.length} Colors`].join(','),
    }
}