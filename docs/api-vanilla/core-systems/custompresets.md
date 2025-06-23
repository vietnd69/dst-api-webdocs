---
title: "Custom Presets"
description: "System for creating, managing, and storing custom world generation and settings presets in Don't Starve Together"
sidebar_position: 9
slug: /api-vanilla/core-systems/custompresets
last_updated: "2024-12-28"
build_version: "675312"
change_status: "stable"
---

# Custom Presets

The `CustomPresets` system provides functionality for creating, managing, and storing custom world generation and settings presets in Don't Starve Together. This system allows players to save their preferred world configurations and share them with others.

## Overview

Custom presets enable players to create personalized world configurations by:
- Saving custom combinations of world settings and generation parameters
- Managing preset files with persistent storage
- Migrating presets from older profile systems
- Providing validation and integrity checking for preset data

The system supports two types of presets:
- **Settings Presets** (`.wsp` files): Player experience settings like PvP, day length, etc.
- **World Generation Presets** (`.wgp` files): World generation parameters like resource frequency, biome settings, etc.

## Class Definition

### CustomPresets

```lua
CustomPresets = Class(function(self)
    self.presets = {
        [LEVELCATEGORY.SETTINGS] = {},
        [LEVELCATEGORY.WORLDGEN] = {},
    }
    self.presetIDs = {
        [LEVELCATEGORY.SETTINGS] = {},
        [LEVELCATEGORY.WORLDGEN] = {},
    }
end)
```

**Properties:**
- `presets`: Table storing loaded preset data by category
- `presetIDs`: Table storing available preset IDs by category

## Constants

### File System Constants
```lua
local WORLD_PRESETS_FOLDER = "world_presets/"
local PRESET_PREFIX = "CUSTOM_"
local EXTENSIONS = {
    [LEVELCATEGORY.SETTINGS] = ".wsp",
    [LEVELCATEGORY.WORLDGEN] = ".wgp",
}
```

## API Reference

### Core Methods

#### `Load()`

Initializes the custom presets system by loading preset IDs and migrating legacy profile presets.

**Behavior:**
- Retrieves preset file lists from the simulation
- Migrates presets from the old Profile system if present
- Converts legacy customization presets to the new format
- Cleans up old profile data after successful migration

**Legacy Migration:**
- Automatically converts presets from `Profile:GetWorldCustomizationPresets()`
- Handles both forest and cave location presets
- Maintains backward compatibility with existing user presets

**Example:**
```lua
local customPresets = CustomPresets()
customPresets:Load()
```

#### `LoadCustomPreset(category, presetid)`

Loads a specific custom preset from persistent storage.

**Parameters:**
- `category` (LEVELCATEGORY): Either `LEVELCATEGORY.SETTINGS` or `LEVELCATEGORY.WORLDGEN`
- `presetid` (string): Preset identifier (must start with `"CUSTOM_"`)

**Returns:**
- `presetdata` (table): Loaded preset data with overrides and metadata, or `nil` if loading fails

**Behavior:**
- Validates preset ID format and existence
- Loads preset data from persistent storage
- Applies upgrade logic for older preset versions
- Merges custom overrides with base preset data
- Caches loaded presets for performance

**Example:**
```lua
local presetData = customPresets:LoadCustomPreset(LEVELCATEGORY.SETTINGS, "CUSTOM_MY_PRESET")
if presetData then
    print("Loaded preset:", presetData.name)
    print("Base preset:", presetData.baseid)
end
```

#### `IsValidPreset(category, presetid)`

Validates whether a custom preset exists and has valid structure.

**Parameters:**
- `category` (LEVELCATEGORY): Preset category to check, or `LEVELCATEGORY.COMBINED` for both
- `presetid` (string): Preset identifier to validate

**Returns:**
- `boolean`: `true` if preset is valid, `false` otherwise

**Validation Checks:**
- Preset ID format (must start with `"CUSTOM_"`)
- Preset ID exists in the system
- Preset file contains valid data structure
- Required fields are present (baseid, name, desc, overrides)

**Example:**
```lua
if customPresets:IsValidPreset(LEVELCATEGORY.SETTINGS, "CUSTOM_SURVIVAL_PLUS") then
    -- Preset is valid and can be loaded
    local preset = customPresets:LoadCustomPreset(LEVELCATEGORY.SETTINGS, "CUSTOM_SURVIVAL_PLUS")
end
```

#### `SaveCustomPreset(category, presetid, basepreset, overrides, name, desc)`

Creates or updates a custom preset with the specified configuration.

**Parameters:**
- `category` (LEVELCATEGORY): Preset category
- `presetid` (string): Unique preset identifier (must start with `"CUSTOM_"`)
- `basepreset` (string): Base preset ID to build upon
- `overrides` (table): Setting overrides to apply
- `name` (string): Display name for the preset
- `desc` (string): Description of the preset

**Returns:**
- `boolean`: `true` if save was successful, `false` otherwise

**Behavior:**
- Validates all input parameters
- Creates preset data structure with version information
- Calculates playstyle for settings presets
- Saves preset to persistent storage
- Updates internal preset tracking

**Preset Structure:**
```lua
{
    baseid = "SURVIVAL_TOGETHER",
    overrides = { dayTime = "longday", pvp = false },
    name = "My Custom Preset",
    desc = "A preset with longer days and no PvP",
    playstyle = "social", -- calculated for settings presets
    version = 1
}
```

**Example:**
```lua
local success = customPresets:SaveCustomPreset(
    LEVELCATEGORY.SETTINGS,
    "CUSTOM_PEACEFUL_LONG",
    "SURVIVAL_TOGETHER",
    { 
        day = "longday",
        pvp = false,
        ghost_sanity_drain = false
    },
    "Peaceful Long Days",
    "Relaxed gameplay with extended daylight"
)
```

#### `MoveCustomPreset(category, oldid, presetid, name, desc)`

Renames or moves a custom preset to a new identifier.

**Parameters:**
- `category` (LEVELCATEGORY): Preset category
- `oldid` (string): Current preset identifier
- `presetid` (string): New preset identifier
- `name` (string): New display name
- `desc` (string): New description

**Returns:**
- `presetdata` (table): Updated preset data, or `nil` if operation failed

**Behavior:**
- Preserves existing overrides and base preset
- Creates new preset with updated metadata
- Deletes old preset if ID changed
- Maintains preset order in the system

**Example:**
```lua
local movedPreset = customPresets:MoveCustomPreset(
    LEVELCATEGORY.SETTINGS,
    "CUSTOM_OLD_NAME",
    "CUSTOM_NEW_NAME",
    "Updated Preset Name",
    "Updated description"
)
```

#### `DeleteCustomPreset(category, presetid)`

Permanently removes a custom preset from the system.

**Parameters:**
- `category` (LEVELCATEGORY): Preset category
- `presetid` (string): Preset identifier to delete

**Behavior:**
- Removes preset from memory cache
- Deletes preset file from persistent storage
- Updates preset ID tracking lists

**Example:**
```lua
customPresets:DeleteCustomPreset(LEVELCATEGORY.SETTINGS, "CUSTOM_UNUSED_PRESET")
```

#### `PresetIDExists(category, presetid)`

Checks whether a preset ID exists in the specified category.

**Parameters:**
- `category` (LEVELCATEGORY): Preset category, or `LEVELCATEGORY.COMBINED` for both
- `presetid` (string): Preset identifier to check

**Returns:**
- `boolean`: `true` if preset ID exists, `false` otherwise

**Example:**
```lua
if customPresets:PresetIDExists(LEVELCATEGORY.SETTINGS, "CUSTOM_MY_PRESET") then
    print("Preset already exists")
end
```

#### `IsCustomPreset(category, presetid)`

Alias for `PresetIDExists()`. Checks if a preset is a custom preset.

**Parameters:**
- `category` (LEVELCATEGORY): Preset category
- `presetid` (string): Preset identifier to check

**Returns:**
- `boolean`: `true` if it's a custom preset, `false` otherwise

#### `GetPresetIDs(category)`

Retrieves all preset IDs for a specific category.

**Parameters:**
- `category` (LEVELCATEGORY): Preset category

**Returns:**
- `table`: Array of preset IDs sorted alphabetically

**Example:**
```lua
local settingsPresets = customPresets:GetPresetIDs(LEVELCATEGORY.SETTINGS)
for i, presetid in ipairs(settingsPresets) do
    print("Available preset:", presetid)
end
```

## Preset Categories

### LEVELCATEGORY.SETTINGS

Settings presets control gameplay parameters that affect player experience:

**Common Override Fields:**
- `day`: Day length ("default", "longday", "shortday")
- `pvp`: Player vs Player combat (true/false)
- `ghost_sanity_drain`: Ghost sanity penalties (true/false)
- `player_health_penalty`: Death health penalties ("always", "never")
- `resurrect_penalty`: Resurrection penalties (true/false)

**File Extension:** `.wsp` (World Settings Preset)

### LEVELCATEGORY.WORLDGEN

World generation presets control how the world is initially created:

**Common Override Fields:**
- `world_size`: World size ("small", "medium", "large", "huge")
- `branching`: World complexity ("never", "least", "default", "most")
- `loop`: World connectivity ("never", "default", "always")
- Resource frequencies (e.g., `flint`, `grass`, `sapling`)
- Creature spawning (e.g., `beefaloherd`, `pigtown`, `spiders`)

**File Extension:** `.wgp` (World Generation Preset)

## File System Structure

### Storage Location
```
world_presets/
├── CUSTOM_PRESET_NAME.wsp    # Settings preset
├── CUSTOM_PRESET_NAME.wgp    # World generation preset
├── CUSTOM_ANOTHER_PRESET.wsp
└── CUSTOM_ANOTHER_PRESET.wgp
```

### File Format
Preset files are stored as Lua data structures using `DataDumper`:

```lua
return {
    baseid = "SURVIVAL_TOGETHER",
    overrides = {
        day = "longday",
        pvp = false,
        ghost_sanity_drain = false
    },
    name = "Peaceful Extended Days",
    desc = "Longer days with reduced difficulty",
    playstyle = "social",
    version = 1
}
```

## Usage Examples

### Creating a Custom Settings Preset
```lua
local customPresets = CustomPresets()
customPresets:Load()

-- Create a relaxed gameplay preset
local success = customPresets:SaveCustomPreset(
    LEVELCATEGORY.SETTINGS,
    "CUSTOM_RELAXED_SURVIVAL",
    "SURVIVAL_TOGETHER",
    {
        day = "longday",
        season_length = "verylong",
        pvp = false,
        ghost_sanity_drain = false,
        player_health_penalty = "never",
        resurrect_penalty = false
    },
    "Relaxed Survival",
    "Extended seasons and reduced penalties for casual play"
)

if success then
    print("Preset saved successfully!")
end
```

### Loading and Using a Preset
```lua
-- Load an existing custom preset
local preset = customPresets:LoadCustomPreset(LEVELCATEGORY.SETTINGS, "CUSTOM_RELAXED_SURVIVAL")

if preset then
    print("Preset Name:", preset.name)
    print("Description:", preset.desc)
    print("Base Preset:", preset.baseid)
    
    -- Access specific overrides
    local dayLength = preset.overrides.day
    local pvpEnabled = preset.overrides.pvp
    
    print("Day Length:", dayLength)
    print("PvP Enabled:", pvpEnabled)
end
```

### Managing Multiple Presets
```lua
-- Get all available custom presets
local settingsPresets = customPresets:GetPresetIDs(LEVELCATEGORY.SETTINGS)
local worldgenPresets = customPresets:GetPresetIDs(LEVELCATEGORY.WORLDGEN)

print("Available Settings Presets:")
for i, presetid in ipairs(settingsPresets) do
    if customPresets:IsValidPreset(LEVELCATEGORY.SETTINGS, presetid) then
        local preset = customPresets:LoadCustomPreset(LEVELCATEGORY.SETTINGS, presetid)
        print("  " .. presetid .. ": " .. preset.name)
    end
end

print("\nAvailable Worldgen Presets:")
for i, presetid in ipairs(worldgenPresets) do
    if customPresets:IsValidPreset(LEVELCATEGORY.WORLDGEN, presetid) then
        local preset = customPresets:LoadCustomPreset(LEVELCATEGORY.WORLDGEN, presetid)
        print("  " .. presetid .. ": " .. preset.name)
    end
end
```

### Preset Validation and Error Handling
```lua
local function SafeLoadPreset(category, presetid)
    -- Validate before attempting to load
    if not customPresets:IsValidPreset(category, presetid) then
        print("Invalid preset:", presetid)
        return nil
    end
    
    -- Attempt to load
    local preset = customPresets:LoadCustomPreset(category, presetid)
    if not preset then
        print("Failed to load preset:", presetid)
        return nil
    end
    
    -- Verify required fields
    if not preset.name or not preset.desc or not preset.overrides then
        print("Corrupted preset data:", presetid)
        return nil
    end
    
    return preset
end

-- Usage
local preset = SafeLoadPreset(LEVELCATEGORY.SETTINGS, "CUSTOM_MY_PRESET")
if preset then
    -- Safe to use preset
    print("Successfully loaded:", preset.name)
end
```

## Migration System

### Legacy Profile Migration

The system automatically migrates presets from the old Profile-based system:

```lua
-- Automatic migration from Profile.customizationpresets
local profilepresets = Profile:GetWorldCustomizationPresets()
if profilepresets ~= nil and not IsTableEmpty(profilepresets) then
    for i, level in pairs(profilepresets) do
        -- Convert to new format
        local id = "CUSTOM_" .. (level.id):gsub("_", " ")
        -- Save as both settings and worldgen presets
        customPresets:SaveCustomPreset(LEVELCATEGORY.SETTINGS, id, basepreset, settingsoverrides, level.name, level.desc)
        customPresets:SaveCustomPreset(LEVELCATEGORY.WORLDGEN, id, basepreset, worldgenoverrides, level.name, level.desc)
    end
    -- Clean up old data
    Profile:SetValue("customizationpresets", nil)
end
```

### Version Upgrades

The system supports upgrading preset formats:

```lua
local function UpgradeCustomPresets(custompreset)
    local upgraded = false
    local savefileupgrades = require "savefileupgrades"
    
    -- Future upgrade logic would go here
    -- if custompreset.version == 1 then
    --     savefileupgrades.utilities.UpgradeCustomPresetFromV1toV2(custompreset)
    --     upgraded = true
    -- end
    
    return upgraded
end
```

## Dependencies

### Required Systems
- **Map/Levels**: For base preset data and level categories
- **Map/Customize**: For world settings and generation options
- **TheSim**: For persistent storage operations
- **Profile System**: For legacy preset migration

### Required Constants
- `LEVELCATEGORY.SETTINGS`: Settings preset category
- `LEVELCATEGORY.WORLDGEN`: World generation preset category
- `LEVELCATEGORY.COMBINED`: Both categories for validation

## Error Handling

### Common Validation Checks
- Preset ID must start with `"CUSTOM_"` prefix
- Base preset cannot be another custom preset
- All required fields must be present (baseid, name, desc, overrides)
- Preset files must contain valid Lua data structures

### Safe Operation Patterns
```lua
-- Always validate before operations
if customPresets:IsValidPreset(category, presetid) then
    local preset = customPresets:LoadCustomPreset(category, presetid)
    -- Use preset safely
end

-- Check existence before saving
if not customPresets:PresetIDExists(category, presetid) then
    customPresets:SaveCustomPreset(category, presetid, base, overrides, name, desc)
else
    print("Preset already exists")
end
```

## Version History

| Version | Changes |
|---------|---------|
| 675312  | Current implementation with file-based storage system |

## Related Systems

- [Map/Levels](/api-vanilla/map/levels/) - Base preset definitions and level categories
- [Map/Customize](/api-vanilla/map/customize/) - World customization options
- [Profile System](/api-vanilla/core-systems/profile/) - Legacy preset storage
- [Save File Upgrades](/api-vanilla/core-systems/savefileupgrades/) - Preset version migration

## Notes

- All custom presets must have the `"CUSTOM_"` prefix to distinguish them from built-in presets
- The system maintains separate storage for settings and world generation presets
- Legacy migration ensures backward compatibility with older save formats
- Preset validation prevents corruption and ensures data integrity
- File-based storage allows for easy preset sharing between players
