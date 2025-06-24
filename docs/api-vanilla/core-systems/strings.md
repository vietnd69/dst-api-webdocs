---
id: strings
title: Strings
description: Global string table system for all user-facing text and localization in Don't Starve Together
sidebar_position: 127
slug: api-vanilla/core-systems/strings
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Strings

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `strings` module defines the global `STRINGS` table that contains all user-facing text used throughout Don't Starve Together. This comprehensive system manages character information, UI text, action descriptions, item names, NPC dialogue, and localization support. The module serves as the central repository for all string data that can be localized into different languages.

## Usage Example

```lua
-- Access character names
print(STRINGS.CHARACTER_NAMES.wilson) -- "Wilson P. Higgsbury"

-- Access action text
print(STRINGS.ACTIONS.CHOP) -- "Chop"

-- Access item descriptions
print(STRINGS.NAMES.axe) -- "Axe"

-- Access character quotes
print(STRINGS.CHARACTER_QUOTES.willow) -- "All will bathe in the prettiest of flames."
```

## Global Variables

### STRINGS

**Type:** `table`

**Status:** `stable`

**Description:** The main global table containing all string data organized into categorized sections.

### GENDERSTRINGS

**Type:** `table`

**Status:** `stable`

**Description:** Table containing gender-specific string variations for different languages.

### MORTALITYSTRINGS

**Type:** `table`

**Status:** `stable`

**Description:** Table containing mortality-related string variations.

## Character Information

### STRINGS.CHARACTER_NAMES

**Type:** `table`

**Status:** `stable`

**Description:** Maps character internal names to their display names.

**Example:**
```lua
-- Character display names
STRINGS.CHARACTER_NAMES = {
    wilson = "Wilson P. Higgsbury",
    willow = "Willow",
    wendy = "Wendy",
    wolfgang = "Wolfgang",
    -- ... other characters
}
```

### STRINGS.CHARACTER_QUOTES

**Type:** `table`

**Status:** `stable`

**Description:** Contains signature quotes for each character.

**Example:**
```lua
-- Character quotes
STRINGS.CHARACTER_QUOTES = {
    wilson = "I'll conquer this world with the power of my MIND!",
    willow = "All will bathe in the prettiest of flames.",
    wendy = "Abigail? Come back! I'm not done playing with you.",
    -- ... other characters
}
```

### STRINGS.CHARACTER_TITLES

**Type:** `table`

**Status:** `stable`

**Description:** Contains character titles/subtitles.

**Example:**
```lua
-- Character titles
STRINGS.CHARACTER_TITLES = {
    wilson = "The Gentleman Scientist",
    willow = "The Firestarter",
    wendy = "The Bereaved",
    wolfgang = "The Strongman",
    -- ... other characters
}
```

### STRINGS.CHARACTER_DESCRIPTIONS

**Type:** `table`

**Status:** `stable`

**Description:** Contains bullet-point descriptions of character perks and quirks.

**Example:**
```lua
-- Character descriptions
STRINGS.CHARACTER_DESCRIPTIONS = {
    wilson = "*Grows a magnificent beard",
    willow = "*Has a fondness for fire, but hates the cold \n*Protected by her cuddly bear, Bernie\n*Has a reliable lighter",
    wendy = "*Is haunted by her twin sister \n*Feels comfortable in the dark \n*Dabbles in Ectoherbology \n*Doesn't hit very hard",
    -- ... other characters
}
```

## Action System

### STRINGS.ACTIONS

**Type:** `table`

**Status:** `stable`

**Description:** Contains all action text displayed when hovering over interactable objects.

**Example:**
```lua
-- Basic actions
STRINGS.ACTIONS = {
    CHOP = "Chop",
    MINE = "Mine",
    PICKUP = {
        GENERIC = "Pick up",
        HEAVY = "Carry",
    },
    GIVE = {
        GENERIC = "Give",
        NOTREADY = "Place",
        READY = "Sacrifice",
    },
    -- ... many more actions
}
```

## Item Names and Descriptions

### STRINGS.NAMES

**Type:** `table`

**Status:** `stable`

**Description:** Contains display names for all items, prefabs, and objects in the game.

**Example:**
```lua
-- Item names
local axe_name = STRINGS.NAMES.axe -- "Axe"
local campfire_name = STRINGS.NAMES.campfire -- "Campfire"
```

### STRINGS.RECIPE_DESC

**Type:** `table`

**Status:** `stable`

**Description:** Contains descriptions for craftable recipes.

**Example:**
```lua
-- Recipe descriptions
local axe_desc = STRINGS.RECIPE_DESC.axe -- "Chop down trees efficiently."
```

## Localization Support

### UTF-8 Formatting

**Status:** `stable`

**Description:** The strings system supports UTF-8 characters including custom font characters using Unicode private use areas.

**Character Ranges:**
- **Controller buttons**: U+E000 to U+E0FF (238 prefix)
- **Non-controller buttons**: U+E100 to U+E1FF (239 prefix)  
- **Emoji characters**: U+F0000 to U+FFFFD (243 prefix)

**Example:**
```lua
-- Custom font characters
STRINGS.UI.CONTROLSSCREEN.INPUTS[1].LMB = "\238\132\128" -- Left mouse button icon
STRINGS.UI.CONTROLSSCREEN.INPUTS[1].RMB = "\238\132\129" -- Right mouse button icon
```

### Translation Support

**Status:** `stable`

**Description:** The module includes infrastructure for translation through PO files.

**Translation Files:**
- `strings.pot` - Template file for translators
- `languages/*.po` - Individual language translation files

**Example:**
```lua
-- Translation notice in file header
--[[
***************************************************************
*** NOTICE TO TRANSLATORS: DO NOT EDIT THIS FILE DIRECTLY! ***

We have provided a standard PO file to translation in /scripts/languages/strings.pot
To add a new language:
- Use a PO editor such as POEdit to translate strings.pot
- Load your own PO file under /scripts/languages/language.lua
***************************************************************
]]
```

## NPC Dialogue

### Merm Dialogue

**Type:** `table`

**Status:** `stable`

**Description:** Contains dialogue strings for Merm NPCs with both English and Merm language versions.

**Example:**
```lua
STRINGS.MERM_TALK_HELP_CHOP_WOOD = {
    {"Will come with you.", "Flort glut."}, 
    {"Make Mermfolk strong!", "Blut gloppy Glurtsu!"}, 
    {"Chop, choppy, chop!", "Grop, groppy, grop!"}
}
```

### Pig Dialogue

**Type:** `table`

**Status:** `stable`

**Description:** Contains dialogue strings for Pig NPCs.

**Example:**
```lua
STRINGS.PIG_TALK_FOLLOWWILSON = { 
    "YOU FRIEND", 
    "I LOVE FRIEND", 
    "YOU IS GOOD", 
    "I FOLLOW!" 
}
```

### Hermit Crab Dialogue

**Type:** `table`

**Status:** `stable`

**Description:** Contains dialogue strings for the Hermit Crab NPC.

**Example:**
```lua
STRINGS.HERMITCRAB_GREETING = {
    "Oh! A visitor!",
    "I don't get many of those.",
    "Welcome to my little island."
}
```

## Special Features

### Anti-Addiction Messages

**Type:** `table`

**Status:** `stable`

**Description:** Contains messages displayed to promote healthy gaming habits.

**Example:**
```lua
STRINGS.ANTIADDICTION = {
    HOUR_1 = "You've played for one hour.",
    HOUR_2 = "You've played for two hours.",
    HOUR_3 = "You've played for three hours.",
    HOUR_X = "You've played for several hours.",
    EXIT_SOON = "Your time for today is up. Please exit."
}
```

### Wet Item Prefixes

**Type:** `table`

**Status:** `stable`

**Description:** Contains prefixes for items when they become wet.

**Example:**
```lua
STRINGS.WET_PREFIX = {
    GENERIC = "Wet",
    EMPTY = "Damp"
}
```

## Functions

### GetString(category, key, ...)

**Status:** `stable`

**Description:** Helper function to safely retrieve strings with fallback support.

**Parameters:**
- `category` (string): The category within STRINGS table
- `key` (string): The specific string key
- `...`: Additional parameters for string formatting

**Returns:**
- (string): The requested string or a fallback message

**Example:**
```lua
local name = GetString("NAMES", "axe") -- "Axe"
local action = GetString("ACTIONS", "CHOP") -- "Chop"
```

## Integration with Other Systems

### Mod Support

The strings system can be extended by mods to add custom text:

```lua
-- Mod adding custom strings
STRINGS.NAMES.mymoditem = "My Custom Item"
STRINGS.RECIPE_DESC.mymoditem = "A special item added by my mod."
STRINGS.ACTIONS.MYACTION = "Do Custom Action"
```

### Character Speech Integration

The strings system integrates with character speech systems:

```lua
-- Character-specific speech file integration
require("speech_wilson")  -- Loads Wilson's dialogue
require("speech_willow")  -- Loads Willow's dialogue
```

## Development Notes

### PO File Generation

**Status:** `stable`

**Description:** The system includes tools for generating translation template files.

**Command:**
```bash
# From scripts folder
..\..\tools\LUA\lua.exe createstringspo.lua
```

### String Organization

The strings are organized into logical categories:
- **Character Data**: Names, quotes, descriptions, bios
- **UI Text**: Menus, buttons, notifications
- **Action Text**: Interaction prompts
- **Item Data**: Names and descriptions
- **NPC Dialogue**: Conversation text
- **Game Events**: Special announcements

## Common Usage Patterns

### Accessing Character Information
```lua
-- Get character display name
local char_name = STRINGS.CHARACTER_NAMES[character_key]

-- Get character description
local char_desc = STRINGS.CHARACTER_DESCRIPTIONS[character_key]

-- Get character quote
local char_quote = STRINGS.CHARACTER_QUOTES[character_key]
```

### Building UI Text
```lua
-- Create action prompt
local prompt = STRINGS.ACTIONS.PICKUP.GENERIC -- "Pick up"

-- Create item tooltip
local item_name = STRINGS.NAMES[item_prefab]
local tooltip = "Press " .. STRINGS.UI.CLICK .. " to " .. prompt .. " " .. item_name
```

### Localization-Safe String Access
```lua
-- Safe string access with fallback
local function GetSafeString(category, key, fallback)
    if STRINGS[category] and STRINGS[category][key] then
        return STRINGS[category][key]
    end
    return fallback or "MISSING STRING"
end
```

## Related Modules

- [Speech System](./speech.md): Uses character quotes and dialogue
- [Actions](./actions.md): Integrates with action string definitions
- [UI System](../screens/index.md): Displays localized text from strings
- [Prefabs](./prefabs.md): Use item names and descriptions from strings

## Version History

The strings system has evolved to support:
- Multi-language localization
- Character dialogue expansion
- UI text standardization
- Custom font character support
- Mod integration capabilities
