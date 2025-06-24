---
id: wordfilter
title: Word Filter
description: Content filtering system for chat and text input validation
sidebar_position: 150
slug: api-vanilla/core-systems/wordfilter
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Word Filter

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `wordfilter` module provides a content filtering system for Don't Starve Together to validate chat messages and text input. It implements both exact match filtering using hashed strings and loose match filtering using encoded patterns to maintain a safe gaming environment.

## Usage Example

```lua
-- The wordfilter is accessed as a data structure, not a module
-- It contains exact_match and loose_match tables for filtering
local wordfilter = require("wordfilter")

-- Access filter data structures
local exact_matches = wordfilter.exact_match
local loose_patterns = wordfilter.loose_match

-- Example usage in chat validation (conceptual)
local function ContainsFilteredContent(message)
    -- Check exact matches using hash lookup
    local message_hash = CalculateHash(message)
    if exact_matches[message_hash] then
        return true
    end
    
    -- Check loose matches using pattern matching  
    for _, pattern in ipairs(loose_patterns) do
        local decoded = DecodeFilterPattern(pattern)
        if string.find(message:lower(), decoded) then
            return true
        end
    end
    
    return false
end
```

## Filter Structure

### Exact Match Filter

**Type:** `table`

**Status:** `stable`

**Description:** A hash-based lookup table for exact string matching. Uses numeric hash keys mapped to boolean values for efficient filtering.

**Actual Data Structure:**
```lua
-- Sample entries from actual wordfilter.lua
exact_match = {
    [3197419846] = true,
    [3197419919] = true,
    [3263511942] = true,
    [3582500414] = true,
    [3644918893] = true,
    [3648592437] = true,
    [4019784033] = true,
    -- ... 200+ additional hash entries
}
```

**Properties:**
- **Total Entries**: 200+ pre-computed hash values
- **Lookup Performance**: O(1) hash table access
- **Storage Efficiency**: Boolean true values indicate filtered content
- **Generated Content**: Automatically generated file with hashed strings
- **Hash Distribution**: Uses 32-bit hash values for collision resistance

### Loose Match Filter

**Type:** `array`

**Status:** `stable`

**Description:** An array of encoded patterns for substring matching against user input.

**Actual Data Structure:**
```lua
-- Complete loose_match array from actual wordfilter.lua
loose_match = {
    'KLEI     1DYml0Y2g=',
    'KLEI     1DY3VudA==',
    'KLEI     1DZmFnZ290',
    'KLEI     1DbmlnZ2E=',
    'KLEI     1DbmlnZ2Vy',
    'KLEI     1Dc2hpdA==',
    'KLEI     1Dd2lnZ2Vy',
    'KLEI     1Dd2hvcmU=',
    'KLEI     1DYXNzaG9sZQ==',
    'KLEI     1DZnVjaw==',
    'KLEI     1DcmV0YXJk',
    'KLEI     1DdjRn',
    'KLEI     1Dd2gwcmU=',
}
```

**Properties:**
- **Pattern Count**: 13 encoded filter patterns
- **Encoding**: Base64 encoded patterns with "KLEI     1D" prefix
- **Functionality**: Supports partial string matching and variations
- **Purpose**: Detects obfuscated content and spelling variations
- **Pattern Format**: `'KLEI     1D' + base64_encoded_pattern`

## Constants

### FILTER_PREFIX

**Value:** `"KLEI     "`

**Status:** `stable`

**Description:** Standard prefix used in loose match patterns to identify filter entries.

## Implementation Details

### Hash-Based Filtering

The exact match system uses numeric hashes for efficient lookup:

```lua
-- Example hash lookup (internal implementation)
local function IsExactMatch(input_hash)
    return wordfilter.exact_match[input_hash] == true
end
```

### Pattern Matching

The loose match system processes encoded patterns:

```lua
-- Example pattern matching (internal implementation)
local function ContainsFilteredPattern(input_text)
    for _, pattern in ipairs(wordfilter.loose_match) do
        local decoded_pattern = DecodeFilterPattern(pattern)
        if string.find(input_text:lower(), decoded_pattern) then
            return true
        end
    end
    return false
end
```

## Security Features

### Content Obfuscation

- **Encoded Patterns**: Filter patterns are base64 encoded to prevent easy circumvention
- **Hash Protection**: Exact matches use numeric hashes rather than plain text
- **Dynamic Validation**: Supports both exact and partial matching strategies

### Performance Optimization

- **O(1) Lookup**: Hash-based exact matching for common cases
- **Minimal Processing**: Encoded patterns reduce memory footprint
- **Efficient Iteration**: Array-based loose matching for pattern scanning

## Usage Patterns

### Chat Message Validation

```lua
-- Typical usage in chat system
local function ValidateChatMessage(message)
    if not wordfilter.PassesFilter(message) then
        return false, "Message contains inappropriate content"
    end
    return true
end
```

### User Input Sanitization

```lua
-- Input validation for user-generated content
local function SanitizeUserInput(input)
    if wordfilter.ContainsFilteredContent(input) then
        return SanitizeString(input)
    end
    return input
end
```

## Integration Points

### Chat System Integration

The word filter integrates with the game's chat system to automatically validate messages before display.

### User Interface Validation

Text input fields utilize the filter system to provide real-time content validation feedback.

## Related Modules

- [Chat History](./chathistory.md): Uses word filter for message validation
- [Console Commands](./consolecommands.md): Applies filtering to command input
- [User Commands](./usercommands.md): Validates user command parameters
