---
id: custom-presets
title: Custom Presets
description: System for creating, managing, and storing custom world generation and settings presets in Don't Starve Together
sidebar_position: 4
slug: /api-vanilla/core-systems/custom-presets
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Custom Presets

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `CustomPresets` system provides functionality for creating, managing, and storing custom world generation and settings presets in Don't Starve Together. This system allows players to save their preferred world configurations and share them with others.

Custom presets enable players to create personalized world configurations by saving custom combinations of world settings and generation parameters, managing preset files with persistent storage, and migrating presets from older profile systems.

## Usage Example

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
        pvp = false,
        ghost_sanity_drain = false
    },
    "Relaxed Survival",
    "Extended days with reduced penalties"
)

-- Load and use a preset
local preset = customPresets:LoadCustomPreset(LEVELCATEGORY.SETTINGS, "CUSTOM_RELAXED_SURVIVAL")
if preset then
    print("Loaded preset:", preset.name)
end
```

## Functions

### Load() {#load}

**Status:** `stable`

**Description:**
Initializes the custom presets system by loading preset IDs and migrating legacy profile presets. Automatically converts presets from the old Profile-based system to the new file-based format.

**Parameters:**
- None

**Returns:**
- (void): No return value

**Behavior:**
- Retrieves preset file lists from the simulation
- Migrates presets from `Profile:GetWorldCustomizationPresets()` if present
- Converts legacy customization presets to the new format
- Cleans up old profile data after successful migration

**Example:**
```lua
local customPresets = CustomPresets()
customPresets:Load()
```

**Version History:**
- Current in build 676042: File-based storage with legacy migration

### LoadCustomPreset(category, presetid) {#load-custom-preset}

**Status:** `stable`

**Description:**
Loads a specific custom preset from persistent storage. Validates preset structure, applies upgrade logic for older versions, and caches loaded presets for performance.

**Parameters:**
- `category` (LEVELCATEGORY): Either `LEVELCATEGORY.SETTINGS` or `LEVELCATEGORY.WORLDGEN`
- `presetid` (string): Preset identifier (must start with `"CUSTOM_"`)

**Returns:**
- (table|nil): Loaded preset data with overrides and metadata, or `nil` if loading fails

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

**Version History:**
- Current in build 676042: Supports version upgrades and validation

### IsValidPreset(category, presetid) {#is-valid-preset}

**Status:** `stable`

**Description:**
Validates whether a custom preset exists and has valid structure. Performs comprehensive validation checks including ID format, existence, and data structure integrity.

**Parameters:**
- `category` (LEVELCATEGORY): Preset category to check, or `LEVELCATEGORY.COMBINED` for both
- `presetid` (string): Preset identifier to validate

**Returns:**
- (boolean): `true` if preset is valid, `false` otherwise

**Validation Checks:**
- Preset ID format (must start with `"CUSTOM_"`)
- Preset ID exists in the system
- Preset file contains valid data structure
- Required fields are present (baseid, name, desc, overrides)

**Example:**
```lua
if customPresets:IsValidPreset(LEVELCATEGORY.SETTINGS, "CUSTOM_SURVIVAL_PLUS") then
    local preset = customPresets:LoadCustomPreset(LEVELCATEGORY.SETTINGS, "CUSTOM_SURVIVAL_PLUS")
    -- Use preset safely
end
```

**Version History:**
- Current in build 676042: Comprehensive validation logic

### SaveCustomPreset(category, presetid, basepreset, overrides, name, desc) {#save-custom-preset}

**Status:** `stable`

**Description:**
Creates or updates a custom preset with the specified configuration. Validates all input parameters, creates preset data structure with version information, and saves to persistent storage.

**Parameters:**
- `category` (LEVELCATEGORY): Preset category
- `presetid` (string): Unique preset identifier (must start with `"CUSTOM_"`)
- `basepreset` (string): Base preset ID to build upon
- `overrides` (table): Setting overrides to apply
- `name` (string): Display name for the preset
- `desc` (string): Description of the preset

**Returns:**
- (boolean): `true` if save was successful, `false` otherwise

**Behavior:**
- Validates all input parameters
- Creates preset data structure with version information
- Calculates playstyle for settings presets
- Saves preset to persistent storage
- Updates internal preset tracking

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

**Version History:**
- Current in build 676042: Includes playstyle calculation

### MoveCustomPreset(category, oldid, presetid, name, desc) {#move-custom-preset}

**Status:** `stable`

**Description:**
Renames or moves a custom preset to a new identifier. Preserves existing overrides and base preset while updating metadata and maintaining preset order.

**Parameters:**
- `category` (LEVELCATEGORY): Preset category
- `oldid` (string): Current preset identifier
- `presetid` (string): New preset identifier
- `name` (string): New display name
- `desc` (string): New description

**Returns:**
- (table|nil): Updated preset data, or `nil` if operation failed

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

**Version History:**
- Current in build 676042: Supports preset renaming

### DeleteCustomPreset(category, presetid) {#delete-custom-preset}

**Status:** `stable`

**Description:**
Permanently removes a custom preset from the system. Removes preset from memory cache, deletes preset file from persistent storage, and updates preset ID tracking lists.

**Parameters:**
- `category` (LEVELCATEGORY): Preset category
- `presetid` (string): Preset identifier to delete

**Returns:**
- (void): No return value

**Example:**
```lua
customPresets:DeleteCustomPreset(LEVELCATEGORY.SETTINGS, "CUSTOM_UNUSED_PRESET")
```

**Version History:**
- Current in build 676042: Complete preset removal

### PresetIDExists(category, presetid) {#preset-id-exists}

**Status:** `stable`

**Description:**
Checks whether a preset ID exists in the specified category. Supports checking both individual categories and combined category validation.

**Parameters:**
- `category` (LEVELCATEGORY): Preset category, or `LEVELCATEGORY.COMBINED` for both
- `presetid` (string): Preset identifier to check

**Returns:**
- (boolean): `true` if preset ID exists, `false` otherwise

**Example:**
```lua
if customPresets:PresetIDExists(LEVELCATEGORY.SETTINGS, "CUSTOM_MY_PRESET") then
    print("Preset already exists")
end
```

**Version History:**
- Current in build 676042: Supports combined category checking

### IsCustomPreset(category, presetid) {#is-custom-preset}

**Status:** `stable`

**Description:**
Alias for `PresetIDExists()`. Checks if a preset is a custom preset.

**Parameters:**
- `category` (LEVELCATEGORY): Preset category
- `presetid` (string): Preset identifier to check

**Returns:**
- (boolean): `true` if it's a custom preset, `false` otherwise

**Version History:**
- Current in build 676042: Alias for PresetIDExists

### GetPresetIDs(category) {#get-preset-ids}

**Status:** `stable`

**Description:**
Retrieves all preset IDs for a specific category, sorted alphabetically.

**Parameters:**
- `category` (LEVELCATEGORY): Preset category

**Returns:**
- (table): Array of preset IDs sorted alphabetically

**Example:**
```lua
local settingsPresets = customPresets:GetPresetIDs(LEVELCATEGORY.SETTINGS)
for i, presetid in ipairs(settingsPresets) do
    print("Available preset:", presetid)
end
```

**Version History:**
- Current in build 676042: Returns sorted preset list

## Constants

### File System Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `WORLD_PRESETS_FOLDER` | `"world_presets/"` | Storage directory for preset files |
| `PRESET_PREFIX` | `"CUSTOM_"` | Required prefix for custom preset IDs |
| `EXTENSIONS.SETTINGS` | `".wsp"` | File extension for settings presets |
| `EXTENSIONS.WORLDGEN` | `".wgp"` | File extension for worldgen presets |

### Preset Categories

| Category | Purpose | File Extension |
|----------|---------|----------------|
| `LEVELCATEGORY.SETTINGS` | Gameplay parameters and player experience | `.wsp` |
| `LEVELCATEGORY.WORLDGEN` | World generation and creation parameters | `.wgp` |
| `LEVELCATEGORY.COMBINED` | Both categories for validation | N/A |

## Classes

### CustomPresets

**Status:** `stable`

**Description:**
Main class for managing custom world and settings presets. Provides functionality for loading, saving, validating, and organizing custom presets.

**Properties:**
- `presets` (table): Table storing loaded preset data by category
- `presetIDs` (table): Table storing available preset IDs by category

**Constructor:**
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

**Version History:**
- Current in build 676042: File-based preset management

## Preset Structure

### File Format

Preset files are stored as Lua data structures using `DataDumper`:

```lua
{
    baseid = "SURVIVAL_TOGETHER",
    overrides = {
        day = "longday",
        pvp = false,
        ghost_sanity_drain = false
    },
    name = "Peaceful Extended Days",
    desc = "Longer days with reduced difficulty",
    playstyle = "social", -- calculated for settings presets
    version = 1
}
```

### Storage Structure

```
world_presets/
├── CUSTOM_PRESET_NAME.wsp    # Settings preset
├── CUSTOM_PRESET_NAME.wgp    # World generation preset
├── CUSTOM_ANOTHER_PRESET.wsp
└── CUSTOM_ANOTHER_PRESET.wgp
```

## Migration System

### Legacy Profile Migration

**Status:** `stable`

**Description:**
Automatic migration from the old Profile-based system to the new file-based format.

**Migration Process:**
- Converts presets from `Profile:GetWorldCustomizationPresets()`
- Handles both forest and cave location presets
- Maintains backward compatibility with existing user presets
- Cleans up old profile data after successful migration

**Example:**
```lua
-- Automatic migration during Load()
local profilepresets = Profile:GetWorldCustomizationPresets()
if profilepresets ~= nil and not IsTableEmpty(profilepresets) then
    -- Convert each preset to new format
    for i, level in pairs(profilepresets) do
        local id = "CUSTOM_" .. (level.id):gsub("_", " ")
        -- Save as both settings and worldgen presets
        self:SaveCustomPreset(LEVELCATEGORY.SETTINGS, id, basepreset, settingsoverrides, level.name, level.desc)
        self:SaveCustomPreset(LEVELCATEGORY.WORLDGEN, id, basepreset, worldgenoverrides, level.name, level.desc)
    end
    Profile:SetValue("customizationpresets", nil)
end
```

## Related Modules

- [Map/Levels](mdc:dst-api-webdocs/map/levels.md): Base preset definitions and level categories
- [Map/Customize](mdc:dst-api-webdocs/map/customize.md): World customization options
- [Save File Upgrades](mdc:dst-api-webdocs/core-systems/savefileupgrades.md): Preset version migration
- [Profile System](mdc:dst-api-webdocs/core-systems/profile.md): Legacy preset storage
