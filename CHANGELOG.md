# Change Log

All notable changes to the "base85" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.7]

### Added
 - charset converting for base85
 - Commands: toASCII85, toVWX85, toVC85
 - base128 support
 - Commands: base64To128, base128To64, base128To85, base85to128

### Changed
 - base64To85 (old version: base64ToBase85)
 - base85To64 (old vession: base85ToBase64)

## [1.0.6]

### Fixed

 - fix for web version (vscode.dev) -- btoa function call removed

## [1.0.5]

### Added

 - Commands: base85ToBase64, base64ToBase85, hexToBase85
 - Config option "Base64 encoder will use URL mode" instead of hexToBase64url and textToBase64url

### Removed

 - Commands: hexToBase64url and textToBase64url

## [1.0.4]

### Added

 - Spaces allowed in base64 encode

### Fixed

 - fix for web version (vscode.dev)


## [1.0.3]

### Added

 - Commands: textToBase64, textToBase64url, base64ToText, textToHex, hexToText, hexToBase64, hexToBase64url, base64ToHex
 - Menu (context depending) commands


## [1.0.2]

### Fixed

 - fix encodeMode setting-change alg

### Added

 - windows-cp1251 codepage support to vc85 (not used in VsCode, needed for charmap standardization)
 - to README.md added gif animation about using encode / decode menu items


## [1.0.1]

- Initial release