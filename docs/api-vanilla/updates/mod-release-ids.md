---
id: mod-release-ids
title: Mod Release IDs
sidebar_position: 10
last_updated: 2024-08-22
---
*Last Update: 2024-08-22*
# Mod Release IDs

Mod Release IDs are identifiers used in Don't Starve Together to track major game updates and help mod developers handle version-specific features and compatibility. This document provides a reference for all mod release IDs used in the game.

## Understanding Release IDs

Each major Don't Starve Together update is assigned a unique release ID, typically following the format `R##_NAME` where:
- `R##` is a sequential number (e.g., R35)
- `NAME` represents the update theme or content focus (e.g., SANITYTROUBLES)

Release IDs can be used in your mods to check for specific game versions and conditionally enable or disable features based on compatibility.

## Using Release IDs in Mods

You can check for the availability of specific release IDs in your mod code:

```lua
-- Check if a specific update is available
if ReleaseID and ReleaseID.R35_SANITYTROUBLES then
    -- Enable features that depend on R35_SANITYTROUBLES update
end
```

This allows your mod to use new features when available while maintaining compatibility with older game versions.

## Complete Release ID List

Below is a chronological list of all release IDs in Don't Starve Together:

| Release ID | Update Name | Game Version | Release Date |
|------------|-------------|--------------|-------------|
| R01_ANR_PART1 | A New Reign (Part 1) | | |
| R02_ANR_WARTSANDALL | A New Reign: Warts and All | | |
| R03_ANR_ARTSANDCRAFTS | A New Reign: Arts and Crafts | | |
| R04_ANR_CUTEFUZZYANIMALS | A New Reign: Cute Fuzzy Animals | | |
| R05_ANR_HERDMENTALITY | A New Reign: Herd Mentality | | |
| R06_ANR_AGAINSTTHEGRAIN | A New Reign: Against the Grain | | |
| R07_ANR_HEARTOFTHERUINS | A New Reign: Heart of the Ruins | | |
| R08_ROT_TURNOFTIDES | Return of Them: Turn of Tides | | |
| R09_ROT_SALTYDOG | Return of Them: Salty Dog | | |
| R09_ROT_HOOKLINEANDINKER | Return of Them: Hook, Line, and Inker | | |
| R11_ROT_SHESELLSSEASHELLS | Return of Them: She Sells Seashells | | |
| R12_ROT_TROUBLEDWATERS | Return of Them: Troubled Waters | | |
| R13_ROT_FORGOTTENKNOWLEDGE | Return of Them: Forgotten Knowledge | | |
| R14_FARMING_REAPWHATYOUSOW | Reap What You Sow | | |
| R15_QOL_WORLDSETTINGS | Quality of Life: World Settings | | |
| R16_ROT_MOONSTORMS | Return of Them: Moonstorms | | |
| R17_WATERLOGGED | Waterlogged | | |
| R18_QOL_SERVERPAUSING | Quality of Life: Server Pausing | | |
| R19_REFRESH_WOLFGANG | Character Refresh: Wolfgang | | |
| R20_QOL_CRAFTING4LIFE | Quality of Life: Crafting 4 Life | | |
| R21_REFRESH_WX78 | Character Refresh: WX-78 | | |
| R22_PIRATEMONKEYS | Pirate Monkeys | | |
| R23_REFRESH_WICKERBOTTOM | Character Refresh: Wickerbottom | | |
| R24_STS_ALITTLEDRAMA | Shared Through Steam: A Little Drama | | |
| R25_REFRESH_WAXWELL | Character Refresh: Maxwell | | |
| R26_LOBBY_NETWORKQOL | Lobby Network QOL | | |
| R27_REFRESH_WILSON | Character Refresh: Wilson | | |
| R28_LUNAR_RIFT | Lunar Rift | | |
| R29_SHADOW_RIFT | Shadow Rift | | |
| R30_ST_WOODWOLFWORM | Skill Tree: Woodie, Wolfgang, and Wormwood | | |
| R31_LUNAR_MUTANTS | Lunar Mutants | | |
| R32_ST_WATHGRITHRWILLOW | Skill Tree: Wathgrithr (Wigfrid) and Willow | | |
| R33_QOL_SPRINGCLEANING | Quality of Life: Spring Cleaning | | |
| R34_OCEANQOL_WINONAWURT | Ocean QOL: Winona and Wurt | | |
| R35_SANITYTROUBLES | Sanity Troubles | 627870 | August 22, 2024 |

## Notes on Release ID Usage

- Release IDs provide a more semantic way to check for game features than raw version numbers
- The currently active release ID can be found via `ReleaseID.Current`
- When backward compatibility is important, check for the existence of specific release IDs rather than assuming they exist
- New release IDs are added with each major update to the game

## See Also

- [API Updates](api-updates.md) - For general information about API changes
- [API Changelog](api-changelog.md) - For a detailed history of API changes
- [Backwards Compatibility](backwards-compatibility.md) - For strategies to maintain compatibility with multiple game versions 