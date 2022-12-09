// ------------------------------------------ enc start -----------------------------------------------------------------------

        // let url2Blob = async() => {
        //     const response = await fetch(url);
        //     console.log("URL: " + url);
        //     if(!response.ok) {
        //         const message = `An Error has occured while fetching: ${response.status}`;
        //         throw new Error(message);
        //     }

        //     const file = await response.blob();
        //     console.log("creating file: ", typeof(file));
        //     return file;
        // }

        // let readFile = (file) => {
        //     return new Promise((resolve, reject) => {
        //         let fr = new FileReader();  
        //         fr.onload = () => {
        //             resolve(fr.result)
        //         };
        //         fr.readAsArrayBuffer(file);
        //     });
        // }
        
        // let Encpassphrase = "thisisaphrase";

        // let encryptFile = async() => {
            
        //     let file = url2Blob(url);
        //     console.log('type of file: ' + typeof(file))
        //     // if(typeof(file) !== 'file') {}
        //     var plaintextbytes = await readFile(file)
        //     .catch(function(err){
        //         console.error(err);
        //     });
        //     console.log('type of plaintextbytes: ' + typeof(plaintextbytes))
        //     plaintextbytes = new Uint8Array(plaintextbytes)
        //     let pbkdf2iterations = 10000;
        //     let passphrasebytes = new TextEncoder("utf-8").encode(Encpassphrase);
        //     let pbkdf2salt = window.crypto.getRandomValues(new Uint8Array(8));
        //     let passphrasekey = await window.crypto.subtle.importKey('raw',passphrasebytes, { name: 'PBKDF2'}, false, ['deriveBits'])
        //     .catch((error)=>{
        //         console.log(error);
        //     });
        //     console.log("passphrasekey imported")

        //     let pbkdf2bytes = await window.crypto.subtle.deriveBits({ "name": 'PBKDF2', "salt": pbkdf2salt, "iterations": pbkdf2iterations, "hash": 'SHA-256'}, passphrasekey, 384)
        //     .catch(function(err){
        //         console.error(err);
        //     });
        //     console.log('pbkdf2bytes derived');
        //     pbkdf2bytes = new Uint8Array(pbkdf2bytes);

        //     let keybytes = pbkdf2bytes.slice(0,32);
        //     let ivbytes=pbkdf2bytes.slice(32);

        //     let key = await window.crypto.subtle.importKey('raw', keybytes, { name: 'AES-CBC', length: 256}, false, ['encrypt'])
        //     .catch((error)=>{
        //         console.log(error);
        //     });

        //     let cipherbytes = await window.crypto.subtle.encrypt({ name: "AES-CBC", iv: ivbytes }, key, plaintextbytes)
        //     .catch((error)=>{
        //         console.log(error);
        //     });

        //     if(!cipherbytes){
        //         console.log("ERROR ENCRYPTING FILE, SEE CONSOLE LOG!");
        //         return;
        //     }

        //     console.log("Plaintext encrypted");
        //     cipherbytes = new Uint8Array(cipherbytes);

        //     let resultbytes = new Uint8Array(cipherbytes.length+16);
        //     resultbytes.set(new TextEncoder("utf-8").encode('Salted__'));
        //     resultbytes.set(pbkdf2salt, 8);
        //     resultbytes.set(cipherbytes, 16);

        //     let blob = new Blob([resultbytes], { type: 'application/download'});
        //     let blobUrl = URL.createObjectURL(blob);
        //     console.log('Bloburl:   ' + blobUrl);
        //     return blobUrl;
        // }

        // let encryptedFileUrl = encryptFile() ? encryptFile() : '';
        // console.log('type: ' + file.type);
        // console.log('title: ' + file.title);
        // console.log('asset_url: ' + file.asset_url);
        // console.log('typeof asset_url: ' + typeof(file.asset_url))
        // console.log('file_size: ' + file.file_size);
        /*
        text,ppt -> asset_url
        image -> image_url
         */
        // ------------------------------------------ enc end -----------------------------------------------------------------------  


        async function promiseAllDemo() {
            try {
            console.log("AYOYO MADAFAKA")
              const promise1 = Promise.resolve("hello world");
              const promise2 = "Promise 2";
              const promise3 = new Promise((resolve, reject) => {
                setTimeout(resolve, 100, "foo");
              });
              const resolvedPromises = await Promise.all([promise1, promise2, promise3]);
            } catch (err) {
              console.log(err);
            }
          }
        promiseAllDemo();