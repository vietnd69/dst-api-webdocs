---
title: "CharacterUtil"
description: "Utility functions for loading and managing character data, portraits, avatars, and metadata"
sidebar_position: 9
slug: /api-vanilla/core-systems/characterutil
last_updated: "2024-01-15"
build_version: "675312"
change_status: "stable"
---

# CharacterUtil System

The **CharacterUtil** module provides essential utility functions for loading and managing character-related data including portraits, avatars, names, titles, and starting inventory items. This system handles both vanilla characters and mod characters with appropriate fallbacks.

## Overview

CharacterUtil serves as the primary interface for character asset loading and metadata retrieval in Don't Starve Together. It manages the complexities of skinned vs non-skinned characters, localization, and mod character integration while providing a consistent API for UI systems.

## Version History

| Version | Changes | Status |
|---------|---------|--------|
| 675312  | Current stable implementation | 🟢 **Stable** |
| Earlier | Initial character utility implementation | - |

## Core Functions

### Portrait Management

#### SetSkinnedOvalPortraitTexture(image_widget, character, skin)
Loads an oval portrait for a character with a specific skin into an image widget.

```lua
function SetSkinnedOvalPortraitTexture(image_widget, character, skin) -> boolean
```

**Parameters:**
- `image_widget` (Widget): Target image widget to load texture into
- `character` (string): Character identifier (e.g., "wilson", "wendy")
- `skin` (string): Skin identifier (e.g., "wilson_formal", "wendy_rose")

**Returns:**
- `boolean`: `true` if oval portrait was found, `false` if fallback to shield portrait

**Usage:**
```lua
-- Load Wilson's formal skin portrait
local portraitWidget = self:AddChild(Image())
local hasOval = SetSkinnedOvalPortraitTexture(portraitWidget, "wilson", "wilson_formal")

if hasOval then
    print("Loaded oval portrait successfully")
else
    print("Fell back to shield portrait")
end
```

#### SetOvalPortraitTexture(image_widget, character)
Loads an oval portrait for a character using their default skin.

```lua
function SetOvalPortraitTexture(image_widget, character) -> boolean
```

**Parameters:**
- `image_widget` (Widget): Target image widget to load texture into
- `character` (string): Character identifier

**Returns:**
- `boolean`: `true` if oval portrait was found, `false` if fallback used

**Usage:**
```lua
-- Load character's default portrait
local widget = Image()
local success = SetOvalPortraitTexture(widget, "wilson")
```

### Name Texture Management

#### SetHeroNameTexture_Grey(image_widget, character)
Loads grey variant of character name texture.

```lua
function SetHeroNameTexture_Grey(image_widget, character) -> boolean
```

**Parameters:**
- `image_widget` (Widget): Target image widget
- `character` (string): Character identifier

**Returns:**
- `boolean`: `true` if texture was found and loaded

**Usage:**
```lua
-- Load grey character name
local nameWidget = Image()
local loaded = SetHeroNameTexture_Grey(nameWidget, "wilson")
```

#### SetHeroNameTexture_Gold(image_widget, character)
Loads gold variant of character name texture with localization support.

```lua
function SetHeroNameTexture_Gold(image_widget, character) -> boolean
```

**Parameters:**
- `image_widget` (Widget): Target image widget
- `character` (string): Character identifier

**Returns:**
- `boolean`: `true` if gold texture loaded, falls back to grey for mod characters

**Usage:**
```lua
-- Load gold character name (falls back to grey for mods)
local goldNameWidget = Image()
local hasGold = SetHeroNameTexture_Gold(goldNameWidget, "wilson")
```

### Avatar Management

#### GetCharacterAvatarTextureLocation(character)
Retrieves atlas and texture paths for character avatar images.

```lua
function GetCharacterAvatarTextureLocation(character) -> (string, string)
```

**Parameters:**
- `character` (string): Character identifier

**Returns:**
- `string`: Atlas file path
- `string`: Texture name

**Usage:**
```lua
-- Get avatar texture location
local atlas, texture = GetCharacterAvatarTextureLocation("wilson")
-- atlas: "images/avatars.xml"
-- texture: "avatar_wilson.tex"

-- For mod characters
local modAtlas, modTexture = GetCharacterAvatarTextureLocation("modcharacter")
-- Falls back to appropriate mod avatar location
```

### Character Metadata

#### GetCharacterTitle(character, skin)
Retrieves the display title for a character, prioritizing skin names over character titles.

```lua
function GetCharacterTitle(character, skin) -> string
```

**Parameters:**
- `character` (string): Character identifier
- `skin` (string, optional): Skin identifier

**Returns:**
- `string`: Character or skin display title

**Usage:**
```lua
-- Get character title
local title = GetCharacterTitle("wilson") 
-- Returns: "The Gentleman Scientist"

-- Get skin title
local skinTitle = GetCharacterTitle("wilson", "wilson_formal")
-- Returns: skin-specific name if available
```

### Morgue System

#### GetKilledByFromMorgueRow(data)
Processes morgue data to generate formatted "killed by" text with proper capitalization and name remapping.

```lua
function GetKilledByFromMorgueRow(data) -> string
```

**Parameters:**
- `data` (table): Morgue row data containing:
  - `killed_by` (string): Raw killer identifier
  - `pk` (boolean): Whether it was player kill
  - `character` (string): Victim character
  - `morgue_random` (number, optional): Random seed for variant selection

**Returns:**
- `string`: Formatted killer name with proper capitalization

**Usage:**
```lua
-- Process morgue data
local morgueData = {
    killed_by = "spider",
    pk = false,
    character = "wilson"
}

local killerName = GetKilledByFromMorgueRow(morgueData)
-- Returns: "Spider" (properly capitalized)

-- Special cases
local darknessDeath = {
    killed_by = "nil",
    character = "waxwell"
}
local killerName2 = GetKilledByFromMorgueRow(darknessDeath)
-- Returns: "Charlie" (special mapping for Maxwell/Winona)
```

### Starting Inventory

#### GetUniquePotentialCharacterStartingInventoryItems(character, with_bonus_items)
Retrieves unique starting inventory items for a character, optionally including seasonal bonuses.

```lua
function GetUniquePotentialCharacterStartingInventoryItems(character, with_bonus_items) -> table
```

**Parameters:**
- `character` (string): Character identifier
- `with_bonus_items` (boolean): Whether to include seasonal/extra items

**Returns:**
- `table`: Array of unique item prefab names

**Usage:**
```lua
-- Get basic starting items
local basicItems = GetUniquePotentialCharacterStartingInventoryItems("wilson", false)
-- Returns: {"flint", "twigs"} (example)

-- Get all items including seasonal bonuses
local allItems = GetUniquePotentialCharacterStartingInventoryItems("wilson", true)
-- Returns: {"flint", "twigs", "winter_ornament", "..."}

-- Check what a character starts with
for _, item in ipairs(basicItems) do
    print("Wilson starts with:", item)
end
```

## Character Type Handling

### Vanilla Characters
Standard DST characters from `DST_CHARACTERLIST`:
- Full portrait and avatar support
- Localized name textures
- Standard starting inventories

### Mod Characters
Characters from `MODCHARACTERLIST`:
- Custom avatar locations via `MOD_AVATAR_LOCATIONS`
- Fallback to grey name textures
- Custom starting inventories

### Special Cases
- **"random"**: Treated as special character for UI purposes
- **Unknown characters**: Fallback to "mod" or "unknown" avatars
- **Empty names**: Safe handling with fallbacks

## Asset Path Conventions

### Portrait Assets
```lua
-- Skinned oval portraits
"bigportraits/[portrait_name].xml" -> "[portrait_name]_oval.tex"

-- Fallback shield portraits  
"bigportraits/[character].xml" -> "[character].tex"
```

### Name Textures
```lua
-- Grey names
"images/names_[character].xml" -> "[character].tex"

-- Gold names (localized)
"images/names_gold[suffix]_[character].xml" -> "[character].tex"
```

### Avatar Assets
```lua
-- Vanilla avatars
"images/avatars.xml" -> "avatar_[character].tex"

-- Mod avatars
"[mod_location]avatar_[character].xml" -> "avatar_[character].tex"
```

## Usage Examples

### Character Selection UI
```lua
local function CreateCharacterButton(character, skin)
    local button = Button()
    
    -- Set portrait
    local portrait = button:AddChild(Image())
    SetSkinnedOvalPortraitTexture(portrait, character, skin)
    
    -- Set name
    local nameImage = button:AddChild(Image())
    SetHeroNameTexture_Gold(nameImage, character)
    
    -- Set title
    local title = GetCharacterTitle(character, skin)
    local titleText = button:AddChild(Text(DEFAULTFONT, 20, title))
    
    return button
end
```

### Morgue Display
```lua
local function FormatDeathMessage(morgueRow)
    local killer = GetKilledByFromMorgueRow(morgueRow)
    local character = morgueRow.character
    local title = GetCharacterTitle(character)
    
    return string.format("%s (%s) was killed by %s", 
                        title, character, killer)
end
```

### Starting Inventory Preview
```lua
local function ShowStartingItems(character)
    local items = GetUniquePotentialCharacterStartingInventoryItems(character, true)
    
    print(string.format("%s starts with:", character))
    for i, item in ipairs(items) do
        local itemName = STRINGS.NAMES[string.upper(item)] or item
        print(string.format("  %d. %s", i, itemName))
    end
end
```

### Avatar Gallery
```lua
local function CreateAvatarGrid()
    local grid = {}
    
    for _, character in ipairs(DST_CHARACTERLIST) do
        local atlas, texture = GetCharacterAvatarTextureLocation(character)
        local avatar = Image(atlas, texture)
        table.insert(grid, avatar)
    end
    
    return grid
end
```

## Best Practices

### Performance Optimization
- **Cache Results**: Store texture locations to avoid repeated file system checks
- **Batch Loading**: Load multiple character assets together when possible
- **Lazy Loading**: Only load assets when needed for display

### Error Handling
- **Validate Parameters**: Check for nil or empty character/skin parameters
- **File Existence**: Use `softresolvefilepath()` to verify assets exist
- **Graceful Fallbacks**: Always provide fallback textures for missing assets

### Mod Integration
- **Register Characters**: Ensure mod characters are in `MODCHARACTERLIST`
- **Provide Avatars**: Set up `MOD_AVATAR_LOCATIONS` for custom avatar paths
- **Test Fallbacks**: Verify UI works with missing mod assets

## Common Patterns

### Safe Asset Loading
```lua
local function SafeSetPortrait(widget, character, skin)
    if not widget or not character then
        return false
    end
    
    if skin and skin ~= "" then
        return SetSkinnedOvalPortraitTexture(widget, character, skin)
    else
        return SetOvalPortraitTexture(widget, character)
    end
end
```

### Character Validation
```lua
local function IsValidCharacter(character)
    return character and character ~= "" and (
        table.contains(DST_CHARACTERLIST, character) or
        table.contains(MODCHARACTERLIST, character) or
        character == "random"
    )
end
```

## Related Systems

- **[Skins System](../character-systems/skins.md)**: Character skin management and validation
- **[Localization](../localization.md)**: String and asset localization support
- **[UI Widgets](../../widgets/)**: Image widgets and UI components
- **[Mod Support](../mod-system/)**: Integration with modded characters
- **[Asset Loading](../assets/)**: File system and texture loading utilities

## Technical Notes

- **File System**: Uses `softresolvefilepath()` for safe file existence checking
- **Localization**: Supports localized name textures via `LOC.GetNamesImageSuffix()`
- **Memory Management**: Minimal allocation, safe for frequent UI updates
- **Thread Safety**: Single-threaded design, not thread-safe
- **Platform Support**: Cross-platform texture loading with consistent paths

## Troubleshooting

### Missing Portraits
- Verify character has skinned portraits in `bigportraits/` directory
- Check skin naming follows `[character]_[skinname]` convention
- Ensure XML atlas files contain expected texture names

### Avatar Display Issues
- Confirm character is registered in appropriate character list
- Verify mod characters have proper `MOD_AVATAR_LOCATIONS` entries
- Check fallback to "mod" or "unknown" avatars is working

### Name Texture Problems
- Verify grey name textures exist for all characters
- Check localization suffix is correctly applied for gold names
- Ensure mod characters fall back to grey names gracefully

### Starting Inventory Errors
- Validate character exists in `TUNING.GAMEMODE_STARTING_ITEMS`
- Check seasonal items are properly configured
- Verify item prefab names are valid and exist
