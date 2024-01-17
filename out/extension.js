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
exports.base85ToBase64 = exports.SELECTIONBase85toBase64 = exports.base85ToHex = exports.SELECTIONBase85toHex = exports.hexToBase85 = exports.SELECTIONhexToBase85 = exports.base64ToBase85 = exports.SELECTIONBase64toBase85 = exports.base64ToHex = exports.SELECTIONBase64toHex = exports.hexToBase64 = exports.SELECTIONhexToBase64 = exports.textFromHex = exports.SELECTIONfromHEX = exports.textToHex = exports.SELECTIONtoHEX = exports.base64ToText = exports.SELECTIONfromBase64 = exports.textToBase64url = exports.SELECTIONtoBase64url = exports.textToBase64 = exports.SELECTIONtoBase64 = exports.textFromVC85 = exports.SELECTIONfromBase85 = exports.textToBase85 = exports.SELECTIONtoVC85 = exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const vc85_1 = __importDefault(require("./vc85"));
const base1664_1 = __importDefault(require("./base1664"));
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
            const len = sel_text.length;
            if (len) {
                selectedTexts.push(sel_text);
            }
        }
        let combinedText = selectedTexts.join("\n");
        const emptySelection = combinedText.length < 1;
        //const docIsSaved = !document.isDirty;
        if (emptySelection) {
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
    context.subscriptions.push(vscode.commands.registerCommand('base85.decode', cre_sel_conv_fn(SELECTIONfromBase85)));
    context.subscriptions.push(vscode.commands.registerCommand('base85.textToBase64', cre_sel_conv_fn(SELECTIONtoBase64)));
    // context.subscriptions.push(
    //     vscode.commands.registerCommand('base85.textToBase64url', cre_sel_conv_fn(SELECTIONtoBase64url))
    // );
    context.subscriptions.push(vscode.commands.registerCommand('base85.base64ToText', cre_sel_conv_fn(SELECTIONfromBase64)));
    context.subscriptions.push(vscode.commands.registerCommand('base85.hexToText', cre_sel_conv_fn(SELECTIONfromHEX)));
    context.subscriptions.push(vscode.commands.registerCommand('base85.textToHex', cre_sel_conv_fn(SELECTIONtoHEX)));
    context.subscriptions.push(vscode.commands.registerCommand('base85.hexToBase64', cre_sel_conv_fn(SELECTIONhexToBase64)));
    // context.subscriptions.push(
    //     vscode.commands.registerCommand('base85.hexToBase64std', cre_sel_conv_fn(SELECTIONhexToBase64std))
    // );
    // context.subscriptions.push(
    //     vscode.commands.registerCommand('base85.hexToBase64url', cre_sel_conv_fn(SELECTIONhexToBase64url))
    // );
    context.subscriptions.push(vscode.commands.registerCommand('base85.base64ToHex', cre_sel_conv_fn(SELECTIONBase64toHex)));
    context.subscriptions.push(vscode.commands.registerCommand('base85.base64ToBase85', cre_sel_conv_fn(SELECTIONBase64toBase85)));
    context.subscriptions.push(vscode.commands.registerCommand('base85.hexToBase85', cre_sel_conv_fn(SELECTIONhexToBase85)));
    context.subscriptions.push(vscode.commands.registerCommand('base85.base85ToHex', cre_sel_conv_fn(SELECTIONBase85toHex)));
    context.subscriptions.push(vscode.commands.registerCommand('base85.base85ToBase64', cre_sel_conv_fn(SELECTIONBase85toBase64)));
    vscode.window.onDidChangeTextEditorSelection(menucontext_1.default.onSelectionChange);
    //    vscode.languages.registerHoverProvider('base85', hoverlook.hoverProvider);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function SELECTIONtoVC85(sel_text) {
    return textToBase85(sel_text);
}
exports.SELECTIONtoVC85 = SELECTIONtoVC85;
function textToBase85(sel_text) {
    try {
        const vc85encoded = vc85_1.default.encode(sel_text);
        return vc85encoded;
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed encode to vc85: ${e.message}`);
    }
    return null;
}
exports.textToBase85 = textToBase85;
function SELECTIONfromBase85(sel_text) {
    return textFromVC85(sel_text);
}
exports.SELECTIONfromBase85 = SELECTIONfromBase85;
function textFromVC85(sel_text) {
    try {
        const vc85decoded = vc85_1.default.decode(sel_text);
        return vc85decoded;
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed decode from vc85: ${e.message}`);
    }
    return null;
}
exports.textFromVC85 = textFromVC85;
function SELECTIONtoBase64(sel_text) {
    return textToBase64(sel_text);
}
exports.SELECTIONtoBase64 = SELECTIONtoBase64;
function textToBase64(sel_text) {
    try {
        return base1664_1.default.textUTF8toBase64(sel_text, menucontext_1.default.menuBase64UrlMode);
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed encode text to base64: ${e.message}`);
    }
    return null;
}
exports.textToBase64 = textToBase64;
function SELECTIONtoBase64url(sel_text) {
    return textToBase64url(sel_text);
}
exports.SELECTIONtoBase64url = SELECTIONtoBase64url;
function textToBase64url(sel_text) {
    try {
        return base1664_1.default.textUTF8toBase64(sel_text, true);
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed encode text to base64url: ${e.message}`);
    }
    return null;
}
exports.textToBase64url = textToBase64url;
function SELECTIONfromBase64(sel_text) {
    return base64ToText(sel_text);
}
exports.SELECTIONfromBase64 = SELECTIONfromBase64;
function base64ToText(sel_text) {
    try {
        return base1664_1.default.base64toTextUTF8(sel_text);
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed decode text from base64 or base64url: ${e.message}`);
    }
    return null;
}
exports.base64ToText = base64ToText;
function SELECTIONtoHEX(sel_text) {
    return textToHex(sel_text);
}
exports.SELECTIONtoHEX = SELECTIONtoHEX;
function textToHex(sel_text) {
    try {
        const b64 = base1664_1.default.textUTF8toBase64(sel_text);
        return base1664_1.default.base64ToHex(b64);
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed encode text to HEX: ${e.message}`);
    }
    return null;
}
exports.textToHex = textToHex;
function SELECTIONfromHEX(sel_text) {
    return textFromHex(sel_text);
}
exports.SELECTIONfromHEX = SELECTIONfromHEX;
function textFromHex(sel_text) {
    try {
        const uint8Arr = base1664_1.default.hexToUint8Arr(sel_text);
        return base1664_1.default.Uint8ArrToTextUTF8(uint8Arr);
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed decode text from HEX: ${e.message}`);
    }
    return null;
}
exports.textFromHex = textFromHex;
function SELECTIONhexToBase64(sel_text) {
    return hexToBase64(sel_text);
}
exports.SELECTIONhexToBase64 = SELECTIONhexToBase64;
function hexToBase64(sel_text) {
    try {
        return base1664_1.default.hexToBase64(sel_text, menucontext_1.default.menuBase64UrlMode);
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed convert hex to base64: ${e.message}`);
    }
    return null;
}
exports.hexToBase64 = hexToBase64;
function SELECTIONBase64toHex(sel_text) {
    return base64ToHex(sel_text);
}
exports.SELECTIONBase64toHex = SELECTIONBase64toHex;
function base64ToHex(sel_text) {
    try {
        return base1664_1.default.base64ToHex(sel_text);
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed convert base64 to hex: ${e.message}`);
    }
    return null;
}
exports.base64ToHex = base64ToHex;
function SELECTIONBase64toBase85(sel_text) {
    return base64ToBase85(sel_text);
}
exports.SELECTIONBase64toBase85 = SELECTIONBase64toBase85;
function base64ToBase85(sel_text) {
    try {
        const hexStr = base1664_1.default.base64ToHex(sel_text);
        if (typeof hexStr === 'string') {
            const Uint8Arr = base1664_1.default.hexToUint8Arr(hexStr);
            return vc85_1.default.encodeUint8Arr(new Uint8Array(Uint8Arr));
        }
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed convert base64 to hex: ${e.message}`);
    }
    return null;
}
exports.base64ToBase85 = base64ToBase85;
function SELECTIONhexToBase85(sel_text) {
    return hexToBase85(sel_text);
}
exports.SELECTIONhexToBase85 = SELECTIONhexToBase85;
function hexToBase85(sel_text) {
    try {
        const Uint8Arr = base1664_1.default.hexToUint8Arr(sel_text);
        return vc85_1.default.encodeUint8Arr(new Uint8Array(Uint8Arr));
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed convert hex to base85: ${e.message}`);
    }
    return null;
}
exports.hexToBase85 = hexToBase85;
function SELECTIONBase85toHex(sel_text) {
    return base85ToHex(sel_text);
}
exports.SELECTIONBase85toHex = SELECTIONBase85toHex;
function base85ToHex(sel_text) {
    try {
        const Uint8Arr = vc85_1.default.decodeToUint8Arr(sel_text);
        const b64 = base1664_1.default.Uint8ArrToBase64(Uint8Arr);
        return base1664_1.default.base64ToHex(b64);
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed convert base85 to hex: ${e.message}`);
    }
    return null;
}
exports.base85ToHex = base85ToHex;
function SELECTIONBase85toBase64(sel_text) {
    return base85ToBase64(sel_text);
}
exports.SELECTIONBase85toBase64 = SELECTIONBase85toBase64;
function base85ToBase64(sel_text) {
    try {
        const Uint8Arr = vc85_1.default.decodeToUint8Arr(sel_text);
        const b64 = base1664_1.default.Uint8ArrToBase64(Uint8Arr);
        return b64;
    }
    catch (e) {
        vscode.window.showErrorMessage(`Failed convert base85 to base64: ${e.message}`);
    }
    return null;
}
exports.base85ToBase64 = base85ToBase64;
//# sourceMappingURL=extension.js.map