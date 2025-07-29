---
id: createstringspo_dlc
title: Create Strings POT DLC
description: DLC-specific POT file generation tool for localization workflows, particularly for Reign of Giants
sidebar_position: 5

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Create Strings POT DLC

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `createstringspo_dlc.lua` script is a specialized tool for generating POT (Portable Object Template) files from DLC string tables, particularly designed for Reign of Giants content.

The system provides:
- **DLC Integration**: Handles DLC-specific strings including character speech
- **Localization Support**: Converts game strings into POT format for translation workflows
- **Version Compatibility**: Supports both v1 (msgid-based) and v2 (msgctxt-based) formats
- **Translation Management**: Enables creation of translation files from existing string tables
- **Quality Assurance**: Validates string content and handles special characters

## Usage Example

```lua
-- Enable DLC
function IsDLCEnabled(val)
    return val == REIGN_OF_GIANTS
end

-- Generate v2 format POT file
CreateStringsPOTv2("..\\DLC0001\\scripts\\languages\\strings.pot", "STRINGS", STRINGS)

-- Generate with translation data
CreateStringsPOTv2("output/french.po", "STRINGS", french_strings, STRINGS)
```

## Constants

### REIGN_OF_GIANTS

**Value:** `1`

**Status:** 🟢 `stable`

**Description:** DLC identifier constant for Reign of Giants expansion.

### POT Format Versions

| Version | Format | Primary Key | Use Case |
|---------|--------|-------------|----------|
| **v1** | msgid-based | String content | Legacy compatibility, simple workflows |
| **v2** | msgctxt-based | Path context | Modern workflows, better organization |

### Package Path Configuration

The system prioritizes DLC directories for script loading:
```
..\\DLC0001\\scripts\\?.lua;..\\DLC0002\\scripts\\?.lua;?.lua
```

## Functions

### IsDLCEnabled(val) {#is-dlc-enabled}

**Status:** 🟢 `stable`

**Description:**
Checks if a specific DLC is enabled. Currently supports Reign of Giants detection.

**Parameters:**
- `val` (number): DLC identifier to check

**Returns:**
- (boolean): True if the DLC is enabled, false otherwise

**Example:**
```lua
function IsDLCEnabled(val)
    if val == REIGN_OF_GIANTS then
        return true
    end
end
```

**Version History:**
- Added in build 676042: Current stable implementation

### CreateStringsPOTv1(filename, root, tbl_dta, tbl_lkp) {#create-strings-pot-v1}

**Status:** 🟢 `stable`

**Description:**
Creates a POT file using the original msgid-based format with duplicate detection.

**Parameters:**
- `filename` (string, optional): Output filename, defaults to "data\\scripts\\languages\\temp_v1.pot"
- `root` (string, optional): Root table name, defaults to "STRINGS"
- `tbl_dta` (table): Table containing string data to process
- `tbl_lkp` (table, optional): Lookup table for translation data

**Example:**
```lua
CreateStringsPOTv1("output/dlc_strings_v1.pot", "STRINGS", STRINGS)
```

**Version History:**
- Added in build 676042: Current stable implementation

### CreateStringsPOTv2(filename, root, tbl_dta, tbl_lkp) {#create-strings-pot-v2}

**Status:** 🟢 `stable`

**Description:**
Creates a POT file using the enhanced msgctxt-based format with proper headers.

**Parameters:**
- `filename` (string, optional): Output filename, defaults to "data\\DLC0001\\scripts\\languages\\temp_v2.pot"
- `root` (string, optional): Root table name, defaults to "STRINGS"
- `tbl_dta` (table): Table containing string data to process
- `tbl_lkp` (table, optional): Lookup table for translation data

**Example:**
```lua
CreateStringsPOTv2("..\\DLC0001\\scripts\\languages\\strings.pot", "STRINGS", STRINGS)

-- With translation data
CreateStringsPOTv2("output/french.po", "STRINGS", french_strings, STRINGS)
```

**Version History:**
- Added in build 676042: Current stable implementation

### IsValidString(str) {#is-valid-string}

**Status:** 🟢 `stable`

**Description:**
Validates if a string contains only valid ASCII characters (32-127) for POT file inclusion.

**Parameters:**
- `str` (string): String to validate

**Returns:**
- (boolean): True if string contains only valid ASCII characters, false otherwise

**Example:**
```lua
if IsValidString(game_string) then
    -- Process string for POT file
end
```

**Version History:**
- Added in build 676042: Current stable implementation

### LookupIdValue(lkp_var, path) {#lookup-id-value}

**Status:** 🟢 `stable`

**Description:**
Performs dynamic lookup of string values from a lookup table using dot-delimited path syntax with support for numeric indices.

**Parameters:**
- `lkp_var` (string): Name of variable holding lookup table
- `path` (string): Dot-delimited path to the value (e.g., "STRINGS.CHARACTERS.WILSON.ACTIONFAIL.BUILD.1")

**Returns:**
- (string): Value from lookup table if found, nil otherwise

**Example:**
```lua
local value = LookupIdValue("STRINGS_LOOKUP", "STRINGS.CHARACTERS.WATHGRITHR.ANNOUNCE_DUSK")
if value then
    print("Found translation: " .. value)
end
```

**Version History:**
- Added in build 676042: Current stable implementation

## Common Usage Patterns

```lua
-- DLC setup and POT generation
function IsDLCEnabled(val)
    return val == REIGN_OF_GIANTS
end

-- Load DLC strings
require "strings"

-- Generate v2 format POT file for DLC
CreateStringsPOTv2("..\\DLC0001\\scripts\\languages\\strings.pot", "STRINGS", STRINGS)

-- Generate translation POT
local translated_strings = LoadTranslationTable("french_strings.lua")
CreateStringsPOTv2("output/french.po", "STRINGS", translated_strings, STRINGS)

-- Validate strings before processing
if IsValidString(game_string) then
    -- String is safe for POT generation
end
```

## Related Modules

- [**Create Strings POT**](./createstringspo.md): Main game POT generation system
- [**Localization**](./localization.md): Main localization system that uses POT files
- [**Strings**](../languages/index.md): String table definitions and structure
- [**Constants**](./constants.md): Game constants including DLC identifiers

## Status Indicators

🟢 **Stable**: All core functionality is stable and production-ready
