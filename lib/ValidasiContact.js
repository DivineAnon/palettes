
export default function ValidasiContact(array){
    const validasi = [];
    if (array) {
        const validArray = array.filter(data=>data.value);
        validArray.forEach(element => {
            if (element.type==='instagram') {
                let valid = element.value.slice(0,26) === 'https://www.instagram.com/';
                let instagram = { ...element, value: valid ? element.value : `https://www.instagram.com/${element.value}` };
                validasi.push(instagram);
            }else if (element.type==='twitter'){
                let valid = element.value.slice(0,20) === 'https://twitter.com/';
                let twitter = { ...element, value: valid ? element.value : `https://twitter.com/${element.value}` };
                validasi.push(twitter);
            }else if (element.type==='email'){
                let valid = element.value.slice(0,7) === 'mailto:';
                let email = { ...element, value: valid ? element.value : `mailto:${element.value}` };
                validasi.push(email);
            }else if (element.type==='whatsapp'){
                let valid = element.value.slice(0,14) === 'https://wa.me/:';
                let whatsapp = { ...element, value: valid ? element.value : `https://wa.me/${element.value}` };
                validasi.push(whatsapp);
            }else {
                let valid = element.value.slice(0,8)==='https://';
                let newData = { ...element, value: valid ? element.value : `https://${element.value}` };
                validasi.push(newData);
            }
        });
    }
    return validasi;
}