
//-------------------------------------------------------------- AES-ENCRYPTION START ---------------------------------------------------------------------------
let encRSA = (key) => {
    console.log(key)
}

let decRSA = (key) => {
    console.log(key)
}

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
    .catch(function(err){
        console.error(err);
    });
    console.log('type of plaintextbytes: ' + typeof(plaintextbytes))

    let Encpassphrase = "thisisaphrase";
    plaintextbytes = new Uint8Array(plaintextbytes)
    let pbkdf2iterations = 10000;
    let passphrasebytes = new TextEncoder("utf-8").encode(Encpassphrase);
    let pbkdf2salt = window.crypto.getRandomValues(new Uint8Array(8));
    let passphrasekey = await window.crypto.subtle.importKey('raw',passphrasebytes, { name: 'PBKDF2'}, false, ['deriveBits'])
    .catch((error)=>{
        console.log(error);
    });
    console.log("passphrasekey imported")
    let pbkdf2bytes = await window.crypto.subtle.deriveBits({ "name": 'PBKDF2', "salt": pbkdf2salt, "iterations": pbkdf2iterations, "hash": 'SHA-256'}, passphrasekey, 384)
    .catch(function(err){
        console.error(err);
    });
    console.log('pbkdf2bytes derived');
    pbkdf2bytes = new Uint8Array(pbkdf2bytes);

    let keybytes = pbkdf2bytes.slice(0,32);
    let ivbytes=pbkdf2bytes.slice(32);

    let key = await window.crypto.subtle.importKey('raw', keybytes, { name: 'AES-CBC', length: 256}, false, ['encrypt'])
    .catch((error)=>{
        console.log(error);
    });
    encRSA(key);
    let cipherbytes = await window.crypto.subtle.encrypt({ name: "AES-CBC", iv: ivbytes }, key, plaintextbytes)
    .catch((error)=>{
        console.log(error);
    });
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
//-------------------------------------------------------------- AES-ENCRYPTION END ---------------------------------------------------------------------------



//-------------------------------------------------------------- AES-DENCRYPTION START ---------------------------------------------------------------------------

let dencFile = async(file) => {

    var cipherbytes=await readFile(file)
    .catch(function(err){
        console.error(err);
    });	
    cipherbytes=new Uint8Array(cipherbytes);

    var pbkdf2iterations=10000;
    let Encpassphrase = "thisisaphrase";
    var passphrasebytes=new TextEncoder("utf-8").encode(Encpassphrase);
    var pbkdf2salt=cipherbytes.slice(8,16);

    var passphrasekey=await window.crypto.subtle.importKey('raw', passphrasebytes, {name: 'PBKDF2'}, false, ['deriveBits'])
    .catch(function(err){
        console.error(err);
    });
    console.log('passphrasekey imported');
    var pbkdf2bytes=await window.crypto.subtle.deriveBits({"name": 'PBKDF2', "salt": pbkdf2salt, "iterations": pbkdf2iterations, "hash": 'SHA-256'}, passphrasekey, 384)		
    .catch(function(err){
        console.error(err);
    });
    console.log('pbkdf2bytes derived');
    pbkdf2bytes=new Uint8Array(pbkdf2bytes);

    let keybytes=pbkdf2bytes.slice(0,32);
    let ivbytes=pbkdf2bytes.slice(32);
    cipherbytes=cipherbytes.slice(16);

    var key=await window.crypto.subtle.importKey('raw', keybytes, {name: 'AES-CBC', length: 256}, false, ['decrypt']) 
    .catch(function(err){
        console.error(err);
    });
    decRSA(key);
    console.log('key imported');		

    var plaintextbytes=await window.crypto.subtle.decrypt({name: "AES-CBC", iv: ivbytes}, key, cipherbytes)
    .catch(function(err){
        console.error(err);
    });

    console.log('ciphertext decrypted');
    plaintextbytes=new Uint8Array(plaintextbytes);

    var blob=new Blob([plaintextbytes], {type: 'application/download'});
    var blobUrl=URL.createObjectURL(blob);
    return blobUrl;
}
//-------------------------------------------------------------- AES-DENCRYPTION END ---------------------------------------------------------------------------

export {encFile, dencFile}