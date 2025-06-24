---
id: fix_character_strings
title: Fix Character Strings
description: Utility script for alphabetically sorting and standardizing character speech files
sidebar_position: 5
slug: core-systems-fix-character-strings
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Fix Character Strings

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `fix_character_strings.lua` is a standalone utility script designed to run outside of the game environment to standardize character speech files. It reads speech data tables, sorts them alphabetically, and outputs them in a consistent format. This tool is essential for maintaining organized and readable character dialogue files across the DST codebase.

## Usage Example

```bash
# Basic usage - sorts input file and creates .lua output
lua fix_character_strings.lua speech_wilson

# Specify custom output file
lua fix_character_strings.lua speech_wilson.lua formatted_wilson.lua

# Process character speech file
lua fix_character_strings.lua speech_warly speech_warly_sorted.lua
```

## Script Parameters

### Command Line Arguments

**file_in (arg[1])**
- **Type:** `string`
- **Required:** Yes
- **Description:** Path to the input speech file (without .lua extension typically)

**file_out (arg[2])**
- **Type:** `string`
- **Optional:** Yes
- **Default:** `file_in .. ".lua"`
- **Description:** Path for the output file. If not specified, appends `.lua` to input filename

## Functions

### alphatable(in_table, indent) {#alphatable}

**Status:** `stable`

**Description:**
Recursively sorts a nested table structure alphabetically by keys and formats it as a properly indented Lua table string.

**Parameters:**
- `in_table` (table): The input table to sort and format
- `indent` (number, optional): Current indentation level for nested formatting (default: 0)

**Returns:**
- (string): Formatted Lua table string with alphabetically sorted keys

**Algorithm:**
1. Iterates through all key-value pairs in the input table
2. Formats keys appropriately (numbers get bracket notation)
3. Handles string values with proper quoting
4. Recursively processes nested tables
5. Sorts all items alphabetically
6. Adds proper indentation and structure

**Example:**
```lua
local sample_data = {
    c = "Third line",
    a = "First line", 
    b = {
        nested_c = "Nested third",
        nested_a = "Nested first"
    }
}

local formatted = alphatable(sample_data)
-- Results in:
-- {
--     a = "First line",
--     b = 
--     {
--         nested_a = "Nested first",
--         nested_c = "Nested third",
--     },
--     c = "Third line",
-- }
```

**Implementation Details:**
```lua
-- Key formatting
local key = tostring(k)
if type(k) == "number" then
    key = "["..key.."]"
end

-- Value formatting
if type(v) == "string" then
    table.insert(items, string.format("%s%s = %q,", inner_indentstr, key, v))
elseif type(v) == "table" then
    local str = alphatable(v, indent + 1)
    table.insert(items, string.format("%s%s =\n%s,", inner_indentstr, key, str))
end
```

## Processing Workflow

### File Processing Pipeline

1. **Input Validation**
   - Checks if `file_in` argument is provided
   - Uses `require()` to load the input speech data

2. **Table Sorting**
   - Calls `alphatable()` on the loaded data
   - Recursively sorts all nested structures

3. **Output Generation**
   - Prepends "return " to create valid Lua module
   - Writes formatted content to output file

4. **File Operations**
   - Opens output file in write mode
   - Writes formatted string
   - Closes file handle

### Example Transformation

**Input (unsorted speech file):**
```lua
return {
    ANNOUNCE_DEATH = "Oh no!",
    ANNOUNCE_ATTACK = "Take this!",
    ANNOUNCE_HEALTH = {
        FULL = "I'm feeling great!",
        HIGH = "I'm doing well.",
        HALF = "I've been better.",
    },
    ANNOUNCE_COLD = "Brrr!",
}
```

**Output (sorted and formatted):**
```lua
return {
    ANNOUNCE_ATTACK = "Take this!",
    ANNOUNCE_COLD = "Brrr!",
    ANNOUNCE_DEATH = "Oh no!",
    ANNOUNCE_HEALTH = 
    {
        FULL = "I'm feeling great!",
        HALF = "I've been better.",
        HIGH = "I'm doing well.",
    },
}
```

## Key Features

### Alphabetical Sorting
- Sorts all table keys alphabetically for consistency
- Maintains hierarchical structure while sorting at each level
- Handles both string and numeric keys appropriately

### Proper Indentation
- Uses tab characters for consistent indentation
- Maintains readable nested structure
- Proper formatting for multi-level tables

### Type Handling
- **Strings**: Properly quoted with `%q` format specifier
- **Numbers**: Formatted with bracket notation `[123]` when used as keys
- **Tables**: Recursively processed and formatted
- **Other types**: Currently not handled (would need extension)

### File Safety
- Creates new output files rather than modifying in place
- Handles file I/O operations safely
- Provides option for custom output filenames

## Common Usage Patterns

### Character Speech Standardization

```bash
# Standardize all character speech files
lua fix_character_strings.lua speech_wilson
lua fix_character_strings.lua speech_wendy  
lua fix_character_strings.lua speech_warly
lua fix_character_strings.lua speech_waxwell
```

### Batch Processing Script

```bash
#!/bin/bash
# Process all speech files in directory
for file in speech_*.lua; do
    base=$(basename "$file" .lua)
    lua fix_character_strings.lua "$base" "formatted_$file"
done
```

### Development Workflow Integration

```bash
# Before committing speech changes
lua fix_character_strings.lua speech_newcharacter
git add speech_newcharacter.lua
git commit -m "feat: add standardized speech for new character"
```

## Limitations and Considerations

### Supported Data Types
- **Supported**: strings, tables, numbers (as keys)
- **Not supported**: functions, userdata, boolean values, nil values

### File Requirements
- Input files must be valid Lua modules that can be loaded with `require()`
- Input data must be a table structure
- Files should follow standard speech file naming conventions

### Performance Considerations
- Recursive algorithm may be slow for very deeply nested structures
- Memory usage scales with table size and nesting depth
- File I/O is synchronous and blocking

## Error Handling

The script has minimal error handling:
- No validation of input file existence
- No error handling for malformed Lua files
- No protection against circular references in tables

**Recommended Usage:**
```bash
# Check file exists before processing
if [ -f "speech_character.lua" ]; then
    lua fix_character_strings.lua speech_character
else
    echo "Speech file not found"
fi
```

## Integration with Build Process

This script is typically used during development and before commits:

1. **Development Phase**: Format speech files for readability
2. **Code Review**: Ensure consistent formatting across speech files
3. **CI/CD Pipeline**: Validate that all speech files are properly formatted
4. **Release Preparation**: Standardize all character dialogue before release

## Related Modules

- [Speech Files](../characters/speech.md): Character-specific dialogue implementations
- [Localization](./localization.md): Multi-language string management system
- [String Processing](./string-processing.md): Text manipulation utilities
- [File Utilities](./fileutil.md): General file management functions
