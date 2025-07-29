---
id: stringutil
title: String Utilities
description: Utility functions for string manipulation, character speech, and text formatting in Don't Starve Together
sidebar_position: 3
slug: game-scripts/core-systems/stringutil
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# String Utilities

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `stringutil` module provides a comprehensive set of utility functions for string manipulation, character speech generation, and text formatting in Don't Starve Together. This module handles character-specific dialogue, special speech effects, string formatting operations, and text searching capabilities. It serves as the bridge between the raw string data and the dynamic speech system used throughout the game.

## Usage Example

```lua
-- Get character-specific string
local dialogue = GetString(inst, "DESCRIBE", "TREE")

-- Get character description with localization
local desc = GetCharacterDescription("wilson")

-- Format time display
local time_str = str_seconds(125) -- "2:05"

-- Create ghost speech
local ghost_speech = CraftOooh() -- "Oooooh... Oooohh!"
```

## Character Speech Functions

### GetString(inst, stringtype, modifier, nil_missing) {#get-string}

**Status:** `stable`

**Description:**
Retrieves character-specific strings with fallback support. This is the primary function for getting dialogue text based on character, string type, and optional modifiers.

**Parameters:**
- `inst` (table|string): Character instance or prefab name
- `stringtype` (string): Type of string to retrieve (e.g., "DESCRIBE", "ACTIONFAIL")
- `modifier` (string|table|nil): Optional modifier for specific variants
- `nil_missing` (boolean|nil): If true, returns nil for missing strings instead of error message

**Returns:**
- (string|nil): The requested string or fallback text

**Example:**
```lua
-- Get Wilson's description of a tree
local tree_desc = GetString("wilson", "DESCRIBE", "TREE")

-- Get generic action failure
local fail_msg = GetString(inst, "ACTIONFAIL", "GENERIC")

-- Handle special characters (ghost, mime)
local ghost_msg = GetString(ghost_player, "DESCRIBE", "FLOWER") -- Returns "Oooooh..."
```

### GetDescription(inst, item, modifier) {#get-description}

**Status:** `stable`

**Description:**
Gets character-specific examination text for items with additional context like repair status and food memory.

**Parameters:**
- `inst` (table|string): Character instance or prefab name
- `item` (table): Item being examined
- `modifier` (string|table|nil): Optional modifier for variants

**Returns:**
- (string): Description text or fallback

**Example:**
```lua
-- Get item description
local desc = GetDescription(wilson_player, axe_item)

-- Description with modifier
local desc = GetDescription(inst, item, "BURNT")

-- Includes special cases like repair status
local broken_desc = GetDescription(inst, broken_item) -- Adds repair notification
```

### GetCharacterDescription(herocharacter) {#get-character-description}

**Status:** `stable`

**Description:**
Retrieves character description with game mode and localization support.

**Parameters:**
- `herocharacter` (string): Character prefab name

**Returns:**
- (string): Character description text

**Example:**
```lua
-- Basic character description
local wilson_desc = GetCharacterDescription("wilson")

-- Handles special cases for Woodie based on country
local woodie_desc = GetCharacterDescription("woodie") -- "woodie_canada" or "woodie_us"

-- Game mode specific descriptions
local arena_desc = GetCharacterDescription("wilson") -- Uses LAVAARENA_CHARACTER_DESCRIPTIONS if in Lava Arena
```

### GetActionFailString(inst, action, reason) {#get-action-fail-string}

**Status:** `stable`

**Description:**
Gets character-specific messages when actions fail.

**Parameters:**
- `inst` (table|string): Character instance or prefab name
- `action` (string): Action that failed
- `reason` (string): Reason for failure

**Returns:**
- (string): Action failure message

**Example:**
```lua
-- Get action failure message
local fail_msg = GetActionFailString(inst, "CHOP", "TOOFAR")

-- Generic failure
local generic_fail = GetActionFailString(inst, "GENERIC", "WRONGTOOL")
```

### GetSpecialCharacterString(character) {#get-special-character-string}

**Status:** `stable`

**Description:**
Generates special speech for specific character types like ghosts, mimes, and monkeys.

**Parameters:**
- `character` (string): Special character type ("ghost", "mime", "wonkey", "wilton")

**Returns:**
- (string|nil): Generated speech or nil if not a special character

**Example:**
```lua
-- Ghost speech
local ghost_speech = GetSpecialCharacterString("ghost") -- "Oooooooh... Oooohh!"

-- Mime speech (empty)
local mime_speech = GetSpecialCharacterString("mime") -- ""

-- Monkey speech
local monkey_speech = GetSpecialCharacterString("wonkey") -- "Ook ook ooook!"
```

## Speech Generation Functions

### CraftOooh() {#craft-oooh}

**Status:** `stable`

**Description:**
Generates randomized ghost speech using "Oooh" variations with random punctuation and spacing.

**Returns:**
- (string): Generated ghost speech

**Example:**
```lua
local ghost_speech = CraftOooh()
-- Possible outputs:
-- "Oooooh... Oooohh!"
-- "Ooooo. Oooooh?"
-- "Ooooooh, oooh!"
```

### CraftGiberish() {#craft-giberish}

**Status:** `stable`

**Description:**
Creates randomized gibberish speech using predefined syllable components.

**Returns:**
- (string): Generated gibberish text

**Example:**
```lua
local gibberish = CraftGiberish()
-- Uses STRINGS.GIBERISH_PRE and STRINGS.GIBERISH_PST arrays
-- Example output: "Blort fleep grargh!"
```

### CraftMonkeySpeech() {#craft-monkey-speech}

**Status:** `stable`

**Description:**
Generates monkey-style speech for cursed characters, but only if the current player is not already a monkey.

**Returns:**
- (string|nil): Generated monkey speech or nil if player is a monkey

**Example:**
```lua
local monkey_speech = CraftMonkeySpeech()
-- Uses STRINGS.MONKEY_SPEECH_PRE and STRINGS.MONKEY_SPEECH_PST
-- Example output: "Ook ook ooook!"
-- Returns nil if ThePlayer:HasTag("wonkey")
```

### Umlautify(string) {#umlautify}

**Status:** `stable`

**Description:**
Converts 'o' characters to 'ö' for Wigfrid's speech pattern if the Wathgrithr font is enabled.

**Parameters:**
- `string` (string): Input string to convert

**Returns:**
- (string): String with umlauts applied or original string

**Example:**
```lua
local wigfrid_text = Umlautify("I love food!")
-- Output: "I löve föod!" (if Wigfrid font enabled)
-- Output: "I love food!" (if font disabled)

-- Prevents consecutive umlauts
local text = Umlautify("good") -- "göod" not "göod"
```

## String Manipulation Functions

### FirstToUpper(str) {#first-to-upper}

**Status:** `stable`

**Description:**
Capitalizes the first letter of a string.

**Parameters:**
- `str` (string): Input string

**Returns:**
- (string): String with first letter capitalized

**Example:**
```lua
local capitalized = FirstToUpper("hello world") -- "Hello world"
local already_cap = FirstToUpper("Already") -- "Already"
```

### TrimString(s) {#trim-string}

**Status:** `stable`

**Description:**
Removes leading and trailing whitespace from a string.

**Parameters:**
- `s` (string): Input string to trim

**Returns:**
- (string): Trimmed string

**Example:**
```lua
local trimmed = TrimString("  hello world  ") -- "hello world"
local empty = TrimString("   ") -- ""
```

### subfmt(s, tab) {#subfmt}

**Status:** `stable`

**Description:**
Performs template substitution using curly brace placeholders.

**Parameters:**
- `s` (string): Template string with `{key}` placeholders
- `tab` (table): Table of key-value pairs for substitution

**Returns:**
- (string): String with substitutions applied

**Example:**
```lua
local template = "Hello {name}, you have {count} items!"
local result = subfmt(template, {name = "Wilson", count = "5"})
-- Output: "Hello Wilson, you have 5 items!"

-- Unmatched placeholders remain unchanged
local partial = subfmt("Hello {name} and {unknown}", {name = "Willow"})
-- Output: "Hello Willow and {unknown}"
```

## Time and Date Formatting

### str_seconds(time) {#str-seconds}

**Status:** `stable`

**Description:**
Formats time in seconds to MM:SS or HH:MM:SS format.

**Parameters:**
- `time` (number): Time in seconds

**Returns:**
- (string): Formatted time string

**Example:**
```lua
local short_time = str_seconds(125) -- "02:05"
local long_time = str_seconds(3665) -- "1:01:05"
local zero_time = str_seconds(5) -- "00:05"
```

### str_date(os_time) {#str-date}

**Status:** `stable`

**Description:**
Formats OS timestamp to readable date string.

**Parameters:**
- `os_time` (number): OS timestamp

**Returns:**
- (string): Formatted date string

**Example:**
```lua
local date_str = str_date(os.time())
-- Output format: "Dec 25, 2023" (uses STRINGS.UI.DATE_FORMAT.MDY)
```

### str_play_time(time) {#str-play-time}

**Status:** `stable`

**Description:**
Formats playtime in minutes to human-readable format with days, hours, and minutes.

**Parameters:**
- `time` (number): Playtime in minutes

**Returns:**
- (string): Formatted playtime string

**Example:**
```lua
local short_play = str_play_time(45) -- "45m"
local medium_play = str_play_time(150) -- "2h 30m"
local long_play = str_play_time(2000) -- "1d 9h 20m"
```

## Search and Comparison Functions

### DamLevDist(a, b, limit) {#dam-lev-dist}

**Status:** `stable`

**Description:**
Calculates Damerau-Levenshtein distance between two strings with an optimization limit.

**Parameters:**
- `a` (string): First string
- `b` (string): Second string
- `limit` (number): Maximum distance to calculate before early return

**Returns:**
- (number): Edit distance between strings

**Example:**
```lua
local distance = DamLevDist("kitten", "sitting", 5) -- 3
local too_far = DamLevDist("cat", "elephant", 2) -- Returns early > 2

-- Used for fuzzy string matching
local close = DamLevDist("wilson", "wilsn", 2) -- 1 (one deletion)
```

### GetMortalityStringFor(target) {#get-mortality-string-for}

**Status:** `stable`

**Description:**
Gets mortality-related strings for specific targets.

**Parameters:**
- `target` (table|nil): Target entity

**Returns:**
- (string): Mortality string or default

**Example:**
```lua
local mortality = GetMortalityStringFor(player_entity)
-- Returns specific string from STRINGS.UI.MORTALITYSTRINGS based on prefab
-- Falls back to STRINGS.UI.MORTALITYSTRINGS.DEFAULT
```

## Internal Helper Functions

### getmodifiedstring(topic_tab, modifier) {#getmodifiedstring}

**Status:** `stable`

**Description:**
Internal function that handles string retrieval with modifiers, supporting both string and table modifiers.

**Parameters:**
- `topic_tab` (table): Table containing strings
- `modifier` (string|table|nil): Modifier to apply

**Returns:**
- (string|nil): Modified string or nil

### getcharacterstring(tab, item, modifier) {#getcharacterstring}

**Status:** `stable`

**Description:**
Internal function for retrieving character-specific strings with case normalization.

**Parameters:**
- `tab` (table): Character string table
- `item` (string): String key to look up
- `modifier` (string|table|nil): Optional modifier

**Returns:**
- (string|nil): Character string or nil

### GetDescription_AddSpecialCases(ret, charactertable, inst, item, modifier) {#get-description-add-special-cases}

**Status:** `stable`

**Description:**
Internal function that adds special case annotations to item descriptions (repair status, food memory, shadow magic compatibility).

**Parameters:**
- `ret` (string|nil): Existing description string
- `charactertable` (table): Character's string table
- `inst` (table): Character instance
- `item` (table): Item being described
- `modifier` (string|table|nil): Optional modifier

**Returns:**
- (string|nil): Description with special cases added

## Integration with Game Systems

### Character Speech Proxy Support

The module supports speech proxy systems where characters can use different speech sets:

```lua
-- Character using speech proxy
if inst.components.talker and inst.components.talker.speechproxy then
    character = inst.components.talker.speechproxy
end
```

### Special Character Detection

Automatic detection and handling of special character states:

```lua
-- Detects ghost, mime, and other special states
local specialcharacter =
    type(inst) == "table"
    and ((inst:HasTag("mime") and "mime") or
        (inst:HasTag("playerghost") and "ghost"))
    or character
```

### Game Mode Integration

Character descriptions adapt to current game mode:

```lua
-- Different descriptions for different game modes
if TheNet:GetServerGameMode() == "lavaarena" then
    return STRINGS.LAVAARENA_CHARACTER_DESCRIPTIONS[herocharacter]
elseif TheNet:GetServerGameMode() == "quagmire" then
    return STRINGS.QUAGMIRE_CHARACTER_DESCRIPTIONS[herocharacter]
end
```

## Common Usage Patterns

### Safe String Retrieval

```lua
-- Get string with fallback
local function GetSafeCharacterString(character, stringtype, modifier)
    return GetString(character, stringtype, modifier, true) 
           or "Default message"
end
```

### Character-Specific Dialogue

```lua
-- Get character reaction to item
local function GetCharacterReaction(character_inst, item)
    return GetDescription(character_inst, item) 
           or "I don't know what to make of this."
end
```

### Formatted Time Display

```lua
-- Display game time
local function DisplayGameTime(seconds)
    if seconds > 3600 then
        return str_seconds(seconds) -- Shows hours
    else
        return str_seconds(seconds) -- Shows minutes:seconds
    end
end
```

### Dynamic Speech Generation

```lua
-- Generate appropriate speech for character state
local function GenerateCharacterSpeech(inst)
    if inst:HasTag("playerghost") then
        return CraftOooh()
    elseif inst:HasTag("mime") then
        return "" -- Mimes don't speak
    elseif inst:HasTag("wonkey") then
        return CraftMonkeySpeech()
    else
        return GetString(inst, "GENERIC", nil)
    end
end
```

## Version History

The stringutil module has evolved to support:
- Character-specific dialogue systems
- Special character speech effects
- Multi-language string handling
- Game mode adaptations
- Advanced string search capabilities
- Time and date formatting utilities

## Related Modules

- [Strings](./strings.md): Provides the raw string data used by these utilities
- [Talker Component](../components/talker.md): Uses these functions for character speech
- [Speech Files](../languages/index.md): Character-specific dialogue definitions
- [UI System](../screens/index.md): Uses formatting functions for display text
