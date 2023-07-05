import * as CryptoJS from 'crypto-js';

/**
 * aes 加密
 */
export function aes_encrypt (content: string, key: string, iv: string) {
	const cipher = CryptoJS.AES.encrypt(content, CryptoJS.enc.Utf8.parse(key), {
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
		iv: CryptoJS.enc.Utf8.parse(iv),
	});
	return cipher.toString()
}

/**
 * aes 解密
 */
export function aes_decrypt (content: string, key: string, iv: string) {
	const decrypt = CryptoJS.AES.decrypt(content, CryptoJS.enc.Utf8.parse(key), {
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
		iv: CryptoJS.enc.Utf8.parse(iv),
	});
	return decrypt.toString(CryptoJS.enc.Utf8)
}