import hexToHSL from "./hexToHSL";

export default function getColorGroup(hex) {
    const hslArray = hexToHSL(hex);
    const hsl = { h: hslArray[0], s: hslArray[1], l: hslArray[2] };
    var l = Math.floor(hsl.l), s = Math.floor(hsl.s), h = Math.floor(hsl.h);
    if (s <= 10 && l >= 90) {
        return ("White")
    } else if (l <= 15) {
        return ("Black")
    } else if ((s <= 10 && l <= 70) || s === 0) {
        return ("Gray")
    } else if ((h >= 0 && h <= 15) || h >= 346) {
        return ("Red");
    } else if (h >= 16 && h <= 35) {
        if (s < 90) {
            return ("Brown");
        } else {
            return ("Orange");
        }
    } else if (h >= 36 && h <= 54) {
        if (s < 90) {
            return ("Brown");
        } else {
            return ("Yellow");
        }
    } else if (h >= 55 && h <= 165) {
        return ("Green");
    } else if (h >= 166 && h <= 260) {
        return ("Blue")
    } else if (h >= 261 && h <= 290) {
        return ("Purple")
    } else if (h >= 291 && h <= 345) {
        return ("Pink")
    }
}