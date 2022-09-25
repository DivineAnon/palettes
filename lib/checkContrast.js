import chroma from "chroma-js";

export default function checkContrast(color,background){
    let number = chroma.contrast(color,background);
    if (number<=3.5) {
        return ['VERY POOR',1];
    }
    if (number>3.5 && number<5) {
        return ['POOR',2];
    }
    if (number>5 && number<7) {
        return ['GOOD',3];
    }
    if (number>7 && number<11) {
        return ['VERY GOOD',4];
    }
    if (number>11) {
        return ['SUPER',5];
    }
}