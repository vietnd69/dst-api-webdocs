---
id: klump
title: Klump
description: Encrypted file loading system for secure game assets and strings
sidebar_position: 2
slug: api-vanilla/core-systems/klump
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Klump

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `klump` module provides an encrypted file loading system for secure game assets and localized strings. It is primarily used for festival event content like Quagmire, where assets need to be decrypted using ciphers before being accessible to the game.

## Usage Example

```lua
-- Load a klump file with cipher
LoadKlumpFile("images/quagmire_food_inv_images_potato.tex", cipher_key, false)

-- Load klump string data
LoadKlumpString("STRINGS.NAMES.POTATO", cipher_key, false)

-- Check if already loaded
if IsKlumpLoaded("images/special_asset.tex") then
    print("Asset already available")
end
```

## Constants

### LOAD_UPFRONT_MODE

**Value:** `false`

**Status:** `stable`

**Description:** Controls the loading strategy for klump files. When false, uses the standard file list approach. When true, uses direct QUAGMIRE_FOOD_IDS iteration.

## Functions

### LoadAccessibleKlumpFiles(minimal_load) {#load-accessible-klump-files}

**Status:** `stable`

**Description:**
Loads all accessible klump files based on active festival events. Supports two loading modes: upfront mode for direct food ID iteration and standard mode using the klump_files list.

**Parameters:**
- `minimal_load` (boolean): If true, skips loading string data to reduce memory usage

**Example:**
```lua
-- Load all klump files for current festival
LoadAccessibleKlumpFiles(false)

-- Minimal load without strings
LoadAccessibleKlumpFiles(true)
```

**Loading Behavior:**
- **Upfront Mode:** Directly loads Quagmire food assets using QUAGMIRE_FOOD_IDS
- **Standard Mode:** Iterates through the klump_files list and loads available assets

**Festival Requirements:**
- Only loads if Quagmire festival is active or was previously active
- Checks `IsFestivalEventActive(FESTIVAL_EVENTS.QUAGMIRE)` or `IsPreviousFestivalEvent(FESTIVAL_EVENTS.QUAGMIRE)`

### LoadKlumpFile(klump_file, cipher, suppress_print) {#load-klump-file}

**Status:** `stable`

**Description:**
Loads an encrypted klump file using the provided cipher. Prevents duplicate loading and saves the cipher to the player profile.

**Parameters:**
- `klump_file` (string): Path to the klump file to load
- `cipher` (string): Decryption key for the file
- `suppress_print` (boolean): If true, suppresses debug print output

**Example:**
```lua
-- Load texture file
LoadKlumpFile("images/quagmire_food_inv_images_potato.tex", "abc123", false)

-- Load animation file silently
LoadKlumpFile("anim/dynamic/potato.dyn", "def456", true)
```

**Side Effects:**
- Saves cipher to player profile via `Profile:SaveKlumpCipher()`
- Calls `TheSim:LoadKlumpFile()` for actual file loading
- Marks file as loaded in internal tracking

### LoadKlumpString(klump_file, cipher, suppress_print) {#load-klump-string}

**Status:** `stable`

**Description:**
Loads encrypted string data from a klump file. Similar to LoadKlumpFile but specifically for localized strings.

**Parameters:**
- `klump_file` (string): Path to the klump string file
- `cipher` (string): Decryption key for the strings
- `suppress_print` (boolean): If true, suppresses debug print output

**Example:**
```lua
-- Load localized strings
LoadKlumpString("STRINGS.NAMES.POTATO", "string_cipher", false)
```

**Side Effects:**
- Saves cipher to player profile
- Calls `TheSim:LoadKlumpString()` for actual string loading
- Tracks loading status internally

### IsKlumpLoaded(klump_file) {#is-klump-loaded}

**Status:** `stable`

**Description:**
Checks whether a specific klump file has already been loaded to prevent duplicate loading operations.

**Parameters:**
- `klump_file` (string): Path to the klump file to check

**Returns:**
- (boolean): True if the file has been loaded, false otherwise

**Example:**
```lua
if not IsKlumpLoaded("images/special_texture.tex") then
    LoadKlumpFile("images/special_texture.tex", cipher, false)
end
```

### ApplyKlumpToStringTable(string_id, json_str) {#apply-klump-to-string-table}

**Status:** `stable`

**Description:**
Applies localized string data from JSON to the global string table. Handles locale-specific string selection and fallback to English.

**Parameters:**
- `string_id` (string): Dot-separated path to the string location (e.g., "STRINGS.NAMES.POTATO")
- `json_str` (string): JSON string containing localized text data

**Example:**
```lua
local json_data = '{"en":"Potato","es":"Patata","zh":"土豆"}'
ApplyKlumpToStringTable("STRINGS.NAMES.POTATO", json_data)
```

**Locale Handling:**
- Maps `"zhr"` to `"zh"` for Chinese
- Maps `"mex"` to `"es"` for Mexican Spanish
- Falls back to English (`"en"`) if current locale is unavailable
- Creates intermediate tables if they don't exist in the path

## Internal State

### loaded_klumps

**Type:** `table`

**Description:** Internal tracking table that stores which klump files have been successfully loaded to prevent duplicate operations.

## Loading Modes

### LOAD_UPFRONT_MODE = true
```lua
-- Direct asset loading for Quagmire event
for _,name in pairs(QUAGMIRE_FOOD_IDS) do
    LoadKlumpFile("images/quagmire_food_inv_images_"..name..".tex", secrets[name].cipher, true)
    LoadKlumpFile("images/quagmire_food_inv_images_hires_"..name..".tex", secrets[name].cipher, true)
    LoadKlumpFile("anim/dynamic/"..name..".dyn", secrets[name].cipher, true)
    -- Optionally load strings
    if not minimal_load then
        LoadKlumpString("STRINGS.NAMES."..string.upper(name), secrets[name].cipher, true)
    end
end
```

### Standard Mode (LOAD_UPFRONT_MODE = false)
```lua
-- Iterate through klump_files list
for _,file in pairs(require("klump_files")) do
    local klump_file = string.gsub(file, "klump/", "")
    local cipher = Profile:GetKlumpCipher(klump_file)
    if cipher ~= nil then
        if is_strings then
            LoadKlumpString(klump_file, cipher, true)
        else
            LoadKlumpFile(klump_file, cipher, true)
        end
    end
end
```

## File Path Processing

The module handles different file path formats:

1. **Standard Assets:** Direct file paths (e.g., `"images/texture.tex"`)
2. **String Files:** Files with `"strings/"` prefix are processed as string data
3. **Path Normalization:** Removes `"klump/"` prefix from file paths

## Festival Integration

The klump system is tightly integrated with festival events:

- **Event Dependency:** Only loads during active or previous Quagmire festivals
- **Dynamic Loading:** Assets are loaded on-demand when events become active
- **Cipher Management:** Uses event server data and profile storage for cipher keys

## Error Handling

- **Duplicate Prevention:** `IsKlumpLoaded()` prevents redundant loading operations
- **Silent Failures:** Missing ciphers result in skipped files rather than errors
- **Debug Output:** Optional print statements for debugging load operations

## Performance Considerations

- **Lazy Loading:** Files are only loaded when festivals are active
- **Minimal Mode:** Strings can be skipped for memory optimization
- **Caching:** Loaded status is tracked to prevent redundant operations
- **Batch Loading:** `LoadAccessibleKlumpFiles()` efficiently loads multiple assets

## Related Modules

- [klump_files](./klump_files.md): Auto-generated list of available klump files
- [json](./json.md): Used for parsing localized string data
- [Profile](./playerprofile.md): Stores and retrieves cipher keys
- [events](./events.md): Festival event system integration

## Security Notes

- **Encryption:** All klump files are encrypted and require valid ciphers
- **Cipher Storage:** Decryption keys are securely stored in player profiles
- **Access Control:** Only authorized festival content can be decrypted and loaded
