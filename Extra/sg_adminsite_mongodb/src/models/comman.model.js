import CryptoJS from "crypto-js";

const Encrypted = async (data) => {
  let key = CryptoJS.enc.Utf8.parse("acg12jdsa21oand4");
  let iv = CryptoJS.enc.Utf8.parse("8080808080808080");
  let EncryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
  return EncryptedData;
};

const Decrypted = async (data) => {
  if (data) {
    data = decodeURIComponent(data);
    let key = CryptoJS.enc.Utf8.parse("acg12jdsa21oand4");
    let iv = CryptoJS.enc.Utf8.parse("8080808080808080");
    let decryptedData = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(data) },
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } else {
    throw new Error("No encrypted Data!");
  }
};

export default { Encrypted, Decrypted };
