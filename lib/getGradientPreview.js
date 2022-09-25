
export default function getGradientPreview(gradient){
    return `${gradient.type}-gradient(${gradient.type==='linear' ? gradient.rotation+'deg' : 'circle'}, ${gradient.palette.map(obj=>[`#${obj.color} ${obj.position}%`]).join(',')}`;
}