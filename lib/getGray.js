export default function getGray(color){
    const hexArray = color.match(/.{1,2}/g);
    const rgbArray = [
        parseInt(hexArray[0],16),
        parseInt(hexArray[1],16),
        parseInt(hexArray[2],16),
    ]
    const [r,g,b] = rgbArray;
    let sum = 0;
    sum += parseFloat(r*0.89);
    sum += parseFloat(g*1.77);
    sum += parseFloat(b*0.33);
    var gray = Math.ceil(sum/3)
    return `rgb(${gray}, ${gray}, ${gray})`;
}