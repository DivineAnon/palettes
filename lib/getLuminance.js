export default function getLuminance(color){
    const hexArray = color.match(/.{1,2}/g);
    const rgbArray = [
        parseInt(hexArray[0],16),
        parseInt(hexArray[1],16),
        parseInt(hexArray[2],16),
    ]
    const [r,g,b] = rgbArray;
    var RsRGB = r/255;
    var GsRGB = g/255;
    var BsRGB = b/255;

    var R = (RsRGB <= 0.03928) ? RsRGB/12.92 : Math.pow((RsRGB+0.055)/1.055, 2.4);
    var G = (GsRGB <= 0.03928) ? GsRGB/12.92 : Math.pow((GsRGB+0.055)/1.055, 2.4);
    var B = (BsRGB <= 0.03928) ? BsRGB/12.92 : Math.pow((BsRGB+0.055)/1.055, 2.4);

    // For the sRGB colorspace, the relative luminance of a color is defined as: 
    var L = (0.2126 * R + 0.7152 * G + 0.0722 * B);

    return L;
}