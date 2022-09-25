export default function hexToHSB(color){
    const hexArray = color.match(/.{1,2}/g);
    const rgb = [
        parseInt(hexArray[0],16),
        parseInt(hexArray[1],16),
        parseInt(hexArray[2],16),
    ]
    let [r,g,b] = rgb;
    r /= 255;
    g /= 255;
    b /= 255;
    const v = Math.max(r, g, b),
        n = v - Math.min(r, g, b);
    const h =
        n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
    return [Math.round(60 * (h < 0 ? h + 6 : h)), Math.round(v && (n / v) * 100), Math.round(v * 100)];
}