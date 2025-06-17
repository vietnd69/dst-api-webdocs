---
id: api-changelog
title: API Changelog
sidebar_position: 2
last_updated: 2024-08-22
---
*Last Update: 2024-08-22*
# API Changelog

This document tracks significant API changes between Don't Starve Together versions.

## [API Version 627870 (2024-08-22)](https://forums.kleientertainment.com/game-updates/dst/627870-r2385/)

### [Mod Release ID](mod-release-ids#complete-release-id-list)
- Added new mod release ID: `R35_SANITYTROUBLES`

### Cave System Changes
- Added support for Winona's vine bridges in the Caves
- Added support for ghosts to float over gaps in the Caves

## [API Version 625420 (2024-08-08)](https://forums.kleientertainment.com/game-updates/dst/625420-r2381/)

### [AnimState System Changes](../core/animstate-system.md#visibility-and-layers)
- Added new method `AnimState:SetForceSinglePass(bool)` for UIAnims with alpha fades for clients without stencil buffers

## [API Version 624447 (2023-08-01)](https://forums.kleientertainment.com/game-updates/dst/624447-r2377/)

### Builder Component Changes
- Added support for recipes unlocked by skill tree skills
- All existing skill tree builder tags have been removed in favor of builder skills
- New methods:
  - `builder:AddBuilderSkill(skill_name)` - Add a builder skill from a character's skill tree
  - `builder:RemoveBuilderSkill(skill_name)` - Remove a builder skill
  - `builder:HasBuilderSkill(skill_name)` - Check if builder has a specific skill

### [Recipe System Changes](../components/builder.md#builder-skills)
- Recipe configuration now prefers `builder_skill` over `builder_tag` for skill tree integration
- Example update:
  ```lua
  -- Old method (pre-624447)
  Recipe2("item", ingredients, tech, {builder_tag="character_skill"})
  
  -- New method (624447+)
  Recipe2("item", ingredients, tech, {builder_skill="character_skill"})
  ```

### New TUNING Constants
- Added `TUNING.ANTLION_DEAGGRO_DIST` - Distance at which Antlion deaggros

## API Version 619045 (2023-07-06)

Initial documented API version.

## How to Read This Changelog

Each entry follows this format:
- **Version**: The game version where the change was introduced
- **Date**: When the change was released
- **Type**: Whether it's an addition, modification, removal, or deprecation
- **Component/System**: Which part of the API was affected
- **Description**: Detailed explanation of the change
- **Impact**: How this might affect existing mods

## Version History

### Game Version 517850 (August 31, 2022)

#### Added
- **Component**: Added `shard_player` component for handling player transitions between shards
  - New methods: `SetMigrationData()`, `DoMigration()`
  - Allows for transferring player data between shards

#### Modified
- **Component**: Updated `hunger` component
  - Added `hungerrate` property to allow for more granular control of hunger drain
  - Changed how `burning` property interacts with hunger drain calculation

#### Deprecated
- **Global Function**: `GetPlayer()` is now deprecated
  - Use `ThePlayer` global variable instead
  - Will be removed in a future update

#### Fixed
- **Component**: Fixed issue with `inventoryitem` component where `OnDropped` event wasn't firing consistently

### Game Version 517725 (July 15, 2022)

#### Added
- **Global Object**: Added `TheNet:GetClientTable()` method
  - Returns information about all connected clients
  - Includes userids, names, and prefabs

#### Modified
- **Component**: Updated `health` component
  - Added `SetInvincible(bool)` method
  - Modified `DoDelta()` to respect invincibility state

#### Removed
- **Component**: Removed deprecated `sleeper.hibernate` property
  - Use `sleeper:SetHibernate(bool)` method instead

### Game Version 517600 (June 2, 2022)

#### Added
- **System**: Added support for custom minimap icons
  - New function `AddMinimapAtlas(atlas_path)`
  - New component property `minimap.icon` to set custom icons

#### Modified
- **Component**: Updated `combat` component
  - Changed how attack cooldown is calculated
  - Added `min_attack_period` property

#### Deprecated
- **Component Method**: `container:Open()` without parameters is deprecated
  - Use `container:Open(opener)` with the opener entity instead

## Migration Guides

### Migrating from pre-517850

If your mod was designed for versions before 517850, consider these changes:

1. Replace all instances of `GetPlayer()` with `ThePlayer`
2. Update hunger rate calculations to use the new `hungerrate` property
3. Check for shard compatibility if your mod works across multiple shards

### Migrating from pre-517600

If your mod was designed for versions before 517600, consider these changes:

1. Update container opening code to include the opener entity
2. Review combat cooldown logic for compatibility with the new calculation method
3. Use the new minimap icon system if your mod adds custom map icons

## Compatibility Tools

When dealing with API changes, these helper functions can assist with maintaining compatibility across game versions:

```lua
-- Check if a function exists before using it
function SafeCall(fn, ...)
    if type(fn) == "function" then
        return fn(...)
    end
    return nil
end

-- Get API version safely
function GetAPIVersion()
    if TheSim and TheSim.GetGameVersion then
        return TheSim:GetGameVersion()
    end
    return "Unknown"
end

-- Check if current version is at least the specified version
function IsVersionAtLeast(major, minor, revision)
    local version = GetAPIVersion()
    -- Parse version string and compare
    -- Implementation depends on version format
    return true -- Replace with actual comparison
end
```

## Contributing

This changelog is maintained by the community. If you notice API changes that aren't documented here:

1. Verify the change across multiple game versions
2. Document the old and new behavior with code examples
3. Note which game version introduced the change
4. Submit a pull request to update this document

Your contributions help the entire modding community stay informed about API changes. 
