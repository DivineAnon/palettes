export default function ValidasiEmail(text){
    let char = '@.';
    let validasi = [];
    if (text) {
        for (let i = 0; i < char.length; i++) {
            validasi.push(text.includes(char.charAt(i)));
        }
        if (!validasi.includes(false)) {
            return true;
        }
    }
    return false;
}