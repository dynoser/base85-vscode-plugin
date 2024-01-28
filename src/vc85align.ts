import vc85 from "./vc85";

export default class vc85align extends vc85 {
    public static similarChars: string[] = [
    'Я', // 0
    'v ν ѵ ᴠ 𝐯 𝑣 𝒗 𝓋 𝓿 𝕧 𝗏 𝘃 𝘷 𝙫 𝚟 𝛎 𝜈 𝝂 𝝼 𝞶', // 1
    'Ж', // 2
    'Д', // 3
    'П Π ℿ ∏ Ⲡ 𝚷 𝛱 𝜫 𝝥 𝞟', // 4
    'Ц', // 5
    'w ѡ ԝ ᴡ 𝐰 𝑤 𝒘 𝓌 𝔀 𝕨 𝗐 𝘄 𝘸 𝙬 𝚠', // 6
    'Щ', // 7
    'щ', // 8
    'ж', // 9
    'ф ɸ φ ϕ 𝛗 𝛟 𝜑 𝜙 𝝋 𝝓 𝞅 𝞍 𝞿 𝟇', // 10
    'ц', // 11
    'Э ℈', // 12
    'я ᴙ', // 13
    'ю', // 14
    '0 O Ο О Օ Ö Ő Ӧ Ŏ Ǒ Ⲟ 〇 ０ ⍥ 𐐄 𝐎 𝑂 𝑶 𝒪 𝓞 𝕆 𝖮 𝗢 𝘖 𝙊 𝙾 𝚶 𝛰 𝜪 𝝤 𝞞 𝟎 𝟘 𝟢 𝟬 𝟶', // 15
    '1 I l | Ɩ ǀ Ι І Ӏ ӏ Ⲓ １ 𝐈 𝐥 𝐼 𝑰 𝒍 𝔩 𝕀 𝕝 𝖑 𝖨 𝗅 𝗜 𝗹 𝘐 𝘭 𝙄 𝙡 𝙸 𝚕 𝚰 𝛪 𝜤 𝝞 𝞘 𝟏 𝟙 𝟣 𝟭 𝟷', // 16
    '2 Ƨ ２ 𝟐 𝟚 𝟤 𝟮 𝟸', // 17
    '3 Ʒ Ȝ З Ӡ з ɜ Ⳍ Ꝫ Ɜ ３ ᴈ 𝟑 𝟛 𝟥 𝟯 𝟹', // 18
    '4 ч Ч ４ 𝟒 𝟜 𝟦 𝟰 𝟺', // 19
    '5 Ƽ ５ 𑢻 𝟓 𝟝 𝟧 𝟱 𝟻', // 20
    '6 б Ꮾ Ⳓ ６ 𑣕 𝟔 𝟞 𝟨 𝟲 𝟼', // 21
    '7 ７ 𐓒 𑣆 𝈒 𝟕 𝟟 𝟩 𝟳 𝟽', // 22
    '8 Ȣ ȣ ৪ ੪ ଃ ８ 𐌚 𝟖 𝟠 𝟪 𝟴 𝟾', // 23
    '9 Ⳋ Ꝯ ９ 𝟗 𝟡 𝟫 𝟵 𝟿', // 24
    'д', // 25
    'Б Ƃ ƃ', // 26
    'Г Γ ℾ Ⲅ 𝚪 𝛤 𝜞 𝝘 𝞒', // 27
    'э', // 28
    'ъ', // 29
    'Ъ', // 30
    'Ф Φ Փ Ⲫ 𝚽 𝛷 𝜱 𝝫 𝞥', // 31
    'A Α А Ä Ӓ Å Ȧ Ă Ǎ ᴀ Ａ 𝐀 𝐴 𝑨 𝒜 𝓐 𝔸 𝖠 𝗔 𝘈 𝘼 𝙰 𝚨 𝛢 𝜜 𝝖 𝞐', // 32
    'B ʙ Β В в ℬ Ꞵ Ｂ 𝐁 𝐵 𝑩 𝓑 𝔅 𝔹 𝕭 𝖡 𝗕 𝘉 𝘽 𝙱 𝚩 𝛣 𝜝 𝝗 𝞑', // 33
    'C Ϲ С ℂ Ⅽ Ⲥ Ｃ 𐐕 𝐂 𝐶 𝑪 𝒞 𝓒 𝖢 𝗖 𝘊 𝘾 𝙲', // 34
    'D Ꭰ ᗞ ᗪ ᴅ ⅅ Ⅾ ꓓ ꭰ Ｄ 𝐃 𝐷 𝑫 𝒟 𝓓 𝔇 𝔻 𝕯 𝖣 𝗗 𝘋 𝘿 𝙳', // 35
    'E Ε Е Ё Ĕ Ě ℰ Ｅ ⋿ 𝐄 𝐸 𝑬 𝓔 𝔼 𝖤 𝗘 𝘌 𝙀 𝙴 𝚬 𝛦 𝜠 𝝚 𝞔', // 36
    'F Ϝ ℱ Ꞙ Ｆ 𐊇 𐊥 𐔥 𑢢 𑣂 𝈓 𝐅 𝐹 𝑭 𝓕 𝔽 𝖥 𝗙 𝘍 𝙁 𝙵 𝟊', // 37
    'G Ԍ Ğ Ǧ Ｇ 𝐆 𝐺 𝑮 𝔾 𝖦 𝗚 𝘎 𝙂 𝙶', // 38
    'H Η Н ʜ н ℋ ℌ ℍ Ⲏ Ｈ ꮋ 𝐇 𝐻 𝑯 𝓗 𝖧 𝗛 𝘏 𝙃 𝙷 𝚮 𝛨 𝜢 𝝜 𝞖', // 39
    'И Ͷ ы Ы ꚡ 𐐥 𝈋', // 40
    'J Ϳ Ј Ｊ 𝐉 𝐽 𝑱 𝒥 𝓙 𝔍 𝕁 𝕵 𝖩 𝗝 𝘑 𝙅 𝙹', // 41
    'K Κ К Ꮶ ᛕ K Ⲕ ꓗ Ｋ 𐔘 𝐊 𝐾 𝑲 𝒦 𝓚 𝕂 𝖪 𝗞 𝘒 𝙆 𝙺 𝚱 𝛫 𝜥 𝝟 𝞙', // 42
    'L ʟ Ⅼ Ⳑ ⳑ Ｌ ℒ ᒪ 𐐛 𐑃 𝐋 𝐿 𝑳 𝓛 𝕃 𝖫 𝗟 𝘓 𝙇 𝙻 𝔏 𝈪 𑢲 𝕷', // 43
    'M Μ Ϻ М м ʍ ℳ Ⅿ Ⲙ Ｍ ᛖ ꓟ ᗰ Ꮇ ꮇ ᴍ 𝐌 𝑀 𝑴 𝓜 𝕄 𝖬 𝗠 𝘔 𝙈 𝙼 𝚳 𝛭 𝜧 𝝡 𝞛 𐌑 𐊰', // 44
    'N ɴ Ν ℕ Ⲛ Ｎ ꓠ 𝐍 𝑁 𝑵 𝒩 𝓝 𝖭 𝗡 𝘕 𝙉 𝙽 𝚴 𝛮 𝜨 𝝢 𝞜 𐔓', // 45
    'Ю', // 46
    'P Ρ Р ℙ Ⲣ Ｐ ꓑ Ꮲ ᑭ 𝐏 𝑃 𝑷 𝒫 𝓟 𝖯 𝗣 𝘗 𝙋 𝙿 𝚸 𝛲 𝜬 𝝦 𝞠 𐊕', // 47
    'Q ℚ Ｑ ⵕ 𝐐 𝑄 𝑸 𝒬 𝓠 𝔔 𝕼 𝖰 𝗤 𝘘 𝙌 𝚀', // 48
    'R Ʀ ℛ ℜ ℝ Ｒ Ꭱ ꓣ ᖇ Ꮢ 𝐑 𝑅 𝑹 𝓡 𝕽 𝖱 𝗥 𝘙 𝙍 𝚁 𖼵 𐒴 𝈖', // 49
    'S Ѕ Տ Ｓ 𐐠 𝐒 𝑆 𝑺 𝒮 𝓢 𝕊 𝖲 𝗦 𝘚 𝙎 𝚂 𐊖', // 50
    'T Τ Т ⊤ ⟙ Ⲧ Ｔ ꓔ Ꭲ 𝐓 𝑇 𝑻 𝒯 𝕋 𝖳 𝗧 𝘛 𝙏 𝚃 𝚻 𝛵 𝜯 𝝩 𝞣 🝨 𐊗 𐌕 𖼊 𝓣 𐊱 𑢼', // 51
    'U Ս ⋃ Ｕ ሀ ᑌ ꓴ 𝐔 𝑈 𝑼 𝒰 𝓤 𝔘 𝕌 𝖀 𝖴 𝗨 𝘜 𝙐 𝚄 𑢸 𐓎 𖽂', // 52
    'V Ѵ Ⅴ Ｖ Ꮩ ꛟ ꓦ ⴸ 𝐕 𝑉 𝑽 𝒱 𝓥 𝕍 𝖵 𝗩 𝘝 𝙑 𝚅 𑢠 𝈍 𖼈', // 53
    'W Ԝ Ｗ Ꮃ Ꮤ 𝐖 𝑊 𝑾 𝒲 𝓦 𝕎 𝖶 𝗪 𝘞 𝙒 𝚆', // 54
    'X Χ Х Ⅹ ╳ Ⲭ Ꭓ Ｘ ꓫ ᙭ ᚷ 𝐗 𝑋 𝑿 𝒳 𝓧 𝕏 𝖷 𝗫 𝘟 𝙓 𝚇 𝚾 𝛸 𝜲 𝝬 𝞦 𐊴 𐌢', // 55
    'Y y Υ ϒ У Ү у ʏ ɣ ү γ Ⲩ Ｙ Ꭹ ꓬ Ꮍ ᶌ ｙ ꭚ ყ ℽ ỿ 𝐘 𝑌 𝒀 𝕐 𝖸 𝗬 𝘠 𝙔 𝚈 𝚼 𝛶 𝜰 𝝪 𝞤 𑢤 𖽃 𐊲 𝙮 𝐲 𝝲 𝑦 𝞬 𑣜 𝕪 𝖞 𝚢 𝒚 𝓎 𝗒 𝘆 𝛾 𝛄 𝔂 𝜸 𝔶 𝘺', // 56
    'Z z Ζ ℤ Ｚ Ꮓ ꓜ ᴢ ꮓ 𝐙 𝑍 𝒁 𝒵 𝓩 𝖹 𝗭 𝘡 𝙕 𝚉 𝚭 𝛧 𝜡 𝝛 𝞕 𑣥 𑢩 𝓏 𝙯 𝐳 𝗓 𑣄 𝑧 𝘇 𝕫 𝔃 𝚣 𝒛 𝘻', // 57
    'Ш Ⲽ', // 58
    'x × х ⨯ ᕁ ⤫ ⤬ ᙮ ｘ ⅹ ᕽ 𝐱 𝑥 𝒙 𝓍 𝔁 𝔵 𝕩 𝖝 𝗑 𝘅 𝘹 𝙭 𝚡', // 59
    'ш ⲽ', // 60
    'л ᴫ', // 61
    '_', // 62
    'й ѝ Ѝ Й', // 63
    'a ɑ α а ă ǎ å ȧ ä ӓ ⍺ ａ 𝐚 𝑎 𝒂 𝒶 𝓪 𝔞 𝕒 𝖆 𝖺 𝗮 𝘢 𝙖 𝚊 𝛂 𝛼 𝜶 𝝰 𝞪', // 64
    'b Ƅ Ь ь ｂ 𝐛 𝑏 𝒃 𝒷 𝓫 𝔟 𝕓 𝖇 𝖻 𝗯 𝘣 𝙗 𝚋', // 65
    'c ϲ с ᴄ ⅽ ⲥ ｃ 𐐽 𝐜 𝑐 𝒄 𝒸 𝓬 𝔠 𝕔 𝖈 𝖼 𝗰 𝘤 𝙘 𝚌', // 66
    'd ԁ ⅆ ⅾ ｄ 𝐝 𝑑 𝒅 𝒹 𝓭 𝕕 𝖽 𝗱 𝘥 𝙙 𝚍', // 67
    'e е ё ҽ ĕ ě ℮ ℯ ⅇ ꬲ ｅ 𝐞 𝑒 𝒆 𝓮 𝔢 𝕖 𝖊 𝖾 𝗲 𝘦 𝙚 𝚎', // 68
    'f ꬵ ｆ 𝐟 𝑓 𝒇 𝔣 𝕗 𝖋 𝖿 𝗳 𝘧 𝙛 𝚏 𝟋', // 69
    'g ƍ ɡ ց ğ ǧ ģ ǵ ᶃ ℊ ｇ 𝐠 𝑔 𝒈 𝓰 𝔤 𝕘 𝖌 𝗀 𝗴 𝘨 𝙜 𝚐', // 70
    'h һ հ ℎ ｈ 𝐡 𝒉 𝒽 𝓱 𝔥 𝕙 𝖍 𝗁 𝗵 𝘩 𝙝 𝚑', // 71
    'i ĭ ǐ і ɩ ı ι ⅈ ｉ ⅰ ⍳ ℹ 𝓲 𝞲 𝔦 𝘪 𝙞 𝚤 𝐢 𝑖 𝕚 𝖎 𝚒 𝒊 𝛊 𝒾 𝜾 𝜄 𝗂 𝝸 𝗶', // 72
    'j ϳ ј ⅉ ｊ 𝐣 𝑗 𝒋 𝒿 𝓳 𝔧 𝕛 𝖏 𝗃 𝗷 𝘫 𝙟 𝚓', // 73
    //'k ｋ 𝐤 𝑘 𝒌 𝓀 𝓴 𝔨 𝕜 𝖐 𝗄 𝗸 𝘬 𝙠 𝚔' . '𝞳 ᴋ 𝜅 𝛋 𝜿 ⲕ ꮶ ĸ κ к 𝝹', // 74
    'k ĸ κ к ｋ ᴋ ⲕ ꮶ 𝐤 𝑘 𝒌 𝓀 𝓴 𝔨 𝕜 𝖐 𝗄 𝗸 𝘬 𝙠 𝚔 𝞳 𝜅 𝛋 𝜿 𝝹', // 74
    'Л Λ Ʌ 𝚲 𝜦 𝛬 𝝠 𝞚', // 75
    'm ｍ ⅿ 𝒎 𝘮 𝖒 𝐦 𝗆 𝔪 𝕞 𝓂 𝙢 𝓶 𝚖 𝑚 𝗺', // 76
    'n ո ռ π п ｎ ᴨ ℼ 𝐧 𝑛 𝒏 𝓃 𝓷 𝔫 𝕟 𝖓 𝗇 𝗻 𝘯 𝙣 𝚗 𝛑 𝝅 𝜋 𝝿 𝞹', // 77
    'o ο о օ ŏ ǒ ö ӧ ဝ ၀ ჿ ᴏ ᴑ ℴ ⲟ 𐐬 𝐨 𝑜 𝒐 𝓸 𝔬 𝕠 𝖔 𝗈 𝗼 𝘰 𝙤 𝚘 𝛐 𝜊 𝝄 𝝾 𝞸', // 78
    'p ρ р ⍴ ⲣ 𝐩 𝑝 𝒑 𝓅 𝓹 𝔭 𝕡 𝖕 𝗉 𝗽 𝘱 𝙥 𝚙 𝛒 𝜌 𝝆 𝞀 𝞺', // 79
    'q ԛ գ զ ｑ 𝐪 𝑞 𝒒 𝓆 𝓺 𝔮 𝕢 𝖖 𝗊 𝗾 𝘲 𝙦 𝚚', // 80
    'r г ᴦ ⲅ ꭇ ꭈ ｒ 𝐫 𝑟 𝒓 𝓇 𝓻 𝔯 𝕣 𝖗 𝗋 𝗿 𝘳 𝙧 𝚛', // 81
    's ѕ ꜱ ｓ 𐑈 𝐬 𝑠 𝒔 𝓈 𝓼 𝔰 𝕤 𝖘 𝗌 𝘀 𝘴 𝙨 𝚜', // 82
    't т τ ｔ ᴛ 𝐭 𝑡 𝒕 𝓉 𝓽 𝔱 𝕥 𝖙 𝗍 𝘁 𝘵 𝙩 𝚝 𝜏 𝞽 𝞃 𝛕 𝝉', // 83
    'u υ ս ʋ ᴜ ꭒ ｕ ꭎ ꞟ 𝐮 𝑢 𝒖 𝓊 𝓾 𝔲 𝕦 𝖚 𝗎 𝘂 𝘶 𝙪 𝚞 𐓶 𝛖 𝜐 𝝊 𝞾 𝞄 ͷ 𐑍 и ᴎ', // 84
    ];

    public static to85: Record<string, number> = {};
    public static toInited: number = 0;

    public static initAlign() {
        vc85align.init(3);
        for (const n in vc85align.similarChars) {
            const charStr = vc85align.similarChars[n];
            const charArr = charStr.split(' ');
            for (const char of charArr) {
                if (vc85align.to85[char]) {
                    throw new Error("ERR");
                }
                vc85align.to85[char] = Number(n);
            }
        }
        vc85align.toInited = vc85align.currentEncodeMode;
    }

    public static align(data: string): string {
        (vc85align.toInited && vc85align.toInited === vc85align.currentEncodeMode) || vc85align.initAlign();

        // need data between <~ ... ~>
        let fromPos: number = data.indexOf('<~');
        fromPos = (fromPos < 0) ? 0 : fromPos + 2;
        const leftPref: string = fromPos ? data.slice(0, fromPos) : '<~';
        let rightSuff: string = '~>';
        
        let toPos: number = data.length;
        const j: number = data.indexOf('~>', fromPos);
        if (j >= 0) {
            rightSuff = data.slice(j);
            toPos = j;
        }

        const txtArr = Array.from(data.slice(fromPos, toPos));
        let len = txtArr.length;
        if (1 === len % 5) {
            txtArr.push('_');
            len++;
        }
        for (let gi = 0; gi < len; gi += 5) {
            let chIn = txtArr[gi];
            const chOut = vc85align.charTo85(chIn);
            switch (chOut) {
                case 't':
                    txtArr[gi] = 'T';
                    break;
                case 'u':
                    txtArr[gi] = 'И';
                    break;
                case 's':
                    //s8WЭЯ - max
                    if (gi + 1 < len) {
                        chIn = txtArr[gi + 1];
                        const nxCh = vc85align.charTo85(chIn);
                        const nxN85 = vc85align.vc85dec[nxCh.charCodeAt(0)];
                        if (nxN85 > 22) {
                            txtArr[gi] = 'S';
                        }
                    }
            }
        }
        const outArr: string[] = [leftPref];
        for (const chIn of txtArr) {
            const chOut = vc85align.charTo85(chIn);
            outArr.push(chOut);
        }
        outArr.push(rightSuff);
        return outArr.join('');
    }

    public static charTo85(chIn: string): string {
        return vc85align.to85.hasOwnProperty(chIn) ? vc85align.vc85enc[vc85align.to85[chIn]] : ((chIn === "\n" || chIn === "\r") ? chIn : '_');
    }
}