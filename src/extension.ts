import * as vscode from 'vscode';
import vc85 from './vc85';
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
        vscode.commands.registerCommand('base85.decode', cre_sel_conv_fn(SELECTIONfromVC85))
    );

    vscode.window.onDidChangeTextEditorSelection(menucontext.onSelectionChange);

    // const menuCanEncode = true;
    // vscode.commands.executeCommand("setContext", "base85.canEncode", menuCanEncode).then(() => {
    //     return menuCanEncode;
    // });
//    vscode.languages.registerHoverProvider('base85', hoverlook.hoverProvider);
}

export function deactivate() { }


export function SELECTIONtoVC85(sel_text: string): string | null {
    return textToVC85(sel_text);
}

export function textToVC85(sel_text: string): string | null {
    try {
        const vc85encoded = vc85.encode(sel_text);
        return vc85encoded;
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed encode to vc85: ${e.message}`);
    }
    return null;
}

export function SELECTIONfromVC85(sel_text: string): string | null {
    return textFromVC85(sel_text);
}

export function textFromVC85(sel_text: string): string | null {
    try {
        vc85.init(3);
        const vc85decoded = vc85.decode(sel_text);
        return vc85decoded;
    } catch(e: any) {
        vscode.window.showErrorMessage(`Failed decode from vc85: ${e.message}`);
    }
    return null;
}

export function Base64ToHex(base64String: string): string {
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let hexString = '';

    for (let i = 0; i < base64String.length; i += 4) {
        const block = (
            (base64Chars.indexOf(base64String[i]) << 18) |
            (base64Chars.indexOf(base64String[i + 1]) << 12) |
            (base64Chars.indexOf(base64String[i + 2]) << 6) |
            (base64Chars.indexOf(base64String[i + 3]))
        );
        const validHexDigits = base64String[i + 2] === '=' ? 2 : base64String[i + 3] === '=' ? 4 : 6;

        for (let j = 0; j < validHexDigits; j++) {
            const hexDigit = (block >> (20 - j * 4)) & 0xF;
            hexString += hexDigit.toString(16);
        }
    }
    return hexString;
}


