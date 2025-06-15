---
id: string
title: String Utilities
sidebar_position: 3
last_updated: 2023-07-06
---

# String Utilities

String manipulation and text processing functions for Don't Starve Together modding.

## Standard String Functions

These functions are part of the standard Lua string library and are commonly used in DST modding:

### Basic Operations

```lua
-- Get string length
local length = string.len(str)

-- Convert to uppercase/lowercase
local upper = string.upper(str)
local lower = string.lower(str)

-- Substring
local sub = string.sub(str, start, end)  -- end is optional

-- Replace text
local new_str = string.gsub(str, pattern, replacement)

-- Find pattern in string
local pos = string.find(str, pattern)

-- Format string
local formatted = string.format("%s has %d health", name, health)
```

## Don't Starve Together String Utilities

The game provides additional utility functions for string manipulation:

### Text Formatting

```lua
-- Convert first character to uppercase
local capitalized = FirstToUpper(str)

-- Trim whitespace from a string
local trimmed = TrimString(str)

-- Format with named parameters
local text = subfmt("This is {adjective} with {number} things", {
    adjective = "awesome",
    number = 5
})
```

### Time and Date Formatting

```lua
-- Format seconds into MM:SS or HH:MM:SS
local time_str = str_seconds(total_seconds)

-- Format date from timestamp
local date_str = str_date(os_time)

-- Format playtime into days, hours, minutes
local play_time = str_play_time(total_minutes)
```

### Text Processing

```lua
-- Calculate Damerau-Levenshtein distance (for fuzzy matching)
local distance = DamLevDist(string1, string2, limit)

-- Search for subwords
local found = string_search_subwords(search, str, sub_len, limit)
```

### Game-Specific Text Functions

```lua
-- Get character-specific strings
local description = GetString(character, stringtype, modifier)

-- Get description for an item
local desc = GetDescription(character, item, modifier)

-- Get character description
local char_desc = GetCharacterDescription(character_name)

-- Get action fail message
local fail_msg = GetActionFailString(character, action, reason)
```

## Common Use Cases

### Character Dialog

```lua
-- Get character-specific response
local speech = GetString(inst, "DESCRIBE", item.prefab)

-- Handle special character speech
if inst:HasTag("playerghost") then
    -- Ghost will speak in "Oooh" sounds
    return ProcessString(inst)
end
```

### Text Manipulation

```lua
-- Create a safe string for file names
local function MakeSafeFilename(name)
    -- Replace invalid characters
    name = string.gsub(name, "[%p%c%s]", "_")
    -- Trim and convert to lowercase
    return TrimString(string.lower(name))
end

-- Format time display
local function FormatTimeDisplay(seconds)
    if seconds >= 3600 then
        -- Format as hours:minutes:seconds
        return str_seconds(seconds)
    else
        -- Format as minutes:seconds
        local mins = math.floor(seconds / 60)
        local secs = seconds % 60
        return string.format("%d:%02d", mins, secs)
    end
end
```

### Message Formatting

```lua
-- Format message with player information
local function FormatWelcomeMessage(player)
    local name = player.name
    local character = player.prefab
    local days_survived = player.components.age:GetAgeInDays()
    
    return subfmt("Welcome {name}! You're playing as {character} and have survived for {days} days.", {
        name = name,
        character = FirstToUpper(character),
        days = math.floor(days_survived)
    })
end
```

### String Matching

```lua
-- Check if input approximately matches a command
local function MatchesCommand(input, command, tolerance)
    tolerance = tolerance or 2
    return DamLevDist(string.lower(input), string.lower(command), tolerance) <= tolerance
end

-- Find closest match from a list
local function FindClosestMatch(input, list, tolerance)
    local best_match = nil
    local best_dist = tolerance or 3
    
    for _, item in ipairs(list) do
        local dist = DamLevDist(string.lower(input), string.lower(item), best_dist)
        if dist < best_dist then
            best_match = item
            best_dist = dist
        end
    end
    
    return best_match
end
``` 
