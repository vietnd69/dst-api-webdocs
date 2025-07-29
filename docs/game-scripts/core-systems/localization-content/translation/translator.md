---
id: translator
title: Translator
description: Localization and translation system for managing multi-language support in Don't Starve Together
sidebar_position: 1
slug: game-scripts/core-systems/translator
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Translator

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `Translator` class provides the localization and translation system for Don't Starve Together. It manages loading and processing of PO (Portable Object) files for multiple languages, handles string translation lookups, and provides utilities for converting escape characters. The system supports both legacy and modern PO file formats with msgctxt support.

## Usage Example

```lua
-- Access the global translator instance
local translated = LanguageTranslator:GetTranslatedString("STRINGS.UI.MAINSCREEN.PLAY")

-- Load a new language file
LanguageTranslator:LoadPOFile("data/languages/french.po", "fr")

-- Get translation in specific language
local french_text = LanguageTranslator:GetTranslatedString("STRINGS.UI.MAINSCREEN.PLAY", "fr")
```

## Class Definition

### Translator() {#translator-constructor}

**Status:** `stable`

**Description:** Creates a new Translator instance with empty language storage and configuration options.

**Constructor Properties:**
- `languages` (table): Storage for loaded language translations
- `defaultlang` (string): Default language identifier
- `use_longest_locs` (boolean): Flag to use longest available translations

**Example:**
```lua
local my_translator = Translator()
my_translator:LoadPOFile("custom_strings.po", "en")
```

## Instance Methods

### UseLongestLocs(to) {#use-longest-locs}

**Status:** `stable`

**Description:** Configures the translator to use the longest available translation string when multiple languages provide translations for the same string ID.

**Parameters:**
- `to` (boolean): Whether to enable longest localization mode

**Example:**
```lua
LanguageTranslator:UseLongestLocs(true)
-- Now GetLongestTranslatedString() will be used for translations
```

### LoadPOFile(fname, lang) {#load-po-file}

**Status:** `stable`

**Description:** Loads and parses a PO (Portable Object) translation file for the specified language. Supports both legacy format (using reference fields) and modern format (using msgctxt fields).

**Parameters:**
- `fname` (string): File path to the PO file to load
- `lang` (string): Language identifier to associate with the loaded translations

**File Format Support:**
- **Legacy Format**: Uses `#:` reference fields for string IDs
- **Modern Format**: Uses `msgctxt` fields for string paths (POT Version 2.0)

**Example:**
```lua
-- Load French translations
LanguageTranslator:LoadPOFile("data/languages/french.po", "fr")

-- Load Chinese translations
LanguageTranslator:LoadPOFile("data/languages/chinese_s.po", "zh")
```

### GetTranslatedString(strid, lang) {#get-translated-string}

**Status:** `stable`

**Description:** Retrieves the translated string for the given string ID in the specified language. Falls back to default language if no specific language is provided.

**Parameters:**
- `strid` (string): String identifier path (e.g., "STRINGS.UI.MAINSCREEN.PLAY")
- `lang` (string, optional): Language code to get translation for

**Returns:**
- (string|nil): Translated string if found, nil if no translation available

**Example:**
```lua
-- Get translation in default language
local play_text = LanguageTranslator:GetTranslatedString("STRINGS.UI.MAINSCREEN.PLAY")

-- Get translation in specific language
local french_play = LanguageTranslator:GetTranslatedString("STRINGS.UI.MAINSCREEN.PLAY", "fr")

if french_play then
    print("French translation:", french_play)
else
    print("No French translation available")
end
```

### GetLongestTranslatedString(strid) {#get-longest-translated-string}

**Status:** `stable`

**Description:** Searches all loaded languages for the given string ID and returns the longest available translation. Useful for UI layout testing and ensuring adequate space allocation.

**Parameters:**
- `strid` (string): String identifier path to search for

**Returns:**
- (string|nil): Longest available translation or nil if no translations found

**Example:**
```lua
-- Get the longest translation across all languages for UI sizing
local longest_title = LanguageTranslator:GetLongestTranslatedString("STRINGS.UI.MAINSCREEN.TITLE")

-- Use for UI element sizing calculations
local button_width = math.max(200, string.len(longest_title) * 8)
```

### ConvertEscapeCharactersToString(str) {#convert-escape-to-string}

**Status:** `stable`

**Description:** Converts raw characters to escaped string format for PO file output. Transforms newlines, carriage returns, quotes, and backslashes to their escaped representations.

**Parameters:**
- `str` (string): Raw string to convert

**Returns:**
- (string): String with escape sequences

**Conversions:**
- `\n` → `\\n`
- `\r` → `\\r`
- `"` → `\\\"`
- `\\` → `\\\\`

**Example:**
```lua
local raw_text = "Hello\nWorld \"Quote\""
local escaped = LanguageTranslator:ConvertEscapeCharactersToString(raw_text)
print(escaped) -- "Hello\\nWorld \\\"Quote\\\""
```

### ConvertEscapeCharactersToRaw(str) {#convert-escape-to-raw}

**Status:** `stable`

**Description:** Converts escaped string format back to raw characters for display. Reverses the escape character conversion process.

**Parameters:**
- `str` (string): Escaped string to convert

**Returns:**
- (string): Raw string with actual characters

**Conversions:**
- `\\n` → `\n`
- `\\r` → `\r`
- `\\\"` → `"`
- `\\\\` → `\\`

**Example:**
```lua
local escaped_text = "Hello\\nWorld \\\"Quote\\\""
local raw = LanguageTranslator:ConvertEscapeCharactersToRaw(escaped_text)
print(raw) -- "Hello\nWorld \"Quote\""
```

## Global Functions

### TranslateStringTable(tbl) {#translate-string-table}

**Status:** `stable`

**Description:** Recursively processes the STRINGS table structure and replaces string values with their translations using the global LanguageTranslator instance. Called automatically by the strings.lua system.

**Parameters:**
- `tbl` (table): Table structure to translate (typically the STRINGS table)

**Behavior:**
- Recursively traverses table hierarchy
- Builds string paths like "STRINGS.UI.MAINSCREEN.PLAY"
- Replaces values with translations when available
- Uses longest translations if `use_longest_locs` is enabled

**Example:**
```lua
-- This is typically called automatically by the game
STRINGS = {
    UI = {
        MAINSCREEN = {
            PLAY = "Play Game"
        }
    }
}

TranslateStringTable(STRINGS)
-- STRINGS.UI.MAINSCREEN.PLAY now contains translated text if available
```

## Global Instance

### LanguageTranslator

**Type:** `Translator`

**Status:** `stable`

**Description:** Global singleton instance of the Translator class used throughout the game for all localization operations.

**Example:**
```lua
-- Access global translator
LanguageTranslator:LoadPOFile("my_mod_strings.po", "en")
local translated = LanguageTranslator:GetTranslatedString("MOD.STRINGS.ITEM_NAME")
```

## PO File Format Support

### Legacy Format Detection
The translator automatically detects legacy PO files and processes them using reference field parsing:

```po
#: STRINGS.UI.MAINSCREEN.PLAY
msgid "Play Game"
msgstr "Jouer"
```

### Modern Format Detection
Modern PO files are detected by version headers and use msgctxt fields:

```po
# POT Version: 2.0
msgctxt "STRINGS.UI.MAINSCREEN.PLAY"
msgid "Play Game"
msgstr "Jouer"
```

### Multi-line String Support
Both formats support multi-line strings that are automatically joined:

```po
msgctxt "STRINGS.LONG_TEXT"
msgid ""
"This is a very long string "
"that spans multiple lines"
msgstr ""
"Ceci est une très longue chaîne "
"qui s'étend sur plusieurs lignes"
```

## Common Usage Patterns

### Loading Multiple Languages

```lua
local languages = {
    {"french.po", "fr"},
    {"chinese_s.po", "zh_CN"},
    {"spanish.po", "es"},
    {"german.po", "de"}
}

for _, lang_data in ipairs(languages) do
    LanguageTranslator:LoadPOFile("data/languages/" .. lang_data[1], lang_data[2])
end
```

### Safe Translation with Fallback

```lua
function GetLocalizedString(string_id, fallback)
    local translated = LanguageTranslator:GetTranslatedString(string_id)
    return translated or fallback or string_id
end

-- Usage
local button_text = GetLocalizedString("STRINGS.UI.BUTTONS.CONFIRM", "Confirm")
```

### Dynamic Language Switching

```lua
function SwitchLanguage(lang_code, po_file_path)
    LanguageTranslator:LoadPOFile(po_file_path, lang_code)
    LanguageTranslator.defaultlang = lang_code
    
    -- Retranslate the STRINGS table
    TranslateStringTable(STRINGS)
end
```

### Testing UI Layout with Longest Strings

```lua
function TestUILayout()
    LanguageTranslator:UseLongestLocs(true)
    
    -- Get longest possible strings for UI elements
    local longest_title = LanguageTranslator:GetLongestTranslatedString("STRINGS.UI.TITLE")
    local longest_button = LanguageTranslator:GetLongestTranslatedString("STRINGS.UI.BUTTON")
    
    -- Use for layout calculations
    CalculateUILayout(longest_title, longest_button)
end
```

## Integration Notes

### String Path Convention
String IDs follow a hierarchical dot notation that maps to table structure:
- `STRINGS.UI.MAINSCREEN.PLAY` maps to `STRINGS["UI"]["MAINSCREEN"]["PLAY"]`
- Paths are case-sensitive and must match exactly
- Root level is always "STRINGS"

### Escape Character Handling
The translator handles common escape sequences needed for PO file compatibility:
- Newlines and carriage returns for multi-line text
- Quote escaping for strings containing quotation marks
- Backslash escaping for literal backslash characters

### Performance Considerations
- Translations are cached in memory after loading
- String lookups are O(1) hash table operations
- Multi-line string joining is performed only during file loading
- Consider loading only required languages to minimize memory usage

## Related Modules

- [Strings](./strings.md): Core string management and STRINGS table structure
- [Languages](../languages/index.md): Language-specific PO files and localization data
- [Modding Utilities](./modutil.md): Utilities for mod localization integration

## Source Reference

**File Location:** `scripts/translator.lua`

**Dependencies:** 
- `class.lua`: Class system foundation
- `util.lua`: File resolution utilities

**Global Access:** Available globally as `LanguageTranslator` instance
