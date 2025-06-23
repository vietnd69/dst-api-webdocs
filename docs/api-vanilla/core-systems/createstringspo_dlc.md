---
title: Create Strings POT DLC
description: Documentation of the Don't Starve Together DLC strings POT file generation system for localization and translation workflows
sidebar_position: 8
slug: /create-strings-pot-dlc
last_updated: 2024-12-19
build_version: 675312
change_status: stable
---

# Create Strings POT DLC

The Create Strings POT DLC system in Don't Starve Together is a specialized tool for generating POT (Portable Object Template) files from the game's string tables, particularly designed to handle DLC content like Reign of Giants. This system enables localization workflows by extracting translatable strings and converting them into industry-standard translation formats.

## Version History

| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 675312 | 2024-12-19 | stable | Updated documentation to match current implementation |
| 642130 | 2023-06-10 | added | Initial DLC strings POT generation system documentation |

## Overview

The DLC strings POT generation system serves multiple purposes:
- **Localization Support**: Converts game strings into POT format for translation workflows
- **DLC Integration**: Handles DLC-specific strings including character speech
- **Version Compatibility**: Supports both v1 (msgid-based) and v2 (msgctxt-based) formats
- **Translation Management**: Enables creation of translation files from existing string tables
- **Quality Assurance**: Validates string content and handles special characters

The system is designed to work with external translation tools and supports the full localization pipeline for Don't Starve Together and its DLC content.

## Core Architecture

### POT Format Versions

The system supports two distinct POT file formats:

| Version | Format | Primary Key | Use Case |
|---------|--------|-------------|----------|
| **v1** | msgid-based | String content | Legacy compatibility, simple workflows |
| **v2** | msgctxt-based | Path context | Modern workflows, better organization |

### Package Path Configuration

The system prioritizes DLC directories for script loading:

```lua
-- DLC-first package path configuration
package.path = "..\\DLC0001\\scripts\\?.lua;..\\DLC0002\\scripts\\?.lua;?.lua"
```

### DLC Detection

```lua
function IsDLCEnabled(val)
    if val == REIGN_OF_GIANTS then
        return true
    end
end
```

## Version 1: msgid-Based Format

The v1 format uses string content as the primary identifier (msgid).

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

### V1 Output Format

```pot
#. STRINGS.NAMES.TORCH
#: STRINGS.NAMES.TORCH
msgid "Torch"
msgstr ""

#. STRINGS.RECIPE_DESC.TORCH
#: STRINGS.RECIPE_DESC.TORCH
msgid "Provides light and warmth."
msgstr ""
```

## Version 2: msgctxt-Based Format

The v2 format uses path context as the primary identifier, providing better organization and handling duplicate strings.

### Core Function

```lua
function CreateStringsPOTv2(filename, root, tbl_dta, tbl_lkp)
    filename = filename or "data\\DLC0001\\scripts\\languages\\temp_v2.pot"
    root = root or "STRINGS"
    
    local file = io.open(filename, "w")
    
    --Add file format info
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

### String Processing with Context

```lua
local function PrintStringTableV2(base, tbl, file)
    for k,v in pairs(tbl) do
        local path = base.."."..k
        if type(v) == "table" then
            PrintStringTableV2(path, v, file)
        else
            local str = string.gsub(v, "\n", "\\n")
            str = string.gsub(str, "\r", "\\r")
            str = string.gsub(str, "\"", "\\\"")
            if IsValidString(str) then
                file:write("#. "..path)
                file:write("\n")
                file:write("msgctxt \""..path.."\"")
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

### V2 Output Format

```pot
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

## String Validation

### Character Validation

```lua
local function IsValidString(str)
    for i = 1, #str do
        local a = string.byte(str, i, i)
        if a < 32 or a > 127 then
            return false
        end
    end
    return true
end
```

### String Escaping

The system handles special characters through systematic escaping:

```lua
-- Standard escape sequence processing
local str = string.gsub(v, "\n", "\\n")    -- Newlines
str = string.gsub(str, "\r", "\\r")        -- Carriage returns  
str = string.gsub(str, "\"", "\\\"")       -- Quote marks
```

## Translation Support

### Lookup Value Function

The system includes sophisticated path-based lookup for translation workflows:

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

### Translation Table Processing

```lua
function PrintTranslatedStringTableV2(base, tbl_dta, lkp_var, file)
    for k,v in pairs(tbl_dta) do
        local path = base.."."..k
        if type(v) == "table" then
            PrintTranslatedStringTableV2(path, v, lkp_var, file)
        else
            local idstr = LookupIdValue(lkp_var, path)
            if idstr then
                idstr = string.gsub(idstr, "\n", "\\n")
                idstr = string.gsub(idstr, "\r", "\\r")
                idstr = string.gsub(idstr, "\"", "\\\"")
            else
                idstr = ""
            end
            
            local str = v
            str = string.gsub(str, "\n", "\\n")
            str = string.gsub(str, "\r", "\\r")
            str = string.gsub(str, "\"", "\\\"")
            
            if idstr ~= "" then
                file:write("#. "..path)
                file:write("\n")
                file:write("msgctxt \""..path.."\"")
                file:write("\n")
                file:write("msgid \""..idstr.."\"")
                file:write("\n")
                file:write("msgstr \""..str.."\"")
                file:write("\n\n")
            end
        end
    end
end
```

## DLC Integration Workflow

### Reign of Giants Setup Instructions

The system includes detailed instructions for DLC integration:

```lua
-- *** INSTRUCTIONS ***
-- To generate strings for Reign of Giants (DLC):
-- 1. Backup the speech_[character].lua files in DontStarve\data\scripts
-- 2. Copy the speech_[character].lua files in DontStarve\data\DLC0001\scripts 
--    and paste them into DontStarve\data\scripts
-- 3. Open strings.lua and find the STRINGS.CHARACTERS table.
--    Add "WATHGRITHR = require "speech_wathgrithr"" and 
--    "WEBBER = require "speech_webber"" to the table and save the file.
-- 4. Open cmd and navigate to the DontStarve\data\scripts folder
-- 5. Enter "..\..\tools\LUA\lua.exe createstringspo_dlc.lua" into the cmd line 
--    and press return
-- 6. Undo your changes to strings.lua and restore the backed up speech files 
--    to their previous location in data\scripts
```

### Execution Script

```lua
print("Generating PO/T files from strings table....")

--Create POT file for STRINGS table in new v2 format
CreateStringsPOTv2("..\\DLC0001\\scripts\\languages\\strings.pot", "STRINGS", STRINGS)
```

## Usage Examples

### Basic POT Generation

```lua
-- Generate v1 POT file
CreateStringsPOTv1("output/strings_v1.pot", "STRINGS", STRINGS)

-- Generate v2 POT file  
CreateStringsPOTv2("output/strings_v2.pot", "STRINGS", STRINGS)
```

### Translation Workflow

```lua
-- Load existing translation
local translated_strings = LoadTranslationTable("french_strings.lua")

-- Generate POT with translation data
CreateStringsPOTv2("output/french.po", "STRINGS", translated_strings, STRINGS)
```

### DLC-Specific Generation

```lua
-- Enable DLC detection
function IsDLCEnabled(val)
    return val == REIGN_OF_GIANTS
end

-- Load DLC strings
require "strings"

-- Generate DLC POT file
CreateStringsPOTv2("DLC0001/scripts/languages/strings.pot", "STRINGS", STRINGS)
```

### Custom Path Processing

```lua
-- Process specific string subtables
local ui_strings = STRINGS.UI
CreateStringsPOTv2("ui_strings.pot", "STRINGS.UI", ui_strings)

local character_strings = STRINGS.CHARACTERS
CreateStringsPOTv2("character_strings.pot", "STRINGS.CHARACTERS", character_strings)
```

## File Structure and Paths

### Default Output Locations

| Version | Default Path | Purpose |
|---------|--------------|---------|
| v1 | `data\scripts\languages\temp_v1.pot` | Legacy format output |
| v2 | `data\DLC0001\scripts\languages\temp_v2.pot` | Modern format output |

### DLC Directory Structure

```
DontStarve/
├── data/
│   ├── scripts/
│   │   ├── strings.lua
│   │   └── speech_[character].lua (backup location)
│   └── DLC0001/
│       └── scripts/
│           ├── languages/
│           │   └── strings.pot (output)
│           └── speech_[character].lua (DLC location)
```

## Error Handling and Validation

### Duplicate Detection

```lua
-- v1 duplicate prevention
if msgids[str] then
    print("duplicate msgid found: "..str.." (skipping...)")
else
    msgids[str] = true
    -- Process string
end
```

### String Validation

```lua
-- Only process valid ASCII strings
if IsValidString(str) then
    -- Write to POT file
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

## Advanced Features

### Dynamic Path Resolution

The system supports complex table paths including numeric indices:

```lua
-- Example path: STRINGS.CHARACTERS.WATHGRITHR.ACTIONFAIL.BUILD.1
-- Resolves to: STRINGS_LOOKUP["CHARACTERS"]["WATHGRITHR"]["ACTIONFAIL"]["BUILD"][1]
```

### Modular Translation Support

```lua
-- Support for loading translation modules
local alternate_strings = require("translated_strings")
CreateStringsPOTv2("output.po", "STRINGS", alternate_strings, STRINGS)
```

### Character Speech Integration

```lua
-- DLC character speech integration
STRINGS.CHARACTERS.WATHGRITHR = require "speech_wathgrithr"
STRINGS.CHARACTERS.WEBBER = require "speech_webber"
```

## Integration Points

### String Table System

```lua
-- Direct integration with global strings
require "strings"
-- STRINGS table is now available for processing
```

### DLC Management

```lua
-- DLC enablement detection
if IsDLCEnabled(REIGN_OF_GIANTS) then
    -- Process DLC-specific content
end
```

### Tool Chain Integration

```lua
-- Command line execution
-- lua.exe createstringspo_dlc.lua
```

## Performance Considerations

### Memory Management

```lua
-- Global tracking tables
local msgids = {}           -- v1 duplicate tracking
local STRINGS_LOOKUP = {}   -- Translation lookup table
```

### File I/O Optimization

```lua
-- Single file handle per operation
local file = io.open(filename, "w")
-- ... process all strings ...
file:close()
```

### Recursive Processing

```lua
-- Efficient recursive table traversal
if type(v) == "table" then
    PrintStringTableV2(path, v, file)  -- Recurse
else
    -- Process leaf string
end
```

## Status Indicators

🟢 **Stable**: Core POT generation functionality  
🟢 **Stable**: v1 and v2 format support  
🟢 **Stable**: DLC integration workflows  
🟢 **Stable**: String validation and escaping  
🟢 **Stable**: Translation table processing

## Related Modules

- [**Localization**](./localization.md) - Main localization system that uses POT files
- [**Strings**](../languages/index.md) - String table definitions and structure
- [**Constants**](./constants.md) - Game constants including DLC identifiers
- [**Character Systems**](./character-systems/index.md) - Character-specific strings and speech

---

**Note**: This documentation covers the POT file generation tool for localization workflows. For information about the actual string usage in-game, see the [Localization documentation](./localization.md).
