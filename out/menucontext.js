"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
class menuContext {
    static onSelectionChange(event) {
        return menuContext.onSelectionChangeByEditor(event.textEditor);
    }
    static onSelectionChangeByEditor(textEditor) {
        const { document, selection } = textEditor;
        const langID = document.languageId;
        menuContext.docIsB85 = langID === '.b85';
        let canDecode = menuContext.docIsB85;
        let canEncode = true;
        let selExactly85 = false;
        let selMaybeHex = false;
        let selExactlyHex = false;
        let selMaybeB64 = false;
        // try to detect integrateg-base85 by ~-prefix
        const sel_text = document.getText(selection);
        if (sel_text) {
            let strlen = sel_text.length;
            let lastCh = '';
            // reduce line by end-spaces
            const spcs = " \t\n\r";
            while (strlen) {
                lastCh = sel_text[strlen - 1];
                if (spcs.indexOf(lastCh) < 0)
                    break;
                strlen--;
            }
            // reduce line by start-spaces
            let i = 0;
            while (i < strlen) {
                if (spcs.indexOf(sel_text[i]) < 0)
                    break;
                i++;
                strlen--;
            }
            if (strlen > 1) {
                let firstCh = sel_text.charAt(i);
                // Is the selected text enclosed in quotation?
                // const inQuotas: string = ((lastCh === firstCh) && ('`\'"'.indexOf(firstCh) >= 0)) ? lastCh : '';
                // if (inQuotas) {
                //     i++;
                //     firstCh = sel_text.charAt(i);
                //     strlen -= 2;
                //     lastCh = sel_text.charAt(i + strlen - 1);
                // }
                // HEX check
                if (strlen > 7) {
                    selMaybeHex = /^[0-9a-fA-F\s]*$/.test(sel_text.substring(i, i + strlen));
                    if (selMaybeHex && strlen > 15) {
                        selExactlyHex = true;
                        if (strlen < 32) {
                            selMaybeB64 = true;
                        }
                    }
                    else {
                        selMaybeB64 = /^[A-Za-z0-9+\-_/=\s]*$/.test(sel_text.substring(i, i + strlen));
                    }
                }
                if (menuContext.menuDecoderEnabled === 'by Context' || menuContext.menuDecoderEnabled === "on <~...~>") {
                    const firstTilda = sel_text.indexOf('~', i);
                    if (firstTilda === i + 1 && firstCh === '<') {
                        canDecode = true;
                        canEncode = false;
                        selExactly85 = true;
                    }
                    else {
                        if (menuContext.menuDecoderEnabled === "on <~...~>") {
                            canDecode = false;
                        }
                        else if ((selExactlyHex && strlen > 32) || (selMaybeB64 && strlen > 64)) {
                            canDecode = false;
                            canEncode = false;
                        }
                        else {
                            // by Context:
                            let spacesInLines = false;
                            let eol = sel_text.indexOf("\n", i);
                            if (eol > i && eol < i + strlen) {
                                let lines = sel_text.substring(i, i + strlen).split("\n");
                                for (let line of lines) {
                                    if (/\s/.test(line.trim())) {
                                        canDecode = false;
                                        spacesInLines = true;
                                        selMaybeB64 = false;
                                        break;
                                    }
                                }
                                strlen = (eol - i);
                            }
                            if (!spacesInLines) {
                                while (strlen) {
                                    lastCh = sel_text[i + strlen - 1];
                                    if (spcs.indexOf(lastCh) < 0)
                                        break;
                                    strlen--;
                                }
                                if (strlen > 1) {
                                    canDecode = /^[!-zЯЖДПЦЩщжфцЭяюдБГэъЪФИЮШшлйЛ\s]*$/u.test(sel_text.substring(i, i + strlen));
                                }
                            }
                        }
                    }
                }
                else if (menuContext.menuDecoderEnabled === 'Always') {
                    canDecode = true;
                }
                else {
                    canDecode = false;
                }
            }
        }
        if (canDecode !== menuContext.menuCanDecode) {
            menuContext.menuCanDecode = canDecode;
            vscode.commands.executeCommand("setContext", "base85.canDecode", menuContext.menuCanDecode).then(() => {
                return menuContext.menuCanDecode;
            });
        }
        if (!menuContext.menuEncodeEnabled) {
            canEncode = false;
        }
        if (canEncode !== menuContext.menuCanEncode) {
            menuContext.menuCanEncode = canEncode;
            vscode.commands.executeCommand("setContext", "base85.canEncode", menuContext.menuCanEncode).then(() => {
                return menuContext.menuCanEncode;
            });
        }
        if (selExactly85 !== menuContext.menuSelExactly85) {
            menuContext.menuSelExactly85 = selExactly85;
            vscode.commands.executeCommand("setContext", "base85.selExactly85", menuContext.menuSelExactly85).then(() => {
                return menuContext.menuSelExactly85;
            });
        }
        if (selMaybeHex !== menuContext.menuSelMaybeHex) {
            menuContext.menuSelMaybeHex = selMaybeHex;
            vscode.commands.executeCommand("setContext", "base85.selMaybeHex", menuContext.menuSelMaybeHex).then(() => {
                return menuContext.menuSelMaybeHex;
            });
        }
        if (selExactlyHex !== menuContext.menuSelExactlyHex) {
            menuContext.menuSelExactlyHex = selExactlyHex;
            vscode.commands.executeCommand("setContext", "base85.selExactlyHex", menuContext.menuSelExactlyHex).then(() => {
                return menuContext.menuSelExactlyHex;
            });
        }
        if (selMaybeB64 !== menuContext.menuSelMaybeB64) {
            menuContext.menuSelMaybeB64 = selMaybeB64;
            vscode.commands.executeCommand("setContext", "base85.selMaybeB64", menuContext.menuSelMaybeB64).then(() => {
                return menuContext.menuSelMaybeB64;
            });
        }
    }
}
menuContext.menuEncodeEnabled = true;
menuContext.menuDecoderEnabled = 'by Context';
menuContext.docIsB85 = false;
menuContext.menuSelMaybeHex = false;
menuContext.menuSelExactlyHex = false;
menuContext.menuSelMaybeB64 = false;
menuContext.menuCanDecode = false;
menuContext.menuCanEncode = false;
menuContext.menuSelExactly85 = false;
menuContext.menuBase64UrlMode = false;
exports.default = menuContext;
//# sourceMappingURL=menucontext.js.map