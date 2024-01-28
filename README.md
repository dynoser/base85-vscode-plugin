# Encode/decode base85, Base64, Base128, HEX

## Convert data between base85, base64, base128 and hex formats.

 - [base85 (ASCII85) wiki specification](https://en.wikipedia.org/wiki/Ascii85)
 - [Base64 wiki specification](https://en.wikipedia.org/wiki/Base64)
 - [Base16 HEX specification](https://en.wikipedia.org/wiki/Hexadecimal)

## Features

 - Encode/decode base85 to text in editor (selection menu items):
   - `base85.encode` (menu item "Encode to base85", convert selection text to base85)
   - `base85.decode` (menu item "Decode from base85", convert selection from base85)
 - Commands for current selection converts:
   - `base85.base85ToHex`  -- from base85 to HEX
   - `base85.base85To64` -- from base85 to Base64
   - `base85.base64To85` -- from Base64 to base85
   - `base85.base64ToHex`  -- from Base64 to HEX
   - `base85.base64ToText` -- from Base64 to text
   - `base85.hexToBase85`  -- from HEX to base85
   - `base85.hexToBase64`  -- from HEX to Base64
   - `base85.hexToText`    -- HEX to text
   - `base85.textToBase64` -- from text to Base64
   - `base85.textToHex`    -- text to HEX
   - `base85.base85To128`  -- from base85 to Base128
   - `base85.base128To85`  -- from Base128 to base85
   - `base85.align85`      -- align symbols to vc85 charset

 - Base85 data-blocks highlighting by <~ ... ~> (when selected "base85" language)


You can find these menu items by right-clicking on the selection:

![Menu Encode85 / Decode85](https://raw.githubusercontent.com/dynoser/base85-vscode-plugin/main/images/base85menuse.gif)



# ASCII85

This is a standard ascii85 charset strictly from `!` to `u`. Regex: [!-u].

This charset is compatible with all ascii85-encoders/decoders.


# vwx85

vwx85-charset differs from ASCII85 only by replacing the following three characters:
 - `"` to `v`
 - `'` to `w`
 - `\` to `x`

This allows you to quote a string containing vwx85-encoded data without experiencing character conversion issues.

For decoding, if you want to use a decoder that does not support this substitutions, you must first change these three characters back and then use the standard ascii85-decoder.


# vc85

 - In vc85 charset all the symbols are visually different from each other.
 - All special characters (except for "_") are replaced with letters of the Cyrillic alphabet.
 - Thus, the vc85 understands two variants of characters: ascii85 and alternative.

Alternative symbols are listed in the table below in the second column, next to the ascii85 ones:

![base85 / vc85 charset table](https://raw.githubusercontent.com/dynoser/base85-vscode-plugin/main/images/vc85.png)
