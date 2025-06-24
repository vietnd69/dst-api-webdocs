---
id: fonthelper
title: Font Helper
description: Utility function for adding font assets to asset tables
sidebar_position: 56
slug: core-systems-fonthelper
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Font Helper

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `fonthelper.lua` module provides a utility function for adding font assets to asset tables. This helper simplifies the process of registering font files as game assets by automatically creating Asset entries for each font in a font configuration table.

## Usage Example

```lua
local font_assets = {}
local my_fonts = {
    { filename = "fonts/myfont.zip" },
    { filename = "fonts/anotherfont.zip" },
    { filename = "fonts/specialfont.zip" }
}

-- Add all font assets to the asset table
AddFontAssets(font_assets, my_fonts)

-- Result: font_assets now contains Asset entries for all fonts
-- font_assets = {
--     Asset("FONT", "fonts/myfont.zip"),
--     Asset("FONT", "fonts/anotherfont.zip"),
--     Asset("FONT", "fonts/specialfont.zip")
-- }
```

## Functions

### AddFontAssets(asset_table, font_table) {#add-font-assets}

**Status:** `stable`

**Description:**
Iterates through a font configuration table and adds corresponding font Asset entries to the provided asset table. This function is used during asset loading to register all fonts defined in the game's font configuration.

**Parameters:**
- `asset_table` (table): Target table where font Asset entries will be inserted
- `font_table` (table): Array of font data objects containing filename information

**Returns:**
- None (modifies asset_table in-place)

**Font Data Structure:**
Each entry in the font_table should have the following structure:
```lua
{
    filename = "string"  -- Path to the font file (required)
    -- Additional properties like alias, fallback, etc. are ignored by this function
}
```

**Example:**
```lua
-- Define asset table
local assets = {}

-- Define font configurations
local fonts = {
    { filename = "fonts/opensans50.zip" },
    { filename = "fonts/bellefair50.zip" },
    { filename = "fonts/hammerhead50.zip" }
}

-- Add font assets
AddFontAssets(assets, fonts)

-- assets now contains:
-- {
--     Asset("FONT", "fonts/opensans50.zip"),
--     Asset("FONT", "fonts/bellefair50.zip"),
--     Asset("FONT", "fonts/hammerhead50.zip")
-- }
```

**Implementation Details:**
```lua
function AddFontAssets( asset_table, font_table )
    for i, fontdata in ipairs( font_table ) do
        table.insert( asset_table, Asset( "FONT", fontdata.filename ) )
    end
end
```

## Common Usage Patterns

### Asset Loading in Prefabs

```lua
-- In a prefab file
local assets = {
    -- Other assets...
    Asset("ANIM", "anim/prefab_build.zip"),
    Asset("ANIM", "anim/prefab_bank.zip"),
}

-- Add all game fonts
AddFontAssets(assets, FONTS)

local function fn()
    -- Prefab creation code
end

return Prefab("myprefab", fn, assets)
```

### Custom Font Registration

```lua
-- Register custom mod fonts
local custom_fonts = {
    { filename = "fonts/modfont_ui.zip" },
    { filename = "fonts/modfont_dialogue.zip" }
}

local mod_assets = {}
AddFontAssets(mod_assets, custom_fonts)

-- Register assets with mod system
for _, asset in ipairs(mod_assets) do
    table.insert(Assets, asset)
end
```

### Conditional Font Loading

```lua
-- Load fonts based on language or platform
local conditional_fonts = {}

if LanguageTranslator.defaultlang == "jp" then
    table.insert(conditional_fonts, { filename = "fonts/japanese_font.zip" })
end

if PLATFORM == "PS4" then
    table.insert(conditional_fonts, { filename = "fonts/console_font.zip" })
end

local platform_assets = {}
AddFontAssets(platform_assets, conditional_fonts)
```

## Asset Type Details

### Font Asset Creation
The function creates assets with the "FONT" type:
```lua
Asset("FONT", filename)
```

**Asset Properties:**
- **Type**: "FONT" - Identifies this as a font resource
- **Filename**: Full path to the font file, typically in .zip format
- **Loading**: Fonts are loaded during the asset loading phase of game initialization

### Supported Font Formats
- **.zip**: Compressed font packages (most common)
- Font files are typically packaged with additional metadata
- Must be in the game's recognized font directory structure

## Integration with Font System

### Relationship to FONTS Table
This helper is commonly used with the global `FONTS` table:

```lua
-- From fonts.lua
FONTS = {
    { filename = "fonts/opensans50.zip", alias = "opensans", fallback = {...} },
    { filename = "fonts/bellefair50.zip", alias = "bellefair", fallback = {...} },
    -- ... more font definitions
}

-- Use helper to register all fonts
local game_assets = {}
AddFontAssets(game_assets, FONTS)
```

### Asset Registration Flow
1. **Font Definition**: Fonts are defined in configuration tables
2. **Asset Creation**: `AddFontAssets` creates Asset entries
3. **Asset Registration**: Assets are added to prefab or global asset lists
4. **Loading**: Game loads font files during initialization
5. **Usage**: Fonts become available for UI and text rendering

## Performance Considerations

### Loading Efficiency
- Font assets are loaded once during game initialization
- All fonts should be registered before the asset loading phase completes
- Large font files can impact loading times

### Memory Management
- Fonts remain in memory once loaded
- Only register fonts that are actually used
- Consider platform-specific font requirements

## Error Handling

The function has minimal error handling:
- No validation of asset_table parameter
- No validation of font_table structure
- No error handling for malformed font data

**Best Practices:**
```lua
-- Validate parameters before calling
if asset_table and font_table then
    -- Ensure font_table is properly structured
    for i, fontdata in ipairs(font_table) do
        if fontdata.filename then
            AddFontAssets(asset_table, {fontdata})
        else
            print("Warning: Invalid font data at index " .. i)
        end
    end
end
```

## Related Modules

- [Fonts](./fonts.md): Font configuration and constant definitions
- [Assets](./assets.md): General asset management system
- [Prefabs](./prefabs.md): Prefab asset registration patterns
- [Translator](./translator.md): Language-specific font handling
