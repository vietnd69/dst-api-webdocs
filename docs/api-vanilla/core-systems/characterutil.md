---
id: characterutil
title: CharacterUtil
description: Utility functions for loading character portraits, avatars, names, and managing character metadata
sidebar_position: 9
slug: /api-vanilla/core-systems/characterutil
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# CharacterUtil

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `CharacterUtil` module provides utility functions for loading and managing character-related assets and metadata in Don't Starve Together. It handles portrait loading, avatar management, character naming, and starting inventory items for both vanilla and mod characters with appropriate fallbacks.

## Usage Example

```lua
-- Load character portrait with skin
local portraitWidget = Image()
local hasOval = SetSkinnedOvalPortraitTexture(portraitWidget, "wilson", "wilson_formal")

-- Get character title
local title = GetCharacterTitle("wilson", "wilson_formal")

-- Load avatar texture location
local atlas, texture = GetCharacterAvatarTextureLocation("wilson")
```

## Functions

### SetSkinnedOvalPortraitTexture(image_widget, character, skin) {#setskinnedovalportraittexture}

**Status:** `stable`

**Description:**
Loads an oval portrait for a character with a specific skin into an image widget. For skinned characters, attempts to load the oval portrait texture and falls back to shield portrait if oval is not available.

**Parameters:**
- `image_widget` (Widget): Target image widget to load texture into
- `character` (string): Character identifier (e.g., "wilson", "wendy")
- `skin` (string): Skin identifier (e.g., "wilson_formal", "wendy_rose")

**Returns:**
- (boolean): `true` if oval portrait was found and loaded, `false` if fallback to shield portrait was used

**Example:**
```lua
local portraitWidget = Image()
local hasOval = SetSkinnedOvalPortraitTexture(portraitWidget, "wilson", "wilson_formal")

if hasOval then
    print("Loaded oval portrait successfully")
else
    print("Fell back to shield portrait")
end
```

**Version History:**
- Current implementation loads from `bigportraits/[portrait_name].xml`

### SetOvalPortraitTexture(image_widget, character) {#setovalportraittexture}

**Status:** `stable`

**Description:**
Loads an oval portrait for a character using their default skin. This is a convenience function that calls SetSkinnedOvalPortraitTexture with the character's default skin.

**Parameters:**
- `image_widget` (Widget): Target image widget to load texture into
- `character` (string): Character identifier

**Returns:**
- (boolean): `true` if oval portrait was found, `false` if fallback to shield portrait was used

**Example:**
```lua
local widget = Image()
local success = SetOvalPortraitTexture(widget, "wilson")
```

**Version History:**
- Automatically appends "_none" for default skin on skinned characters

### SetHeroNameTexture_Grey(image_widget, character) {#sethernametexture-grey}

**Status:** `stable`

**Description:**
Loads the grey variant of a character's name texture into an image widget. This is the standard fallback name texture used for mod characters.

**Parameters:**
- `image_widget` (Widget): Target image widget
- `character` (string): Character identifier

**Returns:**
- (boolean): `true` if texture was found and loaded, `nil` if not found

**Example:**
```lua
local nameWidget = Image()
local loaded = SetHeroNameTexture_Grey(nameWidget, "wilson")
if loaded then
    print("Grey name texture loaded")
end
```

**Version History:**
- Loads from `images/names_[character].xml`

### SetHeroNameTexture_Gold(image_widget, character) {#sethernametexture-gold}

**Status:** `stable`

**Description:**
Loads the gold variant of a character's name texture with localization support. Falls back to grey name texture for mod characters that don't have gold variants.

**Parameters:**
- `image_widget` (Widget): Target image widget
- `character` (string): Character identifier

**Returns:**
- (boolean): `true` if gold texture was loaded, result of grey fallback if gold not available

**Example:**
```lua
local goldNameWidget = Image()
local hasGold = SetHeroNameTexture_Gold(goldNameWidget, "wilson")
```

**Version History:**
- Uses localization suffix from `LOC.GetNamesImageSuffix()`
- Falls back to grey for mod characters

### GetCharacterAvatarTextureLocation(character) {#getcharacteravatartexturelocation}

**Status:** `stable`

**Description:**
Retrieves the atlas and texture paths for a character's avatar image. Handles vanilla characters, mod characters, and special cases with appropriate fallbacks.

**Parameters:**
- `character` (string): Character identifier

**Returns:**
- (string): Atlas file path
- (string): Texture name

**Example:**
```lua
-- Vanilla character
local atlas, texture = GetCharacterAvatarTextureLocation("wilson")
-- Returns: "images/avatars.xml", "avatar_wilson.tex"

-- Mod character
local modAtlas, modTexture = GetCharacterAvatarTextureLocation("modcharacter")
-- Returns mod-specific atlas path and texture name

-- Unknown character
local unknownAtlas, unknownTexture = GetCharacterAvatarTextureLocation("")
-- Returns: "images/avatars.xml", "avatar_unknown.tex"
```

**Version History:**
- Supports `MOD_AVATAR_LOCATIONS` for mod character avatars
- Falls back to "mod" or "unknown" for unregistered characters

### GetCharacterTitle(character, skin) {#getcharactertitle}

**Status:** `stable`

**Description:**
Retrieves the display title for a character, prioritizing skin names over character titles when a skin is specified.

**Parameters:**
- `character` (string): Character identifier
- `skin` (string, optional): Skin identifier

**Returns:**
- (string): Character or skin display title

**Example:**
```lua
-- Get character title
local title = GetCharacterTitle("wilson")
-- Returns: "The Gentleman Scientist"

-- Get skin title  
local skinTitle = GetCharacterTitle("wilson", "wilson_formal")
-- Returns skin-specific name if available, otherwise character title
```

**Version History:**
- Uses `GetSkinName(skin)` when skin is provided
- Falls back to `STRINGS.CHARACTER_TITLES[character]`

### GetKilledByFromMorgueRow(data) {#getkilledbyfrommorguerow}

**Status:** `stable`

**Description:**
Processes morgue data to generate a formatted "killed by" string with proper capitalization and special name remapping for game entities.

**Parameters:**
- `data` (table): Morgue row data containing:
  - `killed_by` (string): Raw killer identifier  
  - `pk` (boolean): Whether it was a player kill
  - `character` (string): Victim character
  - `morgue_random` (number, optional): Random seed for variant selection

**Returns:**
- (string): Formatted killer name with proper capitalization

**Example:**
```lua
-- Standard enemy death
local morgueData = {
    killed_by = "spider",
    pk = false,
    character = "wilson"
}
local killerName = GetKilledByFromMorgueRow(morgueData)
-- Returns: "Spider"

-- Special case - darkness death for Maxwell
local darknessDeath = {
    killed_by = "nil",
    pk = false,
    character = "waxwell"
}
local killer = GetKilledByFromMorgueRow(darknessDeath)
-- Returns: "Charlie"

-- Player kill
local pkDeath = {
    killed_by = "PlayerName",
    pk = true,
    character = "wilson"
}
local pkKiller = GetKilledByFromMorgueRow(pkDeath)
-- Returns: "PlayerName" (unchanged)
```

**Version History:**
- Special mappings: `nil` → "charlie"/"darkness", `unknown` → "shenanigans"
- Random variant selection for "moose" → "moose1"/"moose2"

### GetUniquePotentialCharacterStartingInventoryItems(character, with_bonus_items) {#getuniquepotentialcharacterstartinginventoryitems}

**Status:** `stable`

**Description:**
Retrieves unique starting inventory items for a character, optionally including seasonal and extra bonus items. Removes duplicates and returns a clean list.

**Parameters:**
- `character` (string): Character identifier
- `with_bonus_items` (boolean): Whether to include seasonal/extra items

**Returns:**
- (table): Array of unique item prefab names

**Example:**
```lua
-- Get basic starting items
local basicItems = GetUniquePotentialCharacterStartingInventoryItems("wilson", false)
-- Returns character-specific starting items

-- Get all items including seasonal bonuses
local allItems = GetUniquePotentialCharacterStartingInventoryItems("wilson", true)
-- Includes items from TUNING.EXTRA_STARTING_ITEMS and TUNING.SEASONAL_STARTING_ITEMS

-- Process starting items
for i, item in ipairs(basicItems) do
    local itemName = STRINGS.NAMES[string.upper(item)] or item
    print(string.format("Starting item %d: %s", i, itemName))
end
```

**Version History:**
- Uses `TUNING.GAMEMODE_STARTING_ITEMS` based on server game mode
- Processes seasonal items in alphabetical order via `orderedPairs(SEASONS)`
- Removes duplicates while preserving order

## Constants

The module relies on several global constants:

### DST_CHARACTERLIST

**Description:** List of vanilla DST characters

### MODCHARACTERLIST  

**Description:** List of mod characters registered in the system

### MOD_AVATAR_LOCATIONS

**Description:** Table mapping mod characters to their avatar asset locations

## Related Modules

- [Skins System](../skins/): Character skin management and validation
- [Localization](../localization/): String and asset localization support  
- [UI Widgets](../../widgets/): Image widgets and UI components
- [Mod Support](../mods/): Integration with modded characters
- [Asset Loading](../assets/): File system and texture loading utilities
