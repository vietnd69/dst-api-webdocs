---
id: createstringspo
title: Create Strings POT
description: Main game POT file generation tool for localization workflows across multiple platforms
sidebar_position: 9
slug: api-vanilla/core-systems/createstringspo
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Create Strings POT

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `createstringspo.lua` script is the main tool for generating POT (Portable Object Template) files from the game's string tables. This system handles localization workflows for the base game across multiple platforms, providing industry-standard translation file formats.

The system provides:
- **Multi-Platform Support**: Handles string generation for Steam, PlayStation, Xbox, and Rail platforms
- **Localization Pipeline**: Converts game strings into POT format for translation workflows
- **UTF-8 Compliance**: Properly handles UTF-8 encoding with reserved byte sequences
- **Version Compatibility**: Supports both v1 (msgid-based) and v2 (msgctxt-based) formats
- **Quality Assurance**: Advanced validation and sorting for cleaner output files

## Usage Example

```lua
-- Set platform and enable POT generation
POT_GENERATION = true
PLATFORM = "WIN32_STEAM"
require "strings"

-- Generate POT file in v2 format
CreateStringsPOTv2("languages/strings.pot", "STRINGS", STRINGS)

-- Generate with translation data
CreateStringsPOTv2("output/french.po", "STRINGS", french_strings, STRINGS)
```

## Command Line Usage

```bash
# Generate for Steam (default)
lua.exe createstringspo.lua

# Generate for Rail platform
lua.exe createstringspo.lua RAIL

# Generate for PlayStation
lua.exe createstringspo.lua PS4

# Generate for Xbox
lua.exe createstringspo.lua XBL
```

## Constants

### STRING_RESERVED_LEAD_BYTES

**Value:** `{238, 239}`

**Status:** 🟢 `stable`

**Description:** UTF-8 byte sequences that are reserved and ignored during POT file generation.

### Platform Support Matrix

| Platform | Argument | PLATFORM Value | Description |
|----------|----------|----------------|-------------|
| **Steam** | (default) | `WIN32_STEAM` | Default Windows Steam platform |
| **Rail** | `RAIL` | `WIN32_RAIL` | WeGame/Rail platform (China) |
| **PlayStation** | `PS4` | `PS4` | PlayStation 4 platform |
| **Xbox** | `XBL` | `XBL` | Xbox Live platform |

## Functions

### CreateStringsPOTv1(filename, root, tbl_dta, tbl_lkp) {#create-strings-pot-v1}

**Status:** 🟢 `stable`

**Description:**
Creates a POT file using the original msgid-based format. Includes duplicate detection.

**Parameters:**
- `filename` (string, optional): Output filename, defaults to "data\\scripts\\languages\\temp_v1.pot"
- `root` (string, optional): Root table name, defaults to "STRINGS"
- `tbl_dta` (table): Table containing string data to process
- `tbl_lkp` (table, optional): Lookup table for translation data

**Example:**
```lua
CreateStringsPOTv1("output/strings_v1.pot", "STRINGS", STRINGS)
```

**Version History:**
- Added in build 676042: Current stable implementation

### CreateStringsPOTv2(filename, root, tbl_dta, tbl_lkp) {#create-strings-pot-v2}

**Status:** 🟢 `stable`

**Description:**
Creates a POT file using the enhanced msgctxt-based format with proper headers and alphabetical sorting.

**Parameters:**
- `filename` (string, optional): Output filename, defaults to "data\\scripts\\languages\\temp_v2.pot"
- `root` (string, optional): Root table name, defaults to "STRINGS"
- `tbl_dta` (table): Table containing string data to process
- `tbl_lkp` (table, optional): Lookup table for translation data

**Example:**
```lua
CreateStringsPOTv2("languages/strings.pot", "STRINGS", STRINGS)

-- With translation data
CreateStringsPOTv2("output/french.po", "STRINGS", french_strings, STRINGS)
```

**Version History:**
- Added in build 676042: Current stable implementation

### IsValidString(str) {#is-valid-string}

**Status:** 🟢 `stable`

**Description:**
Validates if a string should be included in POT generation by checking for reserved UTF-8 byte sequences.

**Parameters:**
- `str` (string): String to validate

**Returns:**
- (boolean): True if string is valid for POT generation, false otherwise

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
Performs dynamic lookup of string values from a lookup table using dot-delimited path syntax.

**Parameters:**
- `lkp_var` (string): Name of variable holding lookup table
- `path` (string): Dot-delimited path to the value (e.g., "STRINGS.NAMES.TORCH")

**Returns:**
- (string): Value from lookup table if found, nil otherwise

**Example:**
```lua
local value = LookupIdValue("STRINGS_LOOKUP", "STRINGS.NAMES.TORCH")
if value then
    print("Found translation: " .. value)
end
```

**Version History:**
- Added in build 676042: Current stable implementation

## Common Usage Patterns

```lua
-- Basic POT generation
POT_GENERATION = true
PLATFORM = "WIN32_STEAM"  -- Set by command line argument
require "strings"

-- Generate v2 format POT file
CreateStringsPOTv2("languages/strings.pot", "STRINGS", STRINGS)

-- Generate with translation data
local french_strings = LoadTranslationTable("french_strings.lua")
CreateStringsPOTv2("output/french.po", "STRINGS", french_strings, STRINGS)

-- Validate strings before processing
if IsValidString(game_string) then
    -- String is safe for POT generation
end
```

## Related Modules

- [**Create Strings POT DLC**](./createstringspo_dlc.md): DLC-specific POT generation system
- [**Localization**](./localization.md): Main localization system that uses POT files
- [**Strings**](../languages/index.md): String table definitions and structure
- [**Constants**](./constants.md): Game constants including platform identifiers

## Status Indicators

🟢 **Stable**: All core functionality is stable and production-ready
