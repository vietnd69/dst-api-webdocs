---
id: skilltree_wormwood
title: Skilltree Wormwood
description: Data configuration file defining Wormwood's skill tree structure, including skill definitions, positions, connections, and activation callbacks.
tags: [skilltree, character, data]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: data
source_hash: 23047b5e
system_scope: player
---

# Skilltree Wormwood

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`skilltree_wormwood.lua` is a data configuration file that defines the complete skill tree structure for the Wormwood character. The file exports a `BuildSkillsData` factory function that generates skill definitions with UI positions, group assignments, connection paths, and activation/deactivation callbacks. Skills are organized into four groups: `crafting`, `gathering`, `allegiance1`, and `allegiance2`. The skill tree data is consumed by the skill tree UI system and the `skilltreeupdater` component to track activated skills and apply their effects.

## Usage example
```lua
-- Require the skill tree data module:
local SkillTreeWormwood = require("prefabs/skilltree_wormwood")

-- Build the skills data with SkillTreeFns helper:
local SkillTreeFns = require("components/skilltree_fns")
local data = SkillTreeWormwood(SkillTreeFns)

-- Access skills table:
local skills = data.SKILLS
local root_skill = skills.wormwood_identify_plants2

-- Access orders for UI layout:
local orders = data.ORDERS
```

## Dependencies & tags
**External dependencies:**
- `STRINGS.SKILLTREE.WORMWOOD` -- localized skill titles and descriptions
- `TUNING` -- balance constants for skill effects (damage resist, bloom duration, insulation)
- `SkillTreeFns` -- passed as parameter; provides `MakeCelestialChampionLock`, `CountTags` helpers

**Components used:**
- `bloomness` -- modified by blooming speed skills via `SetDurations()`
- `skilltreeupdater` -- checked via `IsActivated()` for conditional skill effects
- `damagetyperesist` -- modified by allegiance skills via `AddResist()`/`RemoveResist()`
- `damagetypebonus` -- modified by allegiance skills via `AddBonus()`/`RemoveBonus()`
- `temperature` -- modified by overheat protection skill via `inherentsummerinsulation`

**Tags:**
- `farmplantidentifier` -- added/removed by identify plants root skill
- `player_lunar_aligned` -- added/removed by lunar allegiance skills
- `farmplantfastpicker` -- added/removed by farm range skill
- Skill group tags: `crafting`, `blooming`, `allegiance`, `lunar`, `lunar_favor`, `lock`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `UI_LEFT` | constant (local) | `-207` | Left boundary for skill UI positioning. |
| `SKILLTREESTRINGS` | constant (local) | `STRINGS.SKILLTREE.WORMWOOD` | Alias for localized skill tree strings; used in all skill title/desc fields. |
| `UI_RIGHT` | constant (local) | `223` | Right boundary for skill UI positioning. |
| `UI_VERTICAL_MIDDLE` | constant (local) | `8` | Calculated horizontal center: `(UI_LEFT + UI_RIGHT) * 0.5`. |
| `UI_TOP` | constant (local) | `168` | Top boundary for skill UI positioning. |
| `UI_BOTTOM` | constant (local) | `0` | Bottom boundary for skill UI positioning. |
| `TILE_SIZE` | constant (local) | `34` | Size of skill tile in pixels. |
| `TILE_HALFSIZE` | constant (local) | `16` | Half tile size for positioning calculations. |
| `ORDERS` | table | `{...}` | Array of skill group definitions with group name and base position. Groups: `crafting`, `gathering`, `allegiance1`, `allegiance2`. |
| `SKILLS` (returned) | table | --- | Table of all skill definitions keyed by skill ID. Each skill contains title, desc, icon, pos, group, tags, connects, onactivate, ondeactivate. |

## Main functions
### `BuildSkillsData(SkillTreeFns)`
* **Description:** Factory function that constructs the complete Wormwood skill tree data. Takes `SkillTreeFns` helper module as parameter to generate lock conditions and count-based unlocks. Returns a table containing `SKILLS` (all skill definitions) and `ORDERS` (group layout order). Skills include activation callbacks that modify character components (bloomness, temperature, damage resist/bonus) and add/remove entity tags.
* **Parameters:**
  - `SkillTreeFns` -- skill tree helper module providing `MakeCelestialChampionLock`, `CountTags` functions
* **Returns:** Table with `SKILLS` and `ORDERS` keys
* **Error states:** Errors if `SkillTreeFns` is nil or missing required functions (`MakeCelestialChampionLock`, `CountTags`).

### `onactivate(owner, from_load)` (skill callback)
* **Description:** Activation callback defined on individual skills. Called when the skill is activated by the player. Behavior varies by skill:
  - `wormwood_identify_plants2` -- adds `farmplantidentifier` tag to owner
  - `wormwood_allegiance_lunar_*` -- adds `player_lunar_aligned` tag, applies lunar resist vs shadow bonus via `damagetyperesist`/`damagetypebonus`
  - `wormwood_blooming_speed*` -- calls `bloomness:SetDurations()` with upgraded bloom stage durations
  - `wormwood_blooming_overheatprotection` -- sets `temperature.inherentsummerinsulation` to `TUNING.INSULATION_MED_LARGE` if in full bloom
  - `wormwood_blooming_photosynthesis` -- starts watching `isday` world state, calls `UpdatePhotosynthesisState`
  - `wormwood_blooming_farmrange1` -- adds `farmplantfastpicker` tag to owner
* **Parameters:**
  - `owner` -- player entity instance
  - `from_load` -- boolean indicating if activation is from save load (some skills behave differently)
* **Returns:** None
* **Error states:** Errors if `owner` is missing `bloomness` or `skilltreeupdater` components (no nil guards before access in blooming speed skills). `damagetyperesist` and `damagetypebonus` are guarded with nil checks and will not error.

### `ondeactivate(owner, from_load)` (skill callback)
* **Description:** Deactivation callback defined on individual skills. Called when the skill is deactivated (respec or manual toggle). Reverses the effects of `onactivate`:
  - Removes tags added on activation (`farmplantidentifier`, `player_lunar_aligned`, `farmplantfastpicker`)
  - Removes damage resist/bonus via `damagetyperesist:RemoveResist()`/`damagetypebonus:RemoveBonus()`
  - Resets `temperature.inherentsummerinsulation` to `TUNING.INSULATION_SMALL` or `0` based on bloom state
  - Stops watching `isday` world state for photosynthesis skill
* **Parameters:**
  - `owner` -- player entity instance
  - `from_load` -- boolean indicating if deactivation is from save load
* **Returns:** None
* **Error states:** Errors if `owner` is missing `skilltreeupdater` component (no nil guard in allegiance skills). `damagetyperesist`, `damagetypebonus`, and `temperature` are guarded with nil checks or conditional logic.

### `lock_open(prefabname, activatedskills, readonly)` (lock callback)
* **Description:** Conditional unlock function for allegiance lock skills. Determines if a locked skill should be unlocked based on activated skill count:
  - `wormwood_allegiance_count_lock_1` -- unlocks when 5+ skills with `crafting` tag are activated
  - `wormwood_allegiance_count_lock_2` -- unlocks when 5+ skills with `blooming` tag are activated
* **Parameters:**
  - `prefabname` -- string prefab name of the character
  - `activatedskills` -- table of currently activated skill IDs
  - `readonly` -- boolean indicating if this is a read-only check
* **Returns:** Boolean `true` if lock should be open, `false` otherwise
* **Error states:** None — uses `SkillTreeFns.CountTags()` which handles nil inputs gracefully.

## Events & listeners
**World state watchers:**
- `isday` -- watched by `wormwood_blooming_photosynthesis` skill; triggers `UpdatePhotosynthesisState` to toggle photosynthesis behavior based on day/night cycle. Watcher is started in `onactivate` and stopped in `ondeactivate`.