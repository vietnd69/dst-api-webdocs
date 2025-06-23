---
title: Create Strings POT
description: Documentation of the Don't Starve Together main game strings POT file generation system for localization workflows
sidebar_position: 9
slug: /create-strings-pot
last_updated: 2024-12-19
build_version: 675312
change_status: stable
---

# Create Strings POT

The Create Strings POT system in Don't Starve Together is the main tool for generating POT (Portable Object Template) files from the game's string tables. This system handles localization workflows for the base game across multiple platforms, providing industry-standard translation file formats for the localization pipeline.

## Version History

| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 675312 | 2024-12-19 | stable | Updated documentation to match current implementation |
| 642130 | 2023-06-10 | added | Initial main game strings POT generation system documentation |

## Overview

The main game strings POT generation system serves multiple purposes:
- **Multi-Platform Support**: Handles string generation for Steam, PlayStation, Xbox, and Rail platforms
- **Localization Pipeline**: Converts game strings into POT format for translation workflows
- **UTF-8 Compliance**: Properly handles UTF-8 encoding with reserved byte sequences
- **Version Compatibility**: Supports both v1 (msgid-based) and v2 (msgctxt-based) formats
- **Quality Assurance**: Advanced validation and sorting for cleaner output files

The system is designed as the primary localization tool for Don't Starve Together base game content, with enhanced features for professional translation workflows.

## Core Architecture

### Platform Detection

The system supports multiple gaming platforms through command-line arguments:

```lua
--Convert our cmd line platform to the PLATFORM expected in the strings table file.
if arg[1] == "RAIL" then
    PLATFORM = "WIN32_RAIL"
elseif arg[1] == "PS4" then
    PLATFORM = "PS4"
elseif arg[1] == "XBL" then
    PLATFORM = "XBL"
else
    PLATFORM = "WIN32_STEAM"
end
```

### POT Generation Mode

```lua
POT_GENERATION = true
require "strings"
require "io"
```

### Platform Support Matrix

| Platform | Argument | PLATFORM Value | Description |
|----------|----------|----------------|-------------|
| **Steam** | (default) | `WIN32_STEAM` | Default Windows Steam platform |
| **Rail** | `RAIL` | `WIN32_RAIL` | WeGame/Rail platform (China) |
| **PlayStation** | `PS4` | `PS4` | PlayStation 4 platform |
| **Xbox** | `XBL` | `XBL` | Xbox Live platform |

## UTF-8 String Handling

### Reserved Byte Sequences

The system handles special UTF-8 encoding requirements:

```lua
-- Strings beginning with these special bytes will be ignored during pot file generation
-- See note about DST UTF-8 encoding in strings.lua
STRING_RESERVED_LEAD_BYTES = {
    238,
    239,
}
```

### String Validation

```lua
local function IsValidString(str)
    if 0 < string.len(str) then
        local lead_byte = string.byte(str, 1, 1)
        for i, reserved_bytes in pairs(STRING_RESERVED_LEAD_BYTES) do
            if lead_byte == reserved_bytes then
                return false
            end
        end
    end
    return true
end
```

## Version 1: msgid-Based Format

### Core Function

```lua
function CreateStringsPOTv1(filename, root, tbl_dta, tbl_lkp)
    filename = filename or "data\\scripts\\languages\\temp_v1.pot"
    root = root or "STRINGS"
    
    local file = io.open(filename, "w")
    
    if tbl_lkp then
        STRINGS_LOOKUP = tbl_lkp
        PrintTranslatedStringTableV1(root, tbl_dta, "STRINGS_LOOKUP", file)
    else
        PrintStringTableV1(root, tbl_dta, file)
    end
    
    file:close()
end
```

### String Processing

```lua
local function PrintStringTableV1(base, tbl, file)
    for k,v in pairs(tbl) do
        local path = base.."."..k
        if type(v) == "table" then
            PrintStringTableV1(path, v, file)
        else
            local str = string.gsub(v, "\n", "\\n")
            str = string.gsub(str, "\r", "\\r")
            str = string.gsub(str, "\"", "\\\"")
            
            if msgids[str] then
                print("duplicate msgid found: "..str.." (skipping...)")
            else
                msgids[str] = true
                
                file:write("#. "..path)
                file:write("\n")
                file:write("#: "..path)
                file:write("\n")
                file:write("msgid \""..str.."\"")
                file:write("\n")
                file:write("msgstr \"\"")
                file:write("\n\n")
            end
        end
    end
end
```

## Version 2: Enhanced msgctxt-Based Format

The v2 format includes significant improvements over the DLC version.

### Core Function with Enhanced Header

```lua
function CreateStringsPOTv2(filename, root, tbl_dta, tbl_lkp)
    filename = filename or "data\\scripts\\languages\\temp_v2.pot"
    root = root or "STRINGS"
    
    local file = io.open(filename, "w")
    
    --Add file format info with proper POT header
    file:write("msgid \"\"\n")
    file:write("msgstr \"\"\n")
    file:write("\"Application: Dont' Starve\\n\"")
    file:write("\n")
    file:write("\"POT Version: 2.0\\n\"")
    file:write("\n")
    file:write("\n")
    
    if tbl_lkp then
        STRINGS_LOOKUP = tbl_lkp
        PrintTranslatedStringTableV2(root, tbl_dta, "STRINGS_LOOKUP", file)
    else
        PrintStringTableV2(root, tbl_dta, file)
    end
    
    file:close()
end
```

### Advanced String Processing with Sorting

```lua
local output_strings = nil

local function PrintStringTableV2(base, tbl, file)
    if file then
        output_strings = {}
    end
    
    for k,v in pairs(tbl) do
        local path = base.."."..k
        if type(v) == "table" then
            PrintStringTableV2(path, v)
        else
            local str = string.gsub(v, "\n", "\\n")
            str = string.gsub(str, "\r", "\\r")
            str = string.gsub(str, "\"", "\\\"")
            
            if IsValidString(str) then
                local to_add = {}
                to_add.path = path
                to_add.str = str
                table.insert(output_strings, to_add)
            elseif string.len(v) > 4 then
                print("### Possible valid string dropped from .pot generation?", path, v)
            end
        end
    end
    
    if file then
        -- Sort strings alphabetically by path for consistent output
        table.sort(output_strings, function(a,b) return a.path < b.path end)
        
        for _,v in pairs(output_strings) do
            file:write("#. "..v.path)
            file:write("\n")
            file:write("msgctxt \""..v.path.."\"")
            file:write("\n")
            file:write("msgid \""..v.str.."\"")
            file:write("\n")
            file:write("msgstr \"\"")
            file:write("\n\n")
        end
    end
end
```

### V2 Output Format with Proper Header

```pot
msgid ""
msgstr ""
"Application: Dont' Starve\n"

"POT Version: 2.0\n"


#. STRINGS.NAMES.TORCH
msgctxt "STRINGS.NAMES.TORCH"
msgid "Torch"
msgstr ""

#. STRINGS.RECIPE_DESC.TORCH
msgctxt "STRINGS.RECIPE_DESC.TORCH"
msgid "Provides light and warmth."
msgstr ""
```

## Advanced Features

### Quality Assurance Reporting

The system provides detailed feedback on potentially dropped strings:

```lua
elseif string.len(v) > 4 then --4 is arbitrary, high enough to just ignore the controller "strings" but low enough to catch valid strings that were dropped due to umlauts and such
    print("### Possible valid string dropped from .pot generation?", path, v)
end
```

### Alphabetical Sorting

Unlike the DLC version, the main system sorts output alphabetically:

```lua
-- Sort strings alphabetically by path for consistent output
table.sort(output_strings, function(a,b) return a.path < b.path end)
```

### Translation Support

The system includes the same sophisticated path-based lookup as the DLC version:

```lua
local function LookupIdValue(lkp_var, path)
    --capture original tbl var name and remaining indexes
    local sidx, eidx, tblvar, str = string.find(path, "([^%.]*).(.*)")
    
    --attempt to capture ending numeric index, store and remove if found
    local sidx, eidx, endnum1 = string.find(str, "%.(%d*)$")
    if endnum1 then str = string.sub(str,1,string.len(str)-string.len(endnum1)-1) end
    
    --attempt to capture second ending numeric index, store and remove if found
    local sidx, eidx, endnum2 = string.find(str, "%.(%d*)$")
    if endnum2 then str = string.sub(str,1,string.len(str)-string.len(endnum2)-1) end
    
    --replace dots with bracket quote syntax
    str = string.gsub(str, "%.", "\"][\"")
    
    --build eval string for returning value in lookup table
    local evalstr = "return "..lkp_var.."[\""..str.."\"]"
    if endnum2 then evalstr = evalstr.."["..endnum2.."]" end
    if endnum1 then evalstr = evalstr.."["..endnum1.."]" end
    
    local result, val = pcall(function() return loadstring(evalstr)() end)
    if result and type(val) == "string" then return val else return nil end
end
```

## Usage Examples

### Basic Cross-Platform Generation

```lua
-- Generate for default Steam platform
CreateStringsPOTv2("output/strings_steam.pot", "STRINGS", STRINGS)

-- Generate for PlayStation (set PLATFORM first)
PLATFORM = "PS4"
CreateStringsPOTv2("output/strings_ps4.pot", "STRINGS", STRINGS)

-- Generate for Xbox
PLATFORM = "XBL"  
CreateStringsPOTv2("output/strings_xbox.pot", "STRINGS", STRINGS)
```

### Command Line Platform Selection

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

### Translation Workflow

```lua
-- Enable POT generation mode
POT_GENERATION = true

-- Load strings for specific platform
PLATFORM = "WIN32_STEAM"
require "strings"

-- Load existing translation
local french_strings = LoadTranslationTable("french_strings.lua")

-- Generate POT with translation data
CreateStringsPOTv2("output/french.po", "STRINGS", french_strings, STRINGS)
```

### Quality Assurance Workflow

```lua
-- Enable detailed reporting
POT_GENERATION = true
require "strings"

-- Generate with validation reporting
CreateStringsPOTv2("output/strings_qa.pot", "STRINGS", STRINGS)
-- Output will include warnings for potentially dropped strings
```

## Platform-Specific Considerations

### Steam Platform

```lua
PLATFORM = "WIN32_STEAM"
-- Standard Windows Steam release
```

### Rail Platform (WeGame/China)

```lua
PLATFORM = "WIN32_RAIL"
-- Chinese market through WeGame/Rail platform
-- May have specific string filtering requirements
```

### Console Platforms

```lua
-- PlayStation 4
PLATFORM = "PS4"

-- Xbox Live
PLATFORM = "XBL"
-- Console platforms may have platform-specific strings
```

## File Structure and Output

### Default Output Locations

| Version | Default Path | Purpose |
|---------|--------------|---------|
| v1 | `data\scripts\languages\temp_v1.pot` | Legacy format output |
| v2 | `data\scripts\languages\temp_v2.pot` | Modern format output |

### Production Output

```lua
-- Production generation command
CreateStringsPOTv2("languages/strings.pot", "STRINGS", STRINGS)
```

### Directory Structure

```
DontStarve/
├── data/
│   └── scripts/
│       ├── createstringspo.lua
│       ├── strings.lua
│       └── languages/
│           └── strings.pot (output)
└── tools/
    └── LUA/
        └── lua.exe
```

## Execution Instructions

### Main Game Generation

The system includes step-by-step instructions:

```lua
-- *** INSTRUCTIONS ***
-- To generate strings for the main game:
-- 1. Open cmd and navigate to the DontStarve\data\scripts folder
-- 2. Enter "..\..\tools\LUA\lua.exe createstringspo.lua" (without quotes) 
--    into the cmd line and press return
```

### Production Script

```lua
print("Generating PO/T files from strings table....")

-- Create POT file for STRINGS table in new v2 format
CreateStringsPOTv2("languages/strings.pot", "STRINGS", STRINGS)
```

## Error Handling and Validation

### UTF-8 Validation

```lua
-- Check for reserved UTF-8 byte sequences
local function IsValidString(str)
    if 0 < string.len(str) then
        local lead_byte = string.byte(str, 1, 1)
        for i, reserved_bytes in pairs(STRING_RESERVED_LEAD_BYTES) do
            if lead_byte == reserved_bytes then
                return false
            end
        end
    end
    return true
end
```

### Duplicate Detection

```lua
-- V1 duplicate prevention
if msgids[str] then
    print("duplicate msgid found: "..str.." (skipping...)")
else
    msgids[str] = true
    -- Process string
end
```

### Quality Assurance Reporting

```lua
-- Report potentially valid strings that were filtered out
elseif string.len(v) > 4 then
    print("### Possible valid string dropped from .pot generation?", path, v)
end
```

### Safe String Evaluation

```lua
-- Protected call for dynamic string evaluation
local result, val = pcall(function() return loadstring(evalstr)() end)
if result and type(val) == "string" then 
    return val 
else 
    return nil 
end
```

## Performance Optimizations

### Batch Processing

```lua
-- Collect all strings before sorting and output
local output_strings = nil
if file then
    output_strings = {}
end

-- Process all strings
-- ... string collection ...

-- Sort and output in single pass
table.sort(output_strings, function(a,b) return a.path < b.path end)
```

### Memory Management

```lua
-- Global tracking tables
local msgids = {}           -- v1 duplicate tracking
local STRINGS_LOOKUP = {}   -- Translation lookup table
local output_strings = nil  -- v2 batch processing
```

### File I/O Optimization

```lua
-- Single file handle per operation
local file = io.open(filename, "w")
-- ... process all strings ...
file:close()
```

## Integration Points

### Platform System

```lua
-- Platform-aware string loading
POT_GENERATION = true
PLATFORM = "WIN32_STEAM"  -- Set by command line
require "strings"
```

### String Table System

```lua
-- Direct integration with global strings
require "strings"
-- STRINGS table is now available for processing
```

### Localization Pipeline

```lua
-- Standard POT file generation for translation tools
CreateStringsPOTv2("languages/strings.pot", "STRINGS", STRINGS)
```

## Comparison with DLC Version

### Enhanced Features

| Feature | DLC Version | Main Game Version |
|---------|-------------|-------------------|
| **Platform Support** | Single platform | Multi-platform with CLI args |
| **UTF-8 Handling** | Basic validation | Reserved byte sequence handling |
| **Output Sorting** | Unsorted | Alphabetical path sorting |
| **Quality Reporting** | Basic | Enhanced with length-based filtering |
| **Header Format** | Simple | Proper POT header with msgid/msgstr |

### Shared Features

- v1 and v2 format support
- msgctxt-based organization
- Translation table processing
- Path-based string lookup
- String escaping and validation

## Status Indicators

🟢 **Stable**: Multi-platform POT generation functionality  
🟢 **Stable**: UTF-8 compliance and reserved byte handling  
🟢 **Stable**: Enhanced v2 format with sorting  
🟢 **Stable**: Quality assurance reporting  
🟢 **Stable**: Command-line platform selection

## Related Modules

- [**Create Strings POT DLC**](./createstringspo_dlc.md) - DLC-specific POT generation system
- [**Localization**](./localization.md) - Main localization system that uses POT files
- [**Strings**](../languages/index.md) - String table definitions and structure
- [**Constants**](./constants.md) - Game constants including platform identifiers

---

**Note**: This documentation covers the main game POT file generation tool. For DLC-specific generation, see the [Create Strings POT DLC documentation](./createstringspo_dlc.md).
