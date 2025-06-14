---
id: api-changelog
title: API Changelog
sidebar_position: 6
---

# API Changelog

This document provides a detailed chronological record of changes to the Don't Starve Together API across different game versions. While the [API Updates and Changes](api-updates.md) document provides guidance on handling API changes, this changelog serves as a comprehensive reference of all modifications made to the API.

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