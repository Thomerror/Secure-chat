// let url = 'https://ohio.stream-io-cdn.com/1221449/attachments/4ab0d1aa-a6d9-4da1-8e95-291978bbfcd0.ppTest.pptx?Key-Pair-Id=APKAIHG36VEWPDULE23Q&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9vaGlvLnN0cmVhbS1pby1jZG4uY29tLzEyMjE0NDkvYXR0YWNobWVudHMvNGFiMGQxYWEtYTZkOS00ZGExLThlOTUtMjkxOTc4YmJmY2QwLnBwVGVzdC5wcHR4KiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTY3MTIwNzkxMH19fV19&Signature=WHhZnbZISmP2pRt6PQ3rm2uXRMjZx6XYc9VeMz0zFB-NSAd1ldOoQYfUUCAkMmPqQ5Comtbj6KfsFSiCtpnwEvBOV1bQQcHQQEJ3oHUFDjXWuDVK9JbWAPcpJwTnaJBoiNJdjpvpN1IhFWrIfA5VYnjtahE-vL5p3YglWoeL4pAnzmyN-t0et4IWys6oVoaWg54YUGzQXUN3ST9RbBcTKtS3O48EifkQewD7gRKdMFBoUMfY0JvoPJiyElW0Cqh0N8Ae6zPvtUhPaZzniBM7Cbmj-kdjTQrK1UTIfhXRvu2CaBrO34sJgggeGzhHxtg4MJOSB1eX27YgiFFoHwL~Vw__'
let file = null
let getFile = async()=> {
fetch(url)
.then(res=>res.blob())
.then(blob=>{
    console.log(blob);
    file = new File([blob], 'image', {type:blob.type});
    console.log(file);
    return file;
});
}
console.log(file);

//--------------------------------------------------------------------------------------------
let url = 'https://ohio.stream-io-cdn.com/1221449/attachments/1f50adf3-1aac-4dd8-af7e-1b1e314a772e.README.txt?Key-Pair-Id=APKAIHG36VEWPDULE23Q&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9vaGlvLnN0cmVhbS1pby1jZG4uY29tLzEyMjE0NDkvYXR0YWNobWVudHMvMWY1MGFkZjMtMWFhYy00ZGQ4LWFmN2UtMWIxZTMxNGE3NzJlLlJFQURNRS50eHQqIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNjcxMjEwODg1fX19XX0_&Signature=KCDUL8l94h~0tObB505ymLter1DG20uS-0vgWPqg2NF8Apr7UZk4plkOuxYrkpJpzEULbUjQe0gJpbPenqW-nyk5RvMXXvIpCI7v9NyNtA94uOzK2c01zhIrg4lq5pQENoX9Ey1IxD~bCiQ74o0pvRNdN4UZ7oXint1-O2LyVyEcWujGF0nBI1ZkV88xYfzL37WTVQdZUL67B4OWcGqicNqYZZVVfvFAnuOcXc~YCL4Y3lSdp0MuS0nVZ9pjTUu~tjTkLkcOX77HtU-ZrFWPzIr-AKZvkZylJ47pLnIgyiTmwmEBjj9U9mw3gRlGSN7r80x1xPJRz83H~EdSYAtUwA__'

let readFile = (file) => {
    return new Promise((resolve, reject) => {
        let fr = new FileReader();  
        fr.onload = () => {
            resolve(fr.result);
        };
        fr.readAsArrayBuffer(file);
    });
}

let encFile = async(url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], 'blobToFile', {type:blob.type});
    console.log(file);

    var plaintextbytes = await readFile(file)
    // .catch(function(err){
    //     console.error(err);
    // });
    console.log('type of plaintextbytes: ' + typeof(plaintextbytes))

    let Encpassphrase = "thisisaphrase";
    plaintextbytes = new Uint8Array(plaintextbytes)
    let pbkdf2iterations = 10000;
    let passphrasebytes = new TextEncoder("utf-8").encode(Encpassphrase);
    let pbkdf2salt = window.crypto.getRandomValues(new Uint8Array(8));
    let passphrasekey = await window.crypto.subtle.importKey('raw',passphrasebytes, { name: 'PBKDF2'}, false, ['deriveBits'])
    // .catch((error)=>{
    //     console.log(error);
    // });
    console.log("passphrasekey imported")
    let pbkdf2bytes = await window.crypto.subtle.deriveBits({ "name": 'PBKDF2', "salt": pbkdf2salt, "iterations": pbkdf2iterations, "hash": 'SHA-256'}, passphrasekey, 384)
    // .catch(function(err){
    //     console.error(err);
    // });
    console.log('pbkdf2bytes derived');
    pbkdf2bytes = new Uint8Array(pbkdf2bytes);

    let keybytes = pbkdf2bytes.slice(0,32);
    let ivbytes=pbkdf2bytes.slice(32);

    let key = await window.crypto.subtle.importKey('raw', keybytes, { name: 'AES-CBC', length: 256}, false, ['encrypt'])
    .catch((error)=>{
        console.log(error);
    });
    
    let cipherbytes = await window.crypto.subtle.encrypt({ name: "AES-CBC", iv: ivbytes }, key, plaintextbytes)
    // .catch((error)=>{
    //     console.log(error);
    // });
    if(!cipherbytes){
        console.log("ERROR ENCRYPTING FILE, SEE CONSOLE LOG!");
        return;
    }

    console.log("Plaintext encrypted");
    cipherbytes = new Uint8Array(cipherbytes);

    let resultbytes = new Uint8Array(cipherbytes.length+16);
    resultbytes.set(new TextEncoder("utf-8").encode('Salted__'));
    resultbytes.set(pbkdf2salt, 8);
    resultbytes.set(cipherbytes, 16);

    let blob2 = new Blob([resultbytes], { type: 'application/download'});
    let blobUrl = URL.createObjectURL(blob2);
    console.log('Bloburl:   ' + blobUrl);
    return blobUrl;
}

encFile(url);