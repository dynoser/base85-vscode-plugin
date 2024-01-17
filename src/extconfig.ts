import * as vscode from 'vscode';
import vc85 from './vc85';
import menuContext from './menucontext';
import base1664 from './base1664';

export function reloadConfig(event: vscode.ConfigurationChangeEvent | null = null) {
    const extname = 'base85';
    const config = vscode.workspace.getConfiguration(extname);

    const splitWidth = config.get<number>('splitWidth');
    const addPf = config.get<boolean>('addPrefixes');
    const encodeModeStr = config.get<string>('encodeMode');
    const menuEncodeEnable = config.get<boolean>('menuEncodeEnable');
    const menuDecoder = config.get<string>('menuDecoder');
    const urlModeBase64 = config.get<boolean>('urlModeBase64');

    if (splitWidth !== undefined && splitWidth !== vc85.splitWidth) {
        vc85.splitWidth = splitWidth;
    }

    if (addPf !== undefined && addPf !== vc85.addPf) {
        vc85.addPf = addPf;
    }

    if (encodeModeStr !== undefined) {
        let encodeModeNum: number = 0;
        if (encodeModeStr === "ascii85 (classic)") {
            encodeModeNum = 1;
        } else if (encodeModeStr === "vwx (ascii85 + vwx)") {
            encodeModeNum = 2;
        } else if (encodeModeStr === "vc85 (ascii85 + vwx + vc85)") {
            encodeModeNum = 3;
        } else {
            vscode.window.showErrorMessage('Unknown encodeMode option value');
        }
        if (encodeModeNum !== vc85.currentEncodeMode) {
            vc85.init(encodeModeNum);
        }
    }

    if (menuEncodeEnable !== undefined && menuEncodeEnable !== menuContext.menuEncodeEnabled) {
        menuContext.menuEncodeEnabled = menuEncodeEnable;
    }

    if (menuDecoder !== undefined && menuDecoder !== menuContext.menuDecoderEnabled) {
        menuContext.menuDecoderEnabled = menuDecoder;
    }

    if (urlModeBase64 !== undefined && urlModeBase64 !== menuContext.menuBase64UrlMode) {
        menuContext.menuBase64UrlMode = urlModeBase64;
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
