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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initConfig = exports.reloadConfig = void 0;
const vscode = __importStar(require("vscode"));
const vc85_1 = __importDefault(require("./vc85"));
const menucontext_1 = __importDefault(require("./menucontext"));
function reloadConfig(event = null) {
    const extname = 'base85';
    const config = vscode.workspace.getConfiguration(extname);
    const splitWidth = config.get('splitWidth');
    const addPf = config.get('addPrefixes');
    const encodeModeStr = config.get('encodeMode');
    const menuEncodeEnable = config.get('menuEncodeEnable');
    const menuDecoder = config.get('menuDecoder');
    const urlModeBase64 = config.get('urlModeBase64');
    if (splitWidth !== undefined && splitWidth !== vc85_1.default.splitWidth) {
        vc85_1.default.splitWidth = splitWidth;
    }
    if (addPf !== undefined && addPf !== vc85_1.default.addPf) {
        vc85_1.default.addPf = addPf;
    }
    if (encodeModeStr !== undefined) {
        let encodeModeNum = 0;
        if (encodeModeStr === "ascii85 (classic)") {
            encodeModeNum = 1;
        }
        else if (encodeModeStr === "vwx (ascii85 + vwx)") {
            encodeModeNum = 2;
        }
        else if (encodeModeStr === "vc85 (ascii85 + vwx + vc85)") {
            encodeModeNum = 3;
        }
        else {
            vscode.window.showErrorMessage('Unknown encodeMode option value');
        }
        if (encodeModeNum !== vc85_1.default.currentEncodeMode) {
            vc85_1.default.init(encodeModeNum);
        }
    }
    if (menuEncodeEnable !== undefined && menuEncodeEnable !== menucontext_1.default.menuEncodeEnabled) {
        menucontext_1.default.menuEncodeEnabled = menuEncodeEnable;
    }
    if (menuDecoder !== undefined && menuDecoder !== menucontext_1.default.menuDecoderEnabled) {
        menucontext_1.default.menuDecoderEnabled = menuDecoder;
    }
    if (urlModeBase64 !== undefined && urlModeBase64 !== menucontext_1.default.menuBase64UrlMode) {
        menucontext_1.default.menuBase64UrlMode = urlModeBase64;
    }
}
exports.reloadConfig = reloadConfig;
function initConfig() {
    reloadConfig();
    // Auto-update config on changes
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('base85')) {
            reloadConfig(event);
        }
    });
}
exports.initConfig = initConfig;
//# sourceMappingURL=extconfig.js.map