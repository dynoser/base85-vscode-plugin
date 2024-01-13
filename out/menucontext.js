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
                if (menuContext.menuDecoderEnabled === 'by Context' || menuContext.menuDecoderEnabled === "on <~...~>") {
                    let firstCh = sel_text.charAt(i);
                    // Is the selected text enclosed in quotation?
                    const inQuotas = (lastCh === firstCh) && ('`\'"'.indexOf(firstCh) >= 0);
                    if (inQuotas) {
                        i++;
                        firstCh = sel_text.charAt(i);
                        lastCh = sel_text.charAt(i + strlen - 1);
                        strlen--;
                    }
                    const firstTilda = sel_text.indexOf('~', i);
                    if (firstTilda === i + 1 && firstCh === '<') {
                        canDecode = true;
                        canEncode = false;
                    }
                    else {
                        if (menuContext.menuDecoderEnabled === "on <~...~>") {
                            canDecode = false;
                        }
                        else {
                            // by Context:
                            let eol = sel_text.indexOf("\n", i);
                            if (eol > i && eol < i + strlen) {
                                strlen = (eol - i);
                            }
                            while (strlen) {
                                lastCh = sel_text[i + strlen - 1];
                                if (spcs.indexOf(lastCh) < 0)
                                    break;
                                strlen--;
                            }
                            if (strlen > 1) {
                                canDecode = /^[!-zЯЖДПЦЩщжфцЭяюдБГэъЪФИЮШшлйЛ\\s\\r\\n]*$/u.test(sel_text.substring(i, i + strlen));
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
        if (!menuContext.menuEncoderEnabled) {
            canEncode = false;
        }
        if (canEncode !== menuContext.menuCanEncode) {
            menuContext.menuCanEncode = canEncode;
            vscode.commands.executeCommand("setContext", "base85.canEncode", menuContext.menuCanEncode).then(() => {
                return menuContext.menuCanEncode;
            });
        }
    }
}
menuContext.menuEncoderEnabled = true;
menuContext.menuDecoderEnabled = 'by Context';
menuContext.docIsB85 = false;
menuContext.menuCanDecode = false;
menuContext.menuCanEncode = false;
exports.default = menuContext;
//# sourceMappingURL=menucontext.js.map