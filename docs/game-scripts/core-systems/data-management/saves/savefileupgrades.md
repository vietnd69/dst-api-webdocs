---
id: savefileupgrades
title: Save File Upgrades
description: Save data migration and upgrade system for maintaining compatibility across game versions
sidebar_position: 2

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Save File Upgrades

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `savefileupgrades` module provides a comprehensive system for migrating save data between different versions of Don't Starve Together. It ensures backward compatibility by automatically upgrading older save files to current formats while preserving game state and player progress.

## Constants

### VERSION

**Value:** `5.156`

**Description:** The highest version number of all defined upgrades, representing the current save data format version.

## Core Concepts

### Version-Based Upgrades
The system applies sequential upgrades based on version numbers, ensuring all necessary migrations are performed in the correct order.

### Selective Application
Upgrades are only applied when the save data version is lower than the upgrade version, preventing redundant operations.

### Preservation of Game State
All upgrades are designed to maintain existing game progress while adding new features or fixing compatibility issues.

### Retrofitting System
Many upgrades use a "retrofitting" approach that adds new content to existing worlds without regenerating them completely.

## Utility Functions

### utilities.UpgradeUserPresetFromV1toV2(preset, custompresets) {#upgrade-user-preset-v1-v2}

**Status:** `stable`

**Description:**
Upgrades custom user presets from version 1 to version 2 format, handling base preset resolution and override application.

**Parameters:**
- `preset` (table): The preset data to upgrade
- `custompresets` (table): Array of all custom presets for dependency resolution

**Returns:**
- (table): Upgraded preset data in version 2 format

**Example:**
```lua
local upgradedPreset = savefileupgrades.utilities.UpgradeUserPresetFromV1toV2(oldPreset, allPresets)
print("Upgraded preset:", upgradedPreset.name)
```

### utilities.UpgradeUserPresetFromV2toV3(preset, custompresets) {#upgrade-user-preset-v2-v3}

**Status:** `stable`

**Description:**
Upgrades user presets from version 2 to 3, adding A New Reign Part 1 content (sculptures).

**Parameters:**
- `preset` (table): The preset data to upgrade
- `custompresets` (table): Array of custom presets

**Returns:**
- (table): Upgraded preset with ANR content

**Example:**
```lua
local v3Preset = savefileupgrades.utilities.UpgradeUserPresetFromV2toV3(v2Preset, presets)
-- Preset now includes sculpture setpieces for forest worlds
```

### utilities.UpgradeUserPresetFromV3toV4(preset, custompresets) {#upgrade-user-preset-v3-v4}

**Status:** `stable`

**Description:**
Upgrades user presets from version 3 to 4, adding Return of Them: Turn of Tides ocean content.

**Parameters:**
- `preset` (table): The preset data to upgrade
- `custompresets` (table): Array of custom presets

**Returns:**
- (table): Upgraded preset with ocean features

**Example:**
```lua
local v4Preset = savefileupgrades.utilities.UpgradeUserPresetFromV3toV4(v3Preset, presets)
-- Forest presets now have ocean enabled by default
```

### utilities.UpgradeSavedLevelFromV1toV2(level, master_world) {#upgrade-saved-level-v1-v2}

**Status:** `stable`

**Description:**
Upgrades saved level data from the legacy format to version 2, converting preset-based data to the modern override system.

**Parameters:**
- `level` (table): The level data to upgrade
- `master_world` (boolean): Whether this is the master world in a cluster

**Returns:**
- (table): Upgraded level data with modern format

**Example:**
```lua
local upgradedLevel = savefileupgrades.utilities.UpgradeSavedLevelFromV1toV2(oldLevel, true)
print("Level upgraded:", upgradedLevel.name)
```

### utilities.UpgradeSavedLevelFromV2toV3(level, master_world) {#upgrade-saved-level-v2-v3}

**Status:** `stable`

**Description:**
Upgrades saved level data from version 2 to 3, adding A New Reign sculpture content.

**Parameters:**
- `level` (table): The level data to upgrade
- `master_world` (boolean): Whether this is the master world

**Returns:**
- (table): Level data with ANR sculpture setpieces

### utilities.UpgradeSavedLevelFromV3toV4(level, master_world) {#upgrade-saved-level-v3-v4}

**Status:** `stable`

**Description:**
Upgrades saved level data from version 3 to 4, enabling ocean content for forest worlds.

**Parameters:**
- `level` (table): The level data to upgrade
- `master_world` (boolean): Whether this is the master world

**Returns:**
- (table): Level data with ocean features enabled

### utilities.UpgradeShardIndexFromV1toV2(shardindex) {#upgrade-shard-index-v1-v2}

**Status:** `stable`

**Description:**
Upgrades shard index data from version 1 to 2, extracting overrides from world save data for Return of Them: Forgotten Knowledge compatibility.

**Parameters:**
- `shardindex` (table): The shard index to upgrade

**Example:**
```lua
savefileupgrades.utilities.UpgradeShardIndexFromV1toV2(myShardIndex)
-- Shard index now has proper override data extracted
```

### utilities.UpgradeShardIndexFromV2toV3(shardindex) {#upgrade-shard-index-v2-v3}

**Status:** `stable`

**Description:**
Upgrades shard index from version 2 to 3, handling custom preset ID migration for better organization.

**Parameters:**
- `shardindex` (table): The shard index to upgrade

### utilities.UpgradeShardIndexFromV4toV5(shardindex) {#upgrade-shard-index-v4-v5}

**Status:** `stable`

**Description:**
Upgrades shard index from version 4 to 5, migrating game mode settings to the new playstyle system.

**Parameters:**
- `shardindex` (table): The shard index to upgrade

**Migration Details:**
- Converts "wilderness" game mode to "survival" with "wilderness" playstyle
- Converts "endless" game mode to "survival" with "endless" playstyle
- Calculates playstyle for existing "survival" mode based on world settings

### utilities.UpgradeWorldgenoverrideFromV1toV2(wgo) {#upgrade-worldgen-override-v1-v2}

**Status:** `stable`

**Description:**
Upgrades worldgenoverride.lua files from version 1 to 2 format, consolidating scattered override data into a standardized structure.

**Parameters:**
- `wgo` (table): The worldgen override data to upgrade

**Returns:**
- (table): Upgraded override data in standardized format

**Example:**
```lua
local upgradedOverride = savefileupgrades.utilities.UpgradeWorldgenoverrideFromV1toV2(oldOverride)
-- Override data now uses consistent structure
```

### utilities.ApplyPlaystyleOverridesForGameMode(world_options, game_mode) {#apply-playstyle-overrides}

**Status:** `stable`

**Description:**
Applies world setting overrides appropriate for specific game modes (wilderness, endless).

**Parameters:**
- `world_options` (table): World options to modify
- `game_mode` (string): The game mode ("wilderness" or "endless")

**Example:**
```lua
savefileupgrades.utilities.ApplyPlaystyleOverridesForGameMode(worldOpts, "wilderness")
-- World options now include wilderness-specific settings
```

### utilities.ConvertSaveIndexToShardSaveIndex(savegameindex, shardsavegameindex) {#convert-save-index}

**Status:** `stable`

**Description:**
Converts legacy SaveIndex format to the modern ShardSaveIndex format for cluster support.

**Parameters:**
- `savegameindex` (SaveIndex): The legacy save index
- `shardsavegameindex` (ShardSaveIndex): The target shard save index

**Example:**
```lua
savefileupgrades.utilities.ConvertSaveIndexToShardSaveIndex(oldIndex, newIndex)
-- Legacy saves now work with cluster system
```

## Version-Specific Upgrades

### Version 1 - RoG Season Conversion

**Description:** Converts pre-Reign of Giants summer season to autumn for compatibility.

**Changes Applied:**
- Updates season component from "summer" to "autumn"
- Adjusts season lengths and day/night cycles
- Adds RoG-specific world settings
- Disables new RoG monsters and features for classic worlds

### Version 2 - Prefab Swap Management

**Description:** Handles prefab swap system changes and management updates.

### Version 3 - Default Prefab Swaps

**Description:** Adjusts default prefab swap settings and clears existing swaps when appropriate.

### Version 4 Series - A New Reign Updates

**Version 4.0:** A Little Fixer Upper - Adds retrofitting flags for forest content
**Version 4.1:** Warts and All - Adds cave retrofitting for new cave content  
**Version 4.2:** Arts and Crafts - Adds pottery and sculpture content
**Version 4.3:** Arts and Crafts 2 - Additional sculpture content for forests
**Version 4.4:** Cute Fuzzy Animals - Adds new animal content
**Version 4.5:** Herd Mentality - Updates animal behavior systems
**Version 4.6:** Against the Grain - Adds farming and crop content
**Version 4.71-4.77:** Heart of the Ruins series - Major cave updates including:
- Ruins respawner systems
- Atrium and archive content
- Chess and statue respawners
- Sacred chest additions

### Version 5 Series - Return of Them Updates

**Version 5.00:** Turn of Tides - Enables ocean system for existing forest worlds
**Version 5.01-5.02:** Ocean navigation and sea stack improvements
**Version 5.03:** Salty Dog - Additional ocean content
**Version 5.04:** She Sells Seashells - Hermit crab and seashell content
**Version 5.05:** Troubled Waters - Barnacle and ocean creature updates
**Version 5.06-5.064:** Forgotten Knowledge series - Archive system and lunar content
**Version 5.07-5.08:** Waterlogged - Flooding and water-based content
**Version 5.09:** Terraria - Terrarium setpiece content
**Version 5.10:** Catcoon De-extinction - Catcoon respawning systems
**Version 5.11:** Ocean tile cleanup
**Version 5.12:** Curse of Moon Quay - Monkey island content
**Version 5.13:** A Little Drama - Dramatic setpieces
**Version 5.141:** Daywalker - Brightmare and daywalker content
**Version 5.143-5.146:** Junk Yard series - Scrapyard content and fixes
**Version 5.151:** Otter den additions
**Version 5.155:** Balatro machine content
**Version 5.156:** Ice hazard fixes at world edges

## Usage Patterns

### Manual Upgrade Application
```lua
-- Load save file upgrades system
local savefileupgrades = require("savefileupgrades")

-- Check if upgrade is needed
if savedata.version < savefileupgrades.VERSION then
    print("Applying save file upgrades...")
    
    -- Upgrades are applied automatically during save load
    -- Individual utilities can be called manually if needed
    local upgradedPreset = savefileupgrades.utilities.UpgradeUserPresetFromV1toV2(preset, presets)
end
```

### Automatic Upgrade During Load
```lua
-- Upgrades are automatically applied during save loading
saveIndex:Load(function()
    -- Save data has been automatically upgraded to current version
    print("Save loaded with current format version:", savefileupgrades.VERSION)
end)
```

### Custom Preset Migration
```lua
-- Handle custom preset upgrades
local customPresets = GetCustomPresets()
for i, preset in ipairs(customPresets) do
    if preset.version < 4 then
        customPresets[i] = savefileupgrades.utilities.UpgradeUserPresetFromV3toV4(preset, customPresets)
    end
end
```

## Retrofitting System

### Forest Map Retrofitting
Many upgrades use the retrofitting system to add new content to existing worlds:

```lua
-- Example retrofit flag setting (internal)
if savedata.map.persistdata.retrofitforestmap_anr == nil then
    savedata.map.persistdata.retrofitforestmap_anr = {}
end
savedata.map.persistdata.retrofitforestmap_anr.retrofit_turnoftides = true
```

### Cave Map Retrofitting
Cave worlds have their own retrofitting system:

```lua
-- Cave retrofit example (internal)  
if savedata.map.persistdata.retrofitcavemap_anr == nil then
    savedata.map.persistdata.retrofitcavemap_anr = {}
end
savedata.map.persistdata.retrofitcavemap_anr.retrofit_heartoftheruins = true
```

## Integration with Game Systems

### Save Loading Integration
The upgrade system integrates seamlessly with save loading:
- Automatically detects save version during load
- Applies necessary upgrades in sequence
- Preserves existing world state and player progress
- Flags retrofitting requirements for map systems

### World Generation Integration
Upgrades coordinate with world generation to add new content:
- Sets retrofit flags for map generation systems
- Adds new setpieces and layout requirements
- Updates world options with new features
- Maintains backward compatibility for existing worlds

### Mod System Integration
The upgrade system handles mod-related changes:
- Migrates mod configuration formats
- Updates mod data structures
- Preserves mod settings across game updates

## Performance Considerations

### Sequential Processing
- Upgrades are applied in version order to ensure consistency
- Each upgrade only processes data once
- Version checks prevent redundant operations

### Memory Efficiency  
- Upgrades modify data in-place when possible
- Temporary data is cleaned up after upgrades
- Large data structures are handled efficiently

### I/O Optimization
- File operations are batched when possible
- Retrofit flags minimize redundant world scanning
- Upgrade results are cached appropriately

## Error Handling and Recovery

### Version Validation
```lua
-- Version checking ensures upgrade safety
local currentVersion = savedata.version or 1
for i, upgrade in ipairs(savefileupgrades.upgrades) do
    if currentVersion < upgrade.version then
        -- Apply upgrade safely
        upgrade.fn(savedata)
    end
end
```

### Corruption Recovery
The system includes safeguards for corrupted save data:
- Validates data structure before upgrades
- Provides fallback values for missing data
- Logs upgrade operations for debugging
- Maintains backup state during critical operations

### Console-Specific Handling
Some upgrades include console-specific logic:
```lua
if IsConsole() then
    -- Apply console-specific fixes
    FlagForRetrofitting_Forest(savedata, "console_beard_turf_fix")
end
```

## Related Systems

- [SaveIndex](./saveindex.md): Main save data management system that uses these upgrades
- [ShardIndex](./shardindex.md): Shard-specific save data that also requires upgrades
- [World Generation](./worldgen.md): World creation system that processes retrofit flags
- [Custom Presets](./custompresets.md): User-created world presets that require migration
- [Mod System](./mods.md): Mod management that integrates with upgrade system

## Development Guidelines

### Adding New Upgrades

When adding new game content that requires save compatibility:

1. **Increment Version Number:** Choose the next available version number
2. **Create Upgrade Function:** Implement the upgrade logic in the upgrades table
3. **Set Retrofit Flags:** Use retrofitting system for world content
4. **Test Compatibility:** Verify upgrades work with various save states
5. **Document Changes:** Update this documentation with upgrade details

### Version Numbering Convention
- **Integer versions (1, 2, 3):** Major feature additions or format changes
- **Decimal versions (4.1, 4.2, etc.):** Minor content additions within a major update series
- **Patch versions (5.143, 5.144):** Bug fixes and small improvements

### Retrofit Flag Naming
- **Format:** `retrofit_[updatename]_[content]`
- **Examples:** `retrofit_turnoftides`, `retrofit_heartoftheruins_altars`
- **Consistency:** Use lowercase with underscores for separation

## Technical Implementation Notes

### Upgrade Function Structure
```lua
{
    version = 5.156,
    fn = function(savedata)
        if savedata == nil then
            return
        end
        
        -- Apply specific upgrade logic
        FlagForRetrofitting_Forest(savedata, "sharkboi_ice_hazard_fix")
    end,
}
```

### Helper Functions
The module includes helper functions for common operations:
- `FlagForRetrofitting_Forest(savedata, flag_name)` - Sets forest retrofit flags
- `FlagForRetrofitting_Cave(savedata, flag_name)` - Sets cave retrofit flags

### Data Structure Preservation
All upgrades are designed to:
- Maintain existing save data integrity
- Add new features without breaking old content
- Preserve player progress and world state
- Handle edge cases and corrupted data gracefully
