---
id: translator
title: Translator
description: Loads and manages translated strings from .po files, supporting both legacy and new format entries for multi-language localization.
tags: [localization, text, language]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 88960c16
system_scope: environment
---

# Translator

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Translator` is a standalone localization manager responsible for loading `.po`-style translation files and providing translated strings by unique path identifiers. It supports two file formats—legacy (using `#. path` reference lines) and new (using `msgctxt "path"` fields)—and handles multiline string concatenation and escape character conversion. The module initializes a global instance `LanguageTranslator` used by `strings.lua` to populate localized tables recursively.

## Usage example
```lua
-- Load a translation file
LanguageTranslator:LoadPOFile("data/languages/fr.po", "French")

-- Manually retrieve a translation
local str = LanguageTranslator:GetTranslatedString("STRINGS.CHARACTERS.DIALOG.FEAST.Description", "French")

-- Automatically translate a string table (e.g., from strings.lua)
TranslateStringTable(STRINGS.CHARACTERS.DIALOG)
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `languages` | table | `{}` | Stores loaded language tables, keyed by language name; each value is a map from string ID (path) to translated string. |
| `defaultlang` | string or nil | `nil` | The currently active language; used as fallback when `lang` is omitted in `GetTranslatedString`. |
| `use_longest_locs` | boolean | `false` | Controls whether `GetLongestTranslatedString` is used during table translation. |

## Main functions
### `LoadPOFile(fname, lang)`
* **Description:** Loads a `.po` file and stores its translations in the `languages[lang]` table. Automatically detects file format (legacy or new) and handles multiline entries.
* **Parameters:**  
  - `fname` (string) — Relative path to the `.po` file.  
  - `lang` (string) — Language name used as the key in `self.languages`.
* **Returns:** Nothing.
* **Error states:** Silently returns if the file cannot be opened or found.

### `ConvertEscapeCharactersToRaw(str)`
* **Description:** Converts escaped sequences (`\n`, `\r`, `\"`, `\\`) in a string to their raw characters.
* **Parameters:**  
  - `str` (string) — Input string with escaped characters.
* **Returns:** (string) — Unescaped string.

### `ConvertEscapeCharactersToString(str)`
* **Description:** Escapes raw characters (`\n`, `\r`, `"`, `\`) in a string for safe serialization (e.g., into `.po` format).
* **Parameters:**  
  - `str` (string) — Input raw string.
* **Returns:** (string) — Escaped string.

### `GetTranslatedString(strid, lang)`
* **Description:** Returns the translated string for a given ID (`strid`) in the specified language, or `nil` if not found or no translation available. Uses `defaultlang` if `lang` is omitted.
* **Parameters:**  
  - `strid` (string) — Unique path identifier (e.g., `"STRINGS.CHARACTERS.DIALOG.FEAST.Description"`).  
  - `lang` (string or nil) — Target language name.
* **Returns:** (string or nil) — Translated string, or `nil` if missing.

### `GetLongestTranslatedString(strid)`
* **Description:** Iterates through all loaded languages and returns the longest translated string available for `strid`.
* **Parameters:**  
  - `strid` (string) — Unique path identifier.
* **Returns:** (string or nil) — Longest available translation (raw), or `nil` if no translation exists in any language.

## Events & listeners
None.