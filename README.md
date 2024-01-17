# Encode/decode base85, Base64, HEX

## Convert data between base85, base64 and hex formats.

 - [base85 (ASCII85) wiki specification](https://en.wikipedia.org/wiki/Ascii85)
 - [Base64 wiki specification](https://en.wikipedia.org/wiki/Base64)
 - [Base16 HEX specification](https://en.wikipedia.org/wiki/Hexadecimal)

## Features

 - Encode/decode base85 to text in editor (selection menu items):
   - `base85.encode` (menu item "Encode to base85", convert selection text to base85)
   - `base85.decode` (menu item "Decode from base85", convert selection from base85)
 - Commands for current selection converts:
   - `base85.base85ToHex`  -- from base85 to HEX
   - `base85.base85ToBase64` -- from base85 to Base64
   - `base85.base64ToBase85` -- from Base64 to base85
   - `base85.base64ToHex`  -- from Base64 to HEX
   - `base85.base64ToText` -- from Base64 to text
   - `base85.hexToBase85`  -- from HEX to base85
   - `base85.hexToBase64`  -- from HEX to Base64
   - `base85.hexToText`    -- HEX to text
   - `base85.textToBase64` -- from text to Base64
   - `base85.textToHex`    -- text to HEX
 - Base85 data-blocks highlighting by <~ ... ~> (when selected "base85" language)


You can find these menu items by right-clicking on the selection:

![Menu Encode85 / Decode85](https://raw.githubusercontent.com/dynoser/base85-vscode-plugin/main/images/base85menuse.gif)
