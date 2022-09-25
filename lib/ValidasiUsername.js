import ValidChar from "./ValidChar";

export default function ValidasiUsername(text){
    let validasi = [];
    if (text.length>=4 && text.length<=25) {
        for (let i = 0; i < text.length; i++) {
            validasi.push(ValidChar.includes(text.charAt(i)));
        }
        if (!validasi.includes(false)) {
            return true;
        }
    }
    return false;
}