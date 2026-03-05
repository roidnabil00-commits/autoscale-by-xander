// Modul Enkripsi Kustom Xander Systems
// Menggunakan algoritma XOR cipher sederhana yang ringan untuk browser

const SALT = "XANDER_ENTERPRISE_2026";

const textToChars = (text: string) => text.split("").map((c) => c.charCodeAt(0));
const byteHex = (n: number) => ("0" + Number(n).toString(16)).substr(-2);
const applySaltToChar = (code: number) => textToChars(SALT).reduce((a, b) => a ^ b, code);

export const encryptSession = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    return jsonString.split("").map(textToChars).map((c) => applySaltToChar(c[0])).map(byteHex).join("");
  } catch (error) {
    return "";
  }
};

export const decryptSession = (encoded: string): any => {
  try {
    const match = encoded.match(/.{1,2}/g);
    if (!match) return null;
    
    const decodedString = match
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
      
    return JSON.parse(decodedString);
  } catch (error) {
    return null; // Menggagalkan manipulasi manual oleh peretas
  }
};