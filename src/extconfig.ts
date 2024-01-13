import * as vscode from 'vscode';
import vc85 from './vc85';
import menuContext from './menucontext';

export function reloadConfig(event: vscode.ConfigurationChangeEvent | null = null) {
    const extname = 'base85';
    const config = vscode.workspace.getConfiguration(extname);

    const splitWidth = config.get<number>('splitWidth');
    const addPf = config.get<boolean>('addPrefixes');
    const encodeModeStr = config.get<string>('encodeMode');
    const menuEncoder = config.get<boolean>('menuEncoder');
    const menuDecoder = config.get<string>('menuDecoder');

    if (splitWidth !== undefined && splitWidth !== vc85.splitWidth) {
        vc85.splitWidth = splitWidth;
    }

    if (addPf !== undefined && addPf !== vc85.addPf) {
        vc85.addPf = addPf;
    }

    if (encodeModeStr !== undefined) {
        let encodeModeNum: number = 3;
        if (encodeModeStr === "ascii85 (classic)") {
            encodeModeNum = 1;
        } else if (encodeModeStr === "vwx (ascii85 + vwx)") {
            encodeModeNum = 2;
        }
        if (encodeModeNum !== vc85.defaultEncodeMode) {
            vc85.defaultEncodeMode = encodeModeNum;
            vc85.init(encodeModeNum);
        }
    }

    if (menuEncoder !== undefined && menuEncoder !== menuContext.menuEncoderEnabled) {
        menuContext.menuEncoderEnabled = menuEncoder;
    }

    if (menuDecoder !== undefined && menuDecoder !== menuContext.menuDecoderEnabled) {
        menuContext.menuDecoderEnabled = menuDecoder;
    }
}

export function initConfig(): void {
    reloadConfig();
    // Auto-update config on changes
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('base85')) {
            reloadConfig(event);
        }
    });
}
