import * as vscode from 'vscode';

export default class menuContext {
    public static menuEncoderEnabled: boolean = true;
    public static menuDecoderEnabled: string = 'by Context';
    public static docIsB85: boolean = false;
    public static menuCanDecode: boolean = false;
    public static menuCanEncode: boolean = false;

    public static onSelectionChange(event: vscode.TextEditorSelectionChangeEvent)
    {
        return menuContext.onSelectionChangeByEditor(event.textEditor);
    }

    public static onSelectionChangeByEditor(textEditor: vscode.TextEditor) {
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
            while(strlen) {
                lastCh = sel_text[strlen-1];
                if (spcs.indexOf(lastCh) < 0) break;
                strlen--;
            }

            // reduce line by start-spaces
            let i = 0;
            while (i < strlen) {
                if (spcs.indexOf(sel_text[i]) < 0) break;
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
                    if (firstTilda === i+1 && firstCh === '<') {
                        canDecode = true;
                        canEncode = false;
                    } else {
                        if (menuContext.menuDecoderEnabled === "on <~...~>") {
                            canDecode = false;
                        } else {
                            // by Context:
                            let eol = sel_text.indexOf("\n", i);
                            if (eol > i && eol < i+strlen) {
                                strlen = (eol - i);
                            }
                            while(strlen) {
                                lastCh = sel_text[i+strlen-1];
                                if (spcs.indexOf(lastCh) < 0) break;
                                strlen--;
                            }
                            if (strlen > 1) {
                                canDecode = /^[!-zЯЖДПЦЩщжфцЭяюдБГэъЪФИЮШшлйЛ\\s\\r\\n]*$/u.test(sel_text.substring(i, i+strlen));
                            }
                        }
                    }
                } else if (menuContext.menuDecoderEnabled === 'Always') {
                    canDecode = true;
                } else {
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