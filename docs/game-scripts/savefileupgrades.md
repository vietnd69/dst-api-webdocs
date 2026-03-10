---
id: savefileupgrades
title: Savefileupgrades
description: Provides utilities to upgrade savefile data structures across game versions, including world generation presets, shard index metadata, and worldgen overrides.
tags: [savefile, migration, worldgen, upgrade]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: ffcab76f
system_scope: world
---

# Savefileupgrades

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`savefileupgrades` is a standalone module (not an ECS component) that encapsulates all required logic for upgrading legacy savefile data structures to newer versions. It supports backward compatibility across game updates—including major expansions such as *A New Reign* and *Return of Them*—by applying versioned upgrade functions to `savedata`, world presets, shard indexes, and worldgen override files. Upgrade functions are applied sequentially based on version numbers, ensuring consistency without requiring client-side intervention.

## Usage example
```lua
local SavefileUpgrades = require("savefileupgrades")

-- Upgrade a world preset from v1 to v2
local upgradedPreset = SavefileUpgrades.utilities.UpgradeUserPresetFromV1toV2(preset, customPresets)

-- Upgrade saved world data to latest version
SavefileUpgrades.upgrades[versionIndex].fn(savedata)

-- Upgrade shard index metadata from v4 to v5
SavefileUpgrades.utilities.UpgradeShardIndexFromV4toV5(shardindex)
```

## Dependencies & tags
**Components used:** None  
**Tags:** Adds or updates keys in `savedata.map.persistdata.retrofitforestmap_anr` and `savedata.map.persistdata.retrofitcavemap_anr` (e.g., `"retrofit_part1"`, `"retrofit_turnoftides"`, `"retrofit_balatro_content"`), and top-level `savedata` flags like `retrofit_nodeidtilemap`, `retrofit_waterlogged_waterlog_setpiece`, etc. These flags indicate retrofitting status for content patches.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `VERSION` | number | `5.22` | Highest upgrade version supported. Automatically computed from `upgrades` list. |
| `utilities` | table | — | Container for upgrade functions for presets, shard indexes, and worldgen overrides. |
| `upgrades` | table | — | Ordered list of `{ version = number, fn = function(savedata) }` entries defining sequential savefile upgrades. |

## Main functions
### `FlagForRetrofitting_Forest(savedata, flag_name)`
* **Description:** Adds a retrofit flag to the forest world's `persistdata.retrofitforestmap_anr` table if present.
* **Parameters:**  
  `savedata` (table or `nil`) — Savefile data.  
  `flag_name` (string) — Key to set to `true` in the retrofit table.
* **Returns:** Nothing.

### `FlagForRetrofitting_Cave(savedata, flag_name)`
* **Description:** Adds a retrofit flag to the cave world's `persistdata.retrofitcavemap_anr` table if present.
* **Parameters:**  
  `savedata` (table or `nil`) — Savefile data.  
  `flag_name` (string) — Key to set to `true` in the retrofit table.
* **Returns:** Nothing.

### `UpgradeUserPresetFromV1toV2(preset, custompresets)`
* **Description:** Upgrades a user-defined world preset from version 1 to version 2, resolving base preset references and applying overrides.
* **Parameters:**  
  `preset` (table) — Preset data to upgrade.  
  `custompresets` (table) — List of available custom presets (for recursive base resolution).
* **Returns:** (table) — Upgraded preset data.

### `UpgradeUserPresetFromV2toV3(preset, custompresets)`
* **Description:** Upgrades preset data for *A New Reign* (Part 1), populating story setpieces for forest maps.
* **Parameters:**  
  `preset` (table) — Preset data to upgrade.  
  `custompresets` (table) — Ignored in this version.
* **Returns:** (table) — Upgraded preset with `"Sculptures_*"` setpieces added.

### `UpgradeUserPresetFromV3toV4(preset, custompresets)`
* **Description:** Upgrades preset data for *Return of Them: Turn of Tides*, enabling ocean-related overrides for forest maps.
* **Parameters:**  
  `preset` (table) — Preset data to upgrade.  
  `custompresets` (table) — Ignored.
* **Returns:** (table) — Upgraded preset with `overrides.has_ocean` and related flags set.

### `UpgradeSavedLevelFromV1toV2(level, master_world)`
* **Description:** Upgrades saved level data (with embedded preset info) to version 2, merging defaults and overrides.
* **Parameters:**  
  `level` (table) — Level data to upgrade.  
  `master_world` (table) — Unused but kept for API consistency.
* **Returns:** (table) — Upgraded level data.

### `UpgradeSavedLevelFromV2toV3(level, master_world)`
* **Description:** Upgrades level data for *A New Reign* Part 1 (adds story setpieces).
* **Parameters:**  
  `level` (table) — Level data to upgrade.  
  `master_world` (table) — Unused.
* **Returns:** (table) — Upgraded level.

### `UpgradeSavedLevelFromV3toV4(level, master_world)`
* **Description:** Upgrades level data for *Turn of Tides* (enables ocean overrides).
* **Parameters:**  
  `level` (table) — Level data to upgrade.  
  `master_world` (table) — Unused.
* **Returns:** (table) — Upgraded level.

### `UpgradeShardIndexFromV1toV2(shardindex)`
* **Description:** Upgrades shard index metadata to v2 by attempting to restore overrides from legacy world files for *Forgotten Knowledge*.
* **Parameters:**  
  `shardindex` (table) — Shard index data (contains `:GetGenOptions()`, `:GetSlot()`, `:GetShard()`, `:GetSession()`).
* **Returns:** Nothing. Modifies `shardindex` in-place and marks it dirty.

### `UpgradeShardIndexFromV2toV3(shardindex)`
* **Description:** Upgrades custom preset references in shard index for *A New Reign* (migrates `CUSTOM_PRESET_*` IDs).
* **Parameters:**  
  `shardindex` (table) — Shard index data.
* **Returns:** Nothing. Modifies `shardindex.id`, `custom_settings_id`, and `custom_worldgen_id`.

### `UpgradeShardIndexFromV3toV4(shardindex)`
* **Description:** Placeholder upgrade for *console sync* compatibility.
* **Parameters:**  
  `shardindex` (table) — Shard index data.
* **Returns:** Nothing. Sets `shardindex.version = 4`.

### `ApplyPlaystyleOverridesForGameMode(world_options, game_mode)`
* **Description:** Applies predefined overrides based on the playstyle (e.g., `"wilderness"` → `"scatter"` spawn, `"endless"` → `"always"` regrowth).
* **Parameters:**  
  `world_options` (table or `nil`) — Contains `overrides`.  
  `game_mode` (string) — Either `"wilderness"` or `"endless"`.
* **Returns:** Nothing. Modifies `world_options.overrides` in-place.

### `UpgradeShardIndexFromV4toV5(shardindex)`
* **Description:** Migrates legacy `"game_mode"` (wilderness/endless) to `"playstyle"` and updates `overrides`.
* **Parameters:**  
  `shardindex` (table) — Shard index data.
* **Returns:** Nothing. Sets `server.playstyle`, `server.game_mode = "survival"`, and clears `server.intention`.

### `UpgradeWorldgenoverrideFromV1toV2(wgo)`
* **Description:** Upgrades deprecated `worldgenoverride.lua` format to current schema, consolidating all nested overrides into a single flat `overrides` table.
* **Parameters:**  
  `wgo` (table) — Legacy worldgen override data.
* **Returns:** (table) — Upgraded schema (only `preset`, `overrides`, etc., preserved). Logs a warning with expected format.

### `ConvertSaveSlotToShardIndex(saveindex, slot, shardindex)`
* **Description:** Migrates per-slot data from `SaveIndex` format to `ShardIndex` format.
* **Parameters:**  
  `saveindex` (table) — Legacy `SaveIndex` data.  
  `slot` (number) — Slot index.  
  `shardindex` (table) — Target `ShardIndex` instance.
* **Returns:** Nothing. Populates `shardindex.world`, `shardindex.server`, `shardindex.session_id`, `shardindex.enabled_mods`.

### `ConvertSaveIndexSlotToShardIndexSlots(...)`
* **Description:** Converts all shard data for a slot, handling multi-level (Master/Caves) slots.
* **Parameters:**  
  `savegameindex`, `shardsavegameindex`, `slot`, `ismultilevel` — Standard conversion inputs.
* **Returns:** Nothing.

### `ConvertSaveIndexToShardSaveIndex(savegameindex, shardsavegameindex)`
* **Description:** Converts entire `SaveIndex` to `ShardSaveIndex` (batch migration of all slots).
* **Parameters:**  
  `savegameindex`, `shardsavegameindex` — Source and target indices.
* **Returns:** Nothing.

### Upgrade functions in `t.upgrades`
* **Description:** Versioned patches applied to `savedata` (e.g., season conversions, ocean initialization, content flags, node ID map fixes).
* **Parameters:** Each function accepts `savedata` (table or `nil`).
* **Returns:** Nothing. Modifies `savedata` in-place, setting retrofit flags and top-level `retrofit_*` keys.
* **Error states:** Many functions are no-ops if `savedata` or relevant maps/tables are `nil`. Version-based guards (`if version ~= N`) prevent redundant runs.

## Events & listeners
None. This module is stateless and not tied to entity lifecycles or event dispatching.