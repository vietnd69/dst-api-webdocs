---
id: json
title: JSON
description: JSON encoding and decoding support for Lua data structures
sidebar_position: 1
slug: game-scripts/core-systems/json
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# JSON

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `json` module provides JSON encoding and decoding support for the Lua language. This is a modified version of JSON4Lua (version 0.9.40) that includes game-specific adaptations for Don't Starve Together's data handling requirements.

## Important Notice

⚠️ **Warning**: The `encode()` function is **not compliant** with JSON standards. Only use this for game data persistence. For external services (analytics, leaderboards, etc.), use `encode_compliant()` instead.

## Usage Example

```lua
local json = require("json")

-- Encoding game data
local data = { health = 100, items = {"axe", "pickaxe"} }
local encoded = json.encode(data)

-- Decoding game data
local decoded = json.decode(encoded)
```

## Functions

### encode(v) {#encode}

**Status:** `stable`

**Description:**
Encodes an arbitrary Lua object/variable into a JSON string. This function uses game-specific string encoding that is not compliant with JSON standards but works with the game's decode function.

**Parameters:**
- `v` (any): The Lua object/variable to be JSON encoded

**Returns:**
- (string): JSON-encoded string in internal Lua string format

**Example:**
```lua
local data = {
    player = "Wilson",
    health = 100,
    inventory = {"axe", "berries", nil, "torch"},
    position = {x = 10, y = 0, z = 15}
}

local json_string = json.encode(data)
-- Returns: {"player":"Wilson","health":100,"inventory":["axe","berries",null,"torch"],"position":{"x":10,"y":0,"z":15}}
```

**Supported Types:**
- `nil` → `"null"`
- `string` → JSON string with game-specific escaping
- `number` → JSON number
- `boolean` → JSON boolean
- `table` → JSON object or array
- `function` (only `json.null`) → `"null"`

### encode_compliant(v) {#encode-compliant}

**Status:** `stable`

**Description:**
Encodes a Lua object into JSON-compliant format suitable for external web services. The game cannot decode this output format.

**Parameters:**
- `v` (any): The Lua object/variable to be JSON encoded

**Returns:**
- (string): Standards-compliant JSON string

**Example:**
```lua
local data = { message = "Hello\nWorld", count = 42 }
local compliant_json = json.encode_compliant(data)
-- Safe to send to external APIs
```

**Note:** Never add decode support for this function's output. The format may change without warning.

### decode(s, startPos) {#decode}

**Status:** `stable`

**Description:**
Decodes a JSON string and returns the decoded value as a Lua data structure.

**Parameters:**
- `s` (string): The JSON string to decode
- `startPos` (number, optional): Starting position in the string (defaults to 1)

**Returns:**
- (any): The decoded Lua object (table, string, number, boolean, or nil)
- (number): Position of the first character after the scanned JSON object

**Example:**
```lua
local json_string = '{"health":100,"items":["axe","berries"]}'
local data, next_pos = json.decode(json_string)

print(data.health) -- 100
print(data.items[1]) -- "axe"
```

**Supported Input:**
- JSON objects `{}`
- JSON arrays `[]`
- JSON strings (single or double quoted)
- JSON numbers (including scientific notation)
- JSON booleans (`true`, `false`)
- JSON null (`null`)
- C-style comments `/* */` (ignored)

### null() {#null}

**Status:** `stable`

**Description:**
Returns a null value that can be used in associative arrays. This allows explicit null values in tables where `nil` would be discarded.

**Returns:**
- (function): The null function reference

**Example:**
```lua
local data = {
    name = "Wilson",
    age = json.null(), -- Explicit null value
    items = {"axe", json.null(), "berries"} -- Null in array
}

local encoded = json.encode(data)
-- Results in: {"name":"Wilson","age":null,"items":["axe",null,"berries"]}
```

## Internal Functions

The module includes several private functions for parsing different JSON elements:

- `decode_scanArray(s, startPos)`: Scans JSON arrays
- `decode_scanObject(s, startPos)`: Scans JSON objects
- `decode_scanString(s, startPos)`: Scans JSON strings
- `decode_scanNumber(s, startPos)`: Scans JSON numbers
- `decode_scanConstant(s, startPos)`: Scans constants (true, false, null)
- `decode_scanComment(s, startPos)`: Scans and discards comments
- `decode_scanWhitespace(s, startPos)`: Skips whitespace
- `encodeString(s)`: Encodes strings with game-specific escaping
- `encodeString_compliant(s)`: Encodes strings with JSON-compliant escaping
- `isArray(t)`: Determines if a table should be encoded as an array
- `isEncodable(o)`: Checks if an object can be JSON encoded

## String Escaping Differences

### Game Format (encode)
```lua
-- Escapes both single and double quotes
s = string.gsub(s, "'", "\\'")  -- Game-specific
s = string.gsub(s, '"', '\\"')
```

### Compliant Format (encode_compliant)
```lua
-- Only escapes double quotes (JSON standard)
s = string.gsub(s, '"', '\\"')
-- Does not escape single quotes
```

## Array Detection

The module uses specific logic to determine if a table should be encoded as a JSON array:

1. **Array Criteria:**
   - Has indexes 1..n for n items
   - No other encodable data except optional 'n' field
   - All indexed elements must be encodable

2. **Object Otherwise:**
   - Any table not meeting array criteria
   - Encoded as JSON object with key-value pairs

## Error Handling

The module uses `tracked_assert` for error reporting:

- Unterminated strings or objects
- Invalid JSON syntax
- Unsupported data types during encoding
- Malformed numeric values

## Performance Notes

- Uses `table.concat()` for efficient string building during encoding
- Supports comment parsing for flexible JSON input
- Optimized array detection algorithm

## Related Modules

- [fileutil](./fileutil.md): File operations that may use JSON serialization
- [saveindex](./saveindex.md): Save system that relies on JSON encoding
- [networking](./networking.md): Network communication using JSON data

## License

This module is based on JSON4Lua by Craig Mason-Jones, released under the MIT License. The original homepage: http://json.luaforge.net/
