"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class vc85 {
    /**
     * (Optional)
     * The constructor is used only to set parameters.
     * if null is passed then the default-value is used
     * for example, call "new vc85(3);" will set encodeMode = 3
     *
     * @param encodeMode null or 1,2,3 (default = 2)
     * @param splitWidth null or split width (default = 75)
     * @param addPf null or true or false (default = true)
     */
    constructor(encodeMode = null, splitWidth = null, addPf = null) {
        if (typeof encodeMode === 'number') {
            vc85.init(encodeMode);
        }
        if (typeof splitWidth === 'number') {
            vc85.splitWidth = Math.floor(splitWidth);
        }
        if (addPf !== null) {
            vc85.addPf = !!addPf;
        }
    }
    /**
     * encodeMode:
     *  0 - get actual value from vc85.defaultEncodeMode
     *  1 - classic ascii85 compatible characters table
     *  2 - vwx (default) - ascii85 with replaces: "=>v '=>w \=>x
     *  3 - vc85 - ascii85 with replaces all spec.chars to visually distinct characters (utf-8)
     *  4 - vc85 - same as 3, but the result will be encoded in windows-cp1251
     * @param encodeMode Mode 1, default = 2, 3
     */
    static init(encodeMode = 0) {
        if (!encodeMode) {
            encodeMode = vc85.defaultEncodeMode;
        }
        if (vc85.currentEncodeMode === encodeMode) {
            return;
        }
        let repc = 118; // replaces: "=>v '=>w \=>x
        for (let i = 0; i < 85; i++) {
            let cn = 33 + i;
            vc85.vc85dec[cn] = i;
            if (cn === 34 || cn === 39 || cn === 92) {
                const ca = repc++;
                vc85.vc85dec[ca] = i;
                if (encodeMode > 1) {
                    cn = ca;
                }
            }
            vc85.vc85enc[i] = String.fromCharCode(cn);
        }
        // replacement table: first char = from, second char = to.
        const repArr = ['!Я', '#Ж', '$Д', '%П', '&Ц', '(Щ', ')щ', '*ж', '+ф', ',ц', '-Э', '.я',
            '/ю', ':д', ';Б', '<Г', '=э', '>ъ', '?Ъ', '@Ф', 'IИ', 'OЮ', '[Ш', ']ш', '^л', '`й', 'lЛ'];
        // add windows-cp1251 char table
        const cp1251 = [223, 198, 196, 207, 214, 217, 249, 230, 244, 246, 221, 255, 254, 228, 193, 195, 253, 250, 218, 212, 200, 222, 216, 248, 235, 233, 203];
        repArr.forEach((repCh, n) => {
            const cn = repCh.charCodeAt(0);
            const ca = repCh.charCodeAt(repCh.length - 1);
            const cp = cp1251[n];
            const i = cn - 33;
            if (encodeMode > 2) {
                vc85.vc85enc[i] = (encodeMode === 4) ? String.fromCharCode(cp) : repCh.substring(1);
            }
            vc85.vc85dec[ca] = i;
            vc85.vc85dec[cp] = i;
            if (ca > 1088) { //d1 xx
                vc85.vc85dec[ca - 960] = i;
            }
            else if (ca > 1024) { //d0 xx
                vc85.vc85dec[ca - 896] = i;
            }
        });
        vc85.currentEncodeMode = encodeMode;
    }
    /**
     * Encode text-string to base-85
     * use inside:
     *   vc85.currentEncodeMode (1 or 2 or 3, @see vc85.init )
     *   vc85.splitWidth (to split result to lines by width, set 0 if no need)
     *   vc85.addPf (true or false, will add <~ ... ~> or not)
     * @param data binary string
     * @return vc85 encoded string
     */
    static encode(data) {
        const uint8Arr = new Uint8Array(new TextEncoder().encode(data));
        return vc85.encodeUint8Arr(uint8Arr);
    }
    /**
     * Encode bytes-array to base-85
     * @param data binary string
     * @return vc85 encoded string
     */
    static encodeUint8Arr(inUint8Arr) {
        vc85.currentEncodeMode || vc85.init();
        const len = inUint8Arr.length;
        const sub = len % 4;
        const pad = sub ? (4 - sub) : 0;
        const paddedUint8Arr = pad ? new Uint8Array(len + pad) : inUint8Arr;
        if (pad) {
            paddedUint8Arr.set(inUint8Arr);
        }
        const dataView = new DataView(paddedUint8Arr.buffer);
        const out = vc85.addPf ? ['<~'] : [];
        const pow85Arr = [52200625, 614125, 7225, 85, 1];
        const enc85Arr = vc85.vc85enc;
        for (let i = 0; i < len; i += 4) {
            let uint32 = dataView.getUint32(i, false);
            let sum = '';
            pow85Arr.forEach(pow => {
                const rem = uint32 % pow;
                sum += enc85Arr[Math.floor(uint32 / pow)];
                uint32 = rem;
            });
            out.push(sum);
        }
        ;
        if (pad) {
            const lg = out.length - 1;
            out[lg] = out[lg].substring(0, 5 - pad);
        }
        if (vc85.addPf) {
            out.push('~>');
        }
        return (vc85.splitWidth > 0) ? vc85.implodeSplitter(out) : out.join('');
    }
    static implodeSplitter(out) {
        const arr = out.join('').match(new RegExp(`.{1,${vc85.splitWidth}}`, 'g')) || [];
        if (arr[arr.length - 1] === '>') {
            arr[arr.length - 2] += '>';
            arr[arr.length - 1] = '';
        }
        if (arr[0] === '<') {
            arr[0] = '<~';
            arr[1] = '';
        }
        return arr.join('\n');
    }
    /**
     * Decode base85 string to bytes array
     *
     * @param dataSrc base-85 encoded string
     * @return decoded bytes array
     */
    static decodeToUint8Arr(dataSrc) {
        vc85.currentEncodeMode || vc85.init();
        // cut data between <~ ... ~>
        let i = dataSrc.indexOf('<~');
        i = (i < 0) ? 0 : i + 2;
        const j = dataSrc.indexOf('~>', i);
        let dataPre = (j > 0) ? dataSrc.substring(i, j) : dataSrc.substring(i);
        dataPre = dataPre.replace(/\s/g, '').replace(/z/g, '!!!!!').replace(/y/g, '+<VdL');
        const len = dataPre.length;
        const sub = len % 5;
        const pad = sub ? (5 - sub) : 0;
        const data = dataPre + vc85.vc85enc[84].repeat(pad);
        const out = [];
        data.match(/.{1,5}/g).forEach(value => {
            let sum = 0;
            value.split('').forEach(char => {
                const chcode = char.charCodeAt(0);
                sum = sum * 85 + (vc85.vc85dec[chcode] !== undefined ? vc85.vc85dec[chcode] : 0);
            });
            for (let i = 3; i >= 0; i--) {
                out.push((sum >> (i * 8)) & 0xFF);
            }
        });
        return sub ? new Uint8Array(out.slice(0, -pad)) : new Uint8Array(out);
    }
    /**
     * Decode base85 decoding to string
     *
     * @param dataSrc base-85 encoded string
     * @return decoded string
     */
    static decode(data) {
        let Uint8Arr = vc85.decodeToUint8Arr(data);
        const textDecoder = new TextDecoder('utf-8');
        return textDecoder.decode(Uint8Arr);
    }
}
vc85.vc85enc = []; // [number] => string (utf)
vc85.vc85dec = {}; // [number] => number
// encoder options:
vc85.currentEncodeMode = 0;
vc85.defaultEncodeMode = 2; // @see init
vc85.splitWidth = 75; // split result to lines by width
vc85.addPf = true; // add <~ ... ~> or not
exports.default = vc85;
//# sourceMappingURL=vc85.js.map