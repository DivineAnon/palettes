import chroma from "chroma-js";
import getColorGroup from "./getColorGroup";
import lightOrDark from "./lightOrDark";

export default function dataCreateGradient(colorProps,type,rotation){
    const palette = colorProps.map(obj=>obj.color).map(hex=>chroma(hex).get('hex').slice(1));
    const average = chroma.average(palette).hex();
    const predict = lightOrDark(average.slice(1));
    const colorGroup = getColorGroup(average);
    const colors = palette.map(hex=>getColorGroup(hex)).join(',');
    return {
        colorGroup,
        colors,
        type,
        rotation,
        slug: palette.join('-'),
        palette: colorProps,
        styles: [predict==='light' ? 'Bright' : 'Dark', `${palette.length} Colors`].join(','),
    }
}