---
id: api-updates
title: API Updates and Changes
sidebar_position: 5
last_updated: 2024-08-22
---
*Last Update: 2024-08-22*
# API Updates and Changes

The Don't Starve Together API evolves over time as Klei Entertainment adds new features, fixes bugs, and makes balance changes. This page explains how API changes are documented and how to keep your mods updated.

## API Versioning

Don't Starve Together uses the game build number as its API version. The current documented API version is **627870** (as of August 22, 2024).

## Finding API Changes

API changes are typically announced in these locations:

1. **Game Update Notes**: Check the "Notes for Modders" section in game update posts on the [Klei Forums](https://forums.kleientertainment.com/game-updates/dst/).

2. **API Changelog**: For a comprehensive list of all API changes, check the [API Changelog](api-changelog.md) document.

3. **Mod Release IDs**: For tracking game updates and mod compatibility, check the [Mod Release IDs](mod-release-ids.md) document.

4. **Discord Server**: Join the [Klei Discord](https://discord.gg/klei) to discuss API changes with other modders.

## Recent API Changes

### API Version 627870 (August 22, 2024)
- Added new mod release ID: `R35_SANITYTROUBLES`
- Added support for Winona's vine bridges in the Caves
- Added support for ghosts to float over gaps in the Caves

### API Version 625420 (August 8, 2024)
- Added new method `AnimState:SetForceSinglePass(bool)` for UIAnims with alpha fades for clients without stencil buffers

[See complete changelog](api-changelog.md)

## Updating Your Mods

When a new API version is released, you should:

1. **Check for breaking changes**: Review the changelog to identify any changes that might affect your mods.

2. **Test your mods**: Load your mods in the latest game version to test for any issues.

3. **Update your code**: Make necessary changes to accommodate API updates.

4. **Update your mod's API version**: Update the API version in your mod's modinfo.lua file:

```lua
api_version = 10
```

For more detailed guidance on updating mods, see the [Mod Updating Guide](mod-updating-guide.md).

## Backwards Compatibility

Klei generally tries to maintain backwards compatibility, but sometimes breaking changes are necessary. For more information about handling backwards compatibility, see the [Backwards Compatibility](backwards-compatibility.md) document.

## Reporting API Issues

If you encounter issues with the API or believe you've found a bug:

1. Post in the #dst-modding channel on the [Klei Discord](https://discord.gg/klei).

2. Report the issue on the [Klei Bug Tracker](https://forums.kleientertainment.com/klei-bug-tracker/dont-starve-together/) 
