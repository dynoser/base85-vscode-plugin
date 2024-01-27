import * as vscode from 'vscode';
import vc85 from './vc85';
import vc128 from './vc128';
import base1664 from './base1664';
import * as extconfig from './extconfig';
import menucontext from './menucontext';

// Create selection-converter function envelope for specified converter_fn
function cre_sel_conv_fn(converter_fn: (text: string) => string | null, targetLang: string = '') {
    return async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        
        // Multi-selections support
        const { document, selections } = editor;
        const selectedTexts: string[] = [];
        
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
                const newFile = await vscode.workspace.openTextDocument({
                    content: convertedText,
                    language: targetLang,
                });
                vscode.window.showTextDocument(newFile);
            } else {
                editor.edit(editBuilder => {
                    editBuilder.replace(editor.selection, convertedText);
                }).then(() => {
                    // call a reaction to a change in the selection
                    menucontext.onSelectionChangeByEditor(editor);
                });
            }
        }
    };
}

export function activate(context: vscode.ExtensionContext) {
    extconfig.initConfig();
    //Commands registration
    context.subscriptions.push(
        vscode.commands.registerCommand('base85.encode', cre_sel_conv_fn(SELECTIONtoVC85))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('base85.decode', cre_sel_conv_fn(SELECTIONfromBase85))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('base85.textToBase64', cre_sel_conv_fn(SELECTIONtoBase64))
    );
    // context.subscriptions.push(
    //     vscode.commands.registerCommand('base85.textToBase64url', cre_sel_conv_fn(SELECTIONtoBase64url))
    // );
    context.subscriptions.push(
        vscode.commands.registerCommand('base85.base64ToText', cre_sel_conv_fn(SELECTIONfromBase64))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('base85.hexToText', cre_sel_conv_fn(SELECTIONfromHEX))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('base85.textToHex', cre_sel_conv_fn(SELECTIONtoHEX))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('base85.hexToBase64', cre_sel_conv_fn(SELECTIONhexToBase64))
    );

    // convert from base85-any-mode to base85-specified-mode
    context.subscriptions.push(
         vscode.commands.registerCommand('base85.toASCII85', cre_sel_conv_fn(SELECTIONbase85toASCII85))
    );
    context.subscriptions.push(
         vscode.commands.registerCommand('base85.toVWX85', cre_sel_conv_fn(SELECTIONbase85toVWX))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('base85.toVC85', cre_sel_conv_fn(SELECTIONbase85toVC85))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('base85.toDefault', cre_sel_conv_fn(SELECTIONbase85toDefault))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('base85.base64ToHex', cre_sel_conv_fn(SELECTIONBase64toHex))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('base85.base64To85', cre_sel_conv_fn(SELECTIONBase64toBase85))
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('base85.hexToBase85', cre_sel_conv_fn(SELECTIONhexToBase85))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('base85.base85ToHex', cre_sel_conv_fn(SELECTIONBase85toHex))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('base85.base85To64', cre_sel_conv_fn(SELECTIONBase85toBase64))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('base85.base64To128', cre_sel_conv_fn(SELECTIONBase64toBase128))
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('base85.base128To64', cre_sel_conv_fn(SELECTIONBase128toBase64))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('base85.base128To85', cre_sel_conv_fn(SELECTIONBase128toBase85))
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('base85.base85To128', cre_sel_conv_fn(SELECTIONBase85toBase128))
    );

    vscode.window.onDidChangeTextEditorSelection(menucontext.onSelectionChange);

//    vscode.languages.registerHoverProvider('base85', hoverlook.hoverProvider);
}

export function deactivate() { }

export function SELECTIONbase85toVC85(sel_text: string): string | null {
    return base85Convert(sel_text, 3);
}
export function SELECTIONbase85toVWX(sel_text: string): string | null {
    return base85Convert(sel_text, 2);
}
export function SELECTIONbase85toASCII85(sel_text: string): string | null {
    return base85Convert(sel_text, 1);
}
export function SELECTIONbase85toDefault(sel_text: string): string | null {
    return base85Convert(sel_text, 0);
}

export function base85Convert(sel_text: string, toMode: number = 0) {
    return vc85.convert(sel_text, toMode);
}

export function SELECTIONtoVC85(sel_text: string): string | null {
    return textToBase85(sel_text);
}

export function textToBase85(sel_text: string): string | null {
    try {
        const vc85encoded = vc85.encode(sel_text);
        return vc85encoded;
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed encode to vc85: ${e.message}`);
    }
    return null;
}

export function SELECTIONfromBase85(sel_text: string): string | null {
    return textFromVC85(sel_text);
}

export function textFromVC85(sel_text: string): string | null {
    try {
        const vc85decoded = vc85.decode(sel_text);
        return vc85decoded;
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed decode from vc85: ${e.message}`);
    }
    return null;
}

export function SELECTIONtoBase64(sel_text: string): string | null {
    return textToBase64(sel_text);
}

export function textToBase64(sel_text: string): string | null {
    try {
        return base1664.textUTF8toBase64(sel_text, menucontext.menuBase64UrlMode);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed encode text to base64: ${e.message}`);
    }
    return null;
}

export function SELECTIONtoBase64url(sel_text: string): string | null {
    return textToBase64url(sel_text);
}

export function textToBase64url(sel_text: string): string | null {
    try {
        return base1664.textUTF8toBase64(sel_text, true);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed encode text to base64url: ${e.message}`);
    }
    return null;
}

export function SELECTIONfromBase64(sel_text: string): string | null {
    return base64ToText(sel_text);
}

export function base64ToText(sel_text: string): string | null {
    try {
        return base1664.base64toTextUTF8(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed decode text from base64 or base64url: ${e.message}`);
    }
    return null;
}

export function SELECTIONtoHEX(sel_text: string): string | null {
    return textToHex(sel_text);
}

export function textToHex(sel_text: string): string | null {
    try {
        const b64 = base1664.textUTF8toBase64(sel_text);
        return base1664.base64ToHex(b64);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed encode text to HEX: ${e.message}`);
    }
    return null;
}

export function SELECTIONfromHEX(sel_text: string): string | null {
    return textFromHex(sel_text);
}

export function textFromHex(sel_text: string): string | null {
    try {
        const uint8Arr = base1664.hexToUint8Arr(sel_text);
        return base1664.Uint8ArrToTextUTF8(uint8Arr);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed decode text from HEX: ${e.message}`);
    }
    return null;
}

export function SELECTIONhexToBase64(sel_text: string): string | null {
    return hexToBase64(sel_text);
}

export function hexToBase64(sel_text: string): string | null {
    try {
        return base1664.hexToBase64(sel_text, menucontext.menuBase64UrlMode);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed convert hex to base64: ${e.message}`);
    }
    return null;
}

export function SELECTIONBase64toHex(sel_text: string): string | null {
    return base64ToHex(sel_text);
}

export function base64ToHex(sel_text: string): string | null {
    try {
        return base1664.base64ToHex(sel_text);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed convert base64 to hex: ${e.message}`);
    }
    return null;
}

export function SELECTIONBase64toBase85(sel_text: string): string | null {
    return base64ToBase85(sel_text);
}

export function base64ToBase85(sel_text: string): string | null {
    try {
        const hexStr = base1664.base64ToHex(sel_text);
        if (typeof hexStr === 'string') {
            const Uint8Arr = base1664.hexToUint8Arr(hexStr);
            return vc85.encodeUint8Arr(new Uint8Array(Uint8Arr));
        }
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed convert base64 to hex: ${e.message}`);
    }
    return null;
}

export function SELECTIONhexToBase85(sel_text: string): string | null {
    return hexToBase85(sel_text);
}

export function hexToBase85(sel_text: string): string | null {
    try {
        const Uint8Arr = base1664.hexToUint8Arr(sel_text);
        return vc85.encodeUint8Arr(new Uint8Array(Uint8Arr));
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed convert hex to base85: ${e.message}`);
    }
    return null;
}

export function SELECTIONBase85toHex(sel_text: string): string | null {
    return base85ToHex(sel_text);
}

export function base85ToHex(sel_text: string): string | null {
    try {
        const Uint8Arr = vc85.decodeToUint8Arr(sel_text);        
        const b64 = base1664.Uint8ArrToBase64(Uint8Arr);
        return base1664.base64ToHex(b64);
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed convert base85 to hex: ${e.message}`);
    }
    return null;
}


export function SELECTIONBase85toBase64(sel_text: string): string | null {
    return base85ToBase64(sel_text);
}

export function base85ToBase64(sel_text: string): string | null {
    try {
        const Uint8Arr = vc85.decodeToUint8Arr(sel_text);        
        const b64 = base1664.Uint8ArrToBase64(Uint8Arr);
        return b64;
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed convert base85 to base64: ${e.message}`);
    }
    return null;
}

export function SELECTIONBase128toBase64(sel_text: string): string | null {
    return base128ToBase64(sel_text);
}

export function base128ToBase64(sel_text: string): string | null {
    try {
        const Uint8Arr = vc128.decodeToUint8Arr(sel_text);        
        const b64 = base1664.Uint8ArrToBase64(Uint8Arr);
        return b64;
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed convert base128 to base64: ${e.message}`);
    }
    return null;
}


export function SELECTIONBase64toBase128(sel_text: string): string | null {
    return base64ToBase128(sel_text);
}

export function base64ToBase128(sel_text: string): string | null {
    try {
        const hexStr = base1664.base64ToHex(sel_text);
        if (typeof hexStr === 'string') {
            const Uint8Arr = base1664.hexToUint8Arr(hexStr);
            return vc128.encodeUint8Arr(new Uint8Array(Uint8Arr));
        }
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed convert base64 to hex: ${e.message}`);
    }
    return null;
}

export function SELECTIONBase128toBase85(sel_text: string): string | null {
    return base128ToBase85(sel_text);
}

export function base128ToBase85(sel_text: string): string | null {
    try {
        const Uint8Arr = vc128.decodeToUint8Arr(sel_text);
        return vc85.encodeUint8Arr(new Uint8Array(Uint8Arr));
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed convert base128 to base64: ${e.message}`);
    }
    return null;
}

export function SELECTIONBase85toBase128(sel_text: string): string | null {
    return base85ToBase128(sel_text);
}

export function base85ToBase128(sel_text: string): string | null {
    try {
        const Uint8Arr = vc85.decodeToUint8Arr(sel_text);
        return vc128.encodeUint8Arr(new Uint8Array(Uint8Arr));
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed convert base128 to base64: ${e.message}`);
    }
    return null;
}
