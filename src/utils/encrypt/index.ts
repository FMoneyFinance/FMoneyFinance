import CryptoJS from "crypto-js";

export const encryptPayload = (payload: object) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(payload),
    import.meta.env.VITE_SECRET_KEY
  ).toString();

  return encrypted;
};
