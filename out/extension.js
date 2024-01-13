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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base64ToHex = exports.textFromVC85 = exports.SELECTIONfromVC85 = exports.textToVC85 = exports.SELECTIONtoVC85 = exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const vc85_1 = __importDefault(require("./vc85"));
const extconfig = __importStar(require("./extconfig"));
const menucontext_1 = __importDefault(require("./menucontext"));
// Create selection-converter function envelope for specified converter_fn
function cre_sel_conv_fn(converter_fn, targetLang = '') {
    return () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        // Multi-selections support
        const { document, selections } = editor;
        const selectedTexts = [];
        for (const selection of selections) {
            const sel_text = document.getText(selection);
            if (sel_text) {
                selectedTexts.push(sel_text);
            }
        }
        let combinedText = selectedTexts.join("\n");
        let wholeDocSel = combinedText.length < 1;
        let docIsSaved = !document.isDirty;
        if (wholeDocSel) {
            if (!targetLang) {
                vscode.window.showWarningMessage('No text selected!');
                return;
            }
            combinedText = document.getText();
        }
        const convertedText = converter_fn(combinedText);
        if (convertedText) {
            if (targetLang) {
                const newFile = yield vscode.workspace.openTextDocument({
                    content: convertedText,
                    language: targetLang,
                });
                vscode.window.showTextDocument(newFile);
            }
            else {
                editor.edit(editBuilder => {
                    editBuilder.replace(editor.selection, convertedText);
                }).then(() => {
                    // call a reaction to a change in the selection
                    menucontext_1.default.onSelectionChangeByEditor(editor);
                });
            }
        }
    });
}
function activate(context) {
    extconfig.initConfig();
    //Commands registration
    context.subscriptions.push(vscode.commands.registerCommand('base85.encode', cre_sel_conv_fn(SELECTIONtoVC85)));
    context.subscriptions.push(vscode.commands.registerCommand('base85.decode', cre_sel_conv_fn(SELECTIONfromVC85)));
    vscode.window.onDidChangeTextEditorSelection(menucontext_1.default.onSelectionChange);
    // const menuCanEncode = true;
    // vscode.commands.executeCommand("setContext", "base85.canEncode", menuCanEncode).then(() => {
    //     return menuCanEncode;
    // });
    //    vscode.languages.registerHoverProvider('base85', hoverlook.hoverProvider);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function SELECTIONtoVC85(sel_text) {
    return textToVC85(sel_text);
}
exports.SELECTIONtoVC85 = SELECTIONtoVC85;
function textToVC85(sel_text) {
    try {
        const vc85encoded = vc85_1.default.encode(sel_text);
        return vc85encoded;
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed encode to vc85: ${e.message}`);
    }
    return null;
}
exports.textToVC85 = textToVC85;
function SELECTIONfromVC85(sel_text) {
    return textFromVC85(sel_text);
}
exports.SELECTIONfromVC85 = SELECTIONfromVC85;
function textFromVC85(sel_text) {
    try {
        vc85_1.default.init(3);
        const vc85decoded = vc85_1.default.decode(sel_text);
        return vc85decoded;
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed decode from vc85: ${e.message}`);
    }
    return null;
}
exports.textFromVC85 = textFromVC85;
function Base64ToHex(base64String) {
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let hexString = '';
    for (let i = 0; i < base64String.length; i += 4) {
        const block = ((base64Chars.indexOf(base64String[i]) << 18) |
            (base64Chars.indexOf(base64String[i + 1]) << 12) |
            (base64Chars.indexOf(base64String[i + 2]) << 6) |
            (base64Chars.indexOf(base64String[i + 3])));
        const validHexDigits = base64String[i + 2] === '=' ? 2 : base64String[i + 3] === '=' ? 4 : 6;
        for (let j = 0; j < validHexDigits; j++) {
            const hexDigit = (block >> (20 - j * 4)) & 0xF;
            hexString += hexDigit.toString(16);
        }
    }
    return hexString;
}
exports.Base64ToHex = Base64ToHex;
//# sourceMappingURL=extension.js.map