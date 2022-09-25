import { GetColorName } from "hex-color-to-color-name";
import hexToCMYK from "./hexToCMYK";
import hexToHSB from "./hexToHSB";
import hexToHSL from "./hexToHSL";
import hexToLAB from "./hexToLAB";
import hexToRgb from "./hexToRgb";
import lightOrDark from "./lightOrDark";
import { saveAs } from 'file-saver';

export default function savePalettesAsImg(paletteList,cSpace,title){
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1400;
    const ctx = canvas.getContext('2d');
    
    for (let i = 0; i < paletteList.length; i++) {
        ctx.fillStyle = `#${paletteList[i]}`;
        ctx.fillRect((1600/paletteList.length)*i, 0, 1600/paletteList.length, 1200);
    }
    if (cSpace==='HEX') {
        paletteList.forEach((palette,i) => {
            ctx.save();
            let text = palette.toUpperCase();
            let widthTxt = ctx.measureText(text).width;
            ctx.translate((1600/paletteList.length)*i+((1600/paletteList.length)-widthTxt+70)/2,1600-500);
            ctx.rotate(-0.5*Math.PI);
            ctx.fillStyle = lightOrDark(palette)==='light' ? '#000000' : '#FFFFFF';
            ctx.font = `500 ${(1600/paletteList.length)*0.1}px Inter`;
            ctx.fillText(text, 0, 0);
            ctx.restore();
        });
    }
    if (cSpace==='Name'){
        paletteList.forEach((palette,i) => {
            ctx.save();
            let text = GetColorName(palette);
            let widthTxt = ctx.measureText(text).width;
            ctx.translate((1600/paletteList.length)*i+((1600/paletteList.length)-widthTxt+70)/2,1600-500);
            ctx.rotate(-0.5*Math.PI);
            ctx.fillStyle = lightOrDark(palette)==='light' ? '#000000' : '#FFFFFF';
            ctx.font = `500 ${(1600/paletteList.length)*0.1}px Inter`;
            ctx.fillText(text, 0, 0);
            ctx.restore();
        });
    }
    if (cSpace==='RGB'){
        paletteList.forEach((palette,i) => {
            ctx.save();
            let text = hexToRgb(palette).join(', ');
            let widthTxt = ctx.measureText(text).width;
            ctx.translate((1600/paletteList.length)*i+((1600/paletteList.length)-widthTxt+70)/2,1600-500);
            ctx.rotate(-0.5*Math.PI);
            ctx.fillStyle = lightOrDark(palette)==='light' ? '#000000' : '#FFFFFF';
            ctx.font = `500 ${(1600/paletteList.length)*0.1}px Inter`;
            ctx.fillText(text, 0, 0);
            ctx.restore();
        });
    }
    if (cSpace==='HSB'){
        paletteList.forEach((palette,i) => {
            ctx.save();
            let text = hexToHSB(palette).join(', ');
            let widthTxt = ctx.measureText(text).width;
            ctx.translate((1600/paletteList.length)*i+((1600/paletteList.length)-widthTxt+70)/2,1600-500);
            ctx.rotate(-0.5*Math.PI);
            ctx.fillStyle = lightOrDark(palette)==='light' ? '#000000' : '#FFFFFF';
            ctx.font = `500 ${(1600/paletteList.length)*0.1}px Inter`;
            ctx.fillText(text, 0, 0);
            ctx.restore();
        });
    }
    if (cSpace==='HSL'){
        paletteList.forEach((palette,i) => {
            ctx.save();
            let text = hexToHSL(palette).join(', ');
            let widthTxt = ctx.measureText(text).width;
            ctx.translate((1600/paletteList.length)*i+((1600/paletteList.length)-widthTxt+70)/2,1600-500);
            ctx.rotate(-0.5*Math.PI);
            ctx.fillStyle = lightOrDark(palette)==='light' ? '#000000' : '#FFFFFF';
            ctx.font = `500 ${(1600/paletteList.length)*0.1}px Inter`;
            ctx.fillText(text, 0, 0);
            ctx.restore();
        });
    }
    if (cSpace==='CMYK'){
        paletteList.forEach((palette,i) => {
            ctx.save();
            let text = hexToCMYK(palette).join(', ');
            let widthTxt = ctx.measureText(text).width;
            ctx.translate((1600/paletteList.length)*i+((1600/paletteList.length)-widthTxt+70)/2,1600-500);
            ctx.rotate(-0.5*Math.PI);
            ctx.fillStyle = lightOrDark(palette)==='light' ? '#000000' : '#FFFFFF';
            ctx.font = `500 ${(1600/paletteList.length)*0.1}px Inter`;
            ctx.fillText(text, 0, 0);
            ctx.restore();
        });
    }
    if (cSpace==='LAB'){
        paletteList.forEach((palette,i) => {
            ctx.save();
            let text = hexToLAB(palette).join(', ');
            let widthTxt = ctx.measureText(text).width;
            ctx.translate((1600/paletteList.length)*i+((1600/paletteList.length)-widthTxt+70)/2,1600-500);
            ctx.rotate(-0.5*Math.PI);
            ctx.fillStyle = lightOrDark(palette)==='light' ? '#000000' : '#FFFFFF';
            ctx.font = `500 ${(1600/paletteList.length)*0.1}px Inter`;
            ctx.fillText(text, 0, 0);
            ctx.restore();
        });
    }
    canvas.toBlob((blob)=>{
        saveAs(blob,title ? `${title}.png` : 'palettes.png')
    });
}