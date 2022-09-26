
export default function getGradientPreview(gradient){
    const palette = JSON.parse(gradient.palette);
    return `${gradient.type}-gradient(${gradient.type==='linear' ? gradient.rotation+'deg' : 'circle'}, ${palette.map(obj=>[`#${obj.color} ${obj.position}%`]).join(',')}`;
}