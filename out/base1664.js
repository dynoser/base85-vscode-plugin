"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class base1664 {
    static textUTF8toBase64(str, urlMode = true) {
        let base64;
        if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
            base64 = window.btoa(unescape(encodeURIComponent(str)));
        }
        else if (typeof Buffer !== 'undefined') {
            try {
                base64 = Buffer.from(str, 'utf-8').toString('base64');
            }
            catch (error) {
                base64 = Buffer.from(str).toString('base64');
            }
        }
        else if (typeof btoa === "function") {
            base64 = btoa(unescape(encodeURIComponent(str)));
        }
        else {
            const uint8Arr = new Uint8Array(new TextEncoder().encode(str));
            return base1664.Uint8ArrToBase64(uint8Arr);
        }
        return urlMode ? base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '') : base64;
    }
    static base64toTextUTF8(base64String) {
        if (!base64String.length) {
            return '';
        }
        base64String = base64String.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
        ;
        const isValidBase64String = /^[A-Za-z0-9+/=]+$/.test(base64String);
        if (!isValidBase64String) {
            return null;
        }
        while (base64String.length % 4) {
            base64String += '=';
        }
        if (typeof Buffer !== 'undefined') {
            return Buffer.from(base64String, 'base64').toString('utf-8');
        }
        const hexString = base1664.clearBase64ToHex(base64String);
        const uint8Arr = base1664.hexToUint8Arr(hexString);
        return base1664.Uint8ArrToTextUTF8(uint8Arr);
    }
    static Uint8ArrToTextUTF8(Uint8Arr) {
        const textDecoder = new TextDecoder('utf-8');
        const utf8String = textDecoder.decode(Uint8Arr);
        return utf8String;
    }
    static hexExplode(str) {
        const hexArr = [];
        const l = str.length;
        const regex = /^[0-9a-fA-F]$/;
        for (let i = 0; i < l; i++) {
            const ch1 = str[i];
            if (regex.test(ch1)) {
                const ch2 = str[i + 1];
                if (regex.test(ch2)) {
                    hexArr.push(ch1 + ch2);
                    i++;
                }
                else {
                    hexArr.push('0' + ch1);
                }
            }
        }
        return hexArr;
    }
    static hexToUint8Arr(hexStr) {
        const hexArr = base1664.hexExplode(hexStr);
        if (typeof Buffer !== 'undefined') {
            try {
                return Buffer.from(hexArr.join(''), 'hex'); //.toString('base64');
            }
            catch (e) {
            }
        }
        let bytesArr = [];
        for (let hx of hexArr) {
            bytesArr.push(parseInt(hx, 16));
        }
        return new Uint8Array(bytesArr);
    }
    static Uint8ArrToBase64(Uint8Arr, urlMode = false) {
        const len = Uint8Arr.length;
        if (!Uint8Arr.length) {
            return '';
        }
        if (typeof Buffer !== 'undefined' && Uint8Arr instanceof Buffer) {
            return urlMode ? Uint8Arr.toString('base64url').replace(/=/g, '') : Uint8Arr.toString('base64');
        }
        // if (typeof btoa === "function") {
        //     const str = String.fromCharCode.apply(null, Array.from(Uint8Arr));
        //     return btoa(str);
        // }
        // if (typeof window !== 'undefined' && typeof window.btoa === "function") {
        //     const str = String.fromCharCode.apply(null, Array.from(Uint8Arr));
        //     return window.btoa(str);
        // }
        let base64Chars = urlMode ? base1664.base64Chars.slice(0, -3) + '-_' : base1664.base64Chars;
        let base64str = '';
        let i = 0;
        while (i < len) {
            const o1 = Uint8Arr[i++];
            const o2 = i < len ? Uint8Arr[i++] : 0;
            const o3 = i < len ? Uint8Arr[i++] : 0;
            const bits = (o1 << 16) | (o2 << 8) | o3;
            base64str +=
                base64Chars.charAt((bits >> 18) & 0x3F) +
                    base64Chars.charAt((bits >> 12) & 0x3F) +
                    base64Chars.charAt((bits >> 6) & 0x3F) +
                    base64Chars.charAt((bits) & 0x3F);
        }
        switch (len % 3) {
            case 1:
                return base64str.slice(0, -2) + (urlMode ? '' : '==');
            case 2:
                return base64str.slice(0, -1) + (urlMode ? '' : '=');
        }
        return base64str;
    }
    static hexToBase64(hexStr, urlMode = false) {
        const Uint8Arr = base1664.hexToUint8Arr(hexStr);
        return base1664.Uint8ArrToBase64(Uint8Arr, urlMode);
    }
    static base64ToHex(base64String) {
        if (!base64String.length) {
            return '';
        }
        base64String = base64String.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
        const isValidBase64String = /^[A-Za-z0-9+/=]+$/.test(base64String);
        if (!isValidBase64String) {
            return null;
        }
        while (base64String.length % 4) {
            base64String += '=';
        }
        if (typeof Buffer !== 'undefined') {
            return Buffer.from(base64String, 'base64').toString('hex');
        }
        return base1664.clearBase64ToHex(base64String);
    }
    static Uint8ArrToHexStr(Uint8Arr) {
        const hexString = Array.from(Uint8Arr)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
        return hexString;
    }
    static clearBase64ToHex(base64String) {
        let hexString = '';
        const base64Chars = base1664.base64Chars;
        const hexChars = '0123456789abcdef';
        for (let i = 0; i < base64String.length; i += 4) {
            const block24bit = ((base64Chars.indexOf(base64String[i]) << 18) |
                (base64Chars.indexOf(base64String[i + 1]) << 12) |
                (base64Chars.indexOf(base64String[i + 2]) << 6) |
                (base64Chars.indexOf(base64String[i + 3])));
            const validHexDigits = base64String[i + 2] === '=' ? 2 : base64String[i + 3] === '=' ? 4 : 6;
            for (let j = 0; j < validHexDigits; j++) {
                hexString += hexChars[((block24bit >> (20 - j * 4)) & 0xF)];
            }
        }
        return hexString;
    }
}
base1664.base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
exports.default = base1664;
//# sourceMappingURL=base1664.js.map