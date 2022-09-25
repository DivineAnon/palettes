import { saveAs } from "file-saver";

export default function saveGradientAsImg(variant,data,title){
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = 1600;
    canvas.height = 1200;
    if (variant==='linear') {

        var w = canvas.width;
        var h = canvas.height;

        const { rotation, colors } = data;

        function getDir(degree, width, height) {
            let radian = degree*(Math.PI/180)
            radian += Math.PI;
            const HALF_WIDTH = width * 0.5;
            const HALF_HEIGHT = height * 0.5;
            const lineLength = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));
            const HALF_LINE_LENGTH = lineLength / 2;
        
            const x0 = HALF_WIDTH + Math.sin(radian) * HALF_LINE_LENGTH;
            const y0 = HALF_HEIGHT - Math.cos(radian) * HALF_LINE_LENGTH;
            const x1 = width - x0;
            const y1 = height - y0;
        
            return {x0, x1, y0, y1};
        }

        const get = getDir(rotation,w,h);


        var grad = context.createLinearGradient(get.x0, get.y0, get.x1, get.y1);

        colors.forEach(({ pos, color })=>{
            grad.addColorStop(pos, color);
        })
        
    }
    if (variant==='radial') {
        var grad = context.createRadialGradient(800, 600, 0, 800, 600, 1000.00);

        const { colors } = data;

        colors.forEach(({ pos, color })=>{
            grad.addColorStop(pos, color);
        })

    }
    context.fillStyle = grad;
    context.fillRect(0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob=>{
        saveAs(blob, title ? `${title}.jpg` : 'gradient.jpg');
    })
}