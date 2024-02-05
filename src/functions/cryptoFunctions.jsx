import CryptoJS from "crypto-js";

export const encryptUrl = (url, secretKey) => {
  const encryptedUrl = CryptoJS.AES.encrypt(url, secretKey).toString();
  return encryptedUrl;
};

export const decryptUrl = (encryptedUrl, secretKey) => {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedUrl, secretKey);
  const decryptedUrl = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedUrl;
};