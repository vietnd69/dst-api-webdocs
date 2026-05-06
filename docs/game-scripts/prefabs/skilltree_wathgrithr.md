---
id: skilltree_wathgrithr
title: Skilltree Wathgrithr
description: Data configuration file that defines Wigfrid's skill tree layout, skill nodes, activation effects, and group ordering for the character progression system.
tags: [skilltree, wigfrid, character, progression]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 7aa0c1db
system_scope: player
---

# Skilltree Wathgrithr

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`skilltree_wathgrithr.lua` is a data configuration file that defines the complete skill tree structure for Wigfrid (Wathgrithr). It exports a `BuildSkillsData` function that generates skill node definitions with positions, connections, activation/deactivation callbacks, and accomplishment-based locks. The file does not create entities directly but provides configuration data consumed by the skill tree UI and progression system. Skill effects modify components like `planardefense`, `damagetyperesist`, `damagetypebonus`, and `rider` when activated.

## Usage example
```lua
-- Require the skill tree data builder:
local BuildSkillsData = require("prefabs/skilltree_wathgrithr")

-- Build the skill tree data with SkillTreeFns passed from the skill tree system:
local skillTreeData = BuildSkillsData(SkillTreeFns)

-- Access skills and group ordering:
local skills = skillTreeData.SKILLS
local orders = skillTreeData.ORDERS

-- Reference a specific skill node:
local spear1 = skills.wathgrithr_arsenal_spear_1
print(spear1.group, spear1.pos[1], spear1.pos[2])
```

## Dependencies & tags
**External dependencies:**
- `STRINGS.SKILLTREE.WATHGRITHR` -- localization strings for skill titles and descriptions
- `TUNING.SKILLS.WATHGRITHR` -- tuning constants for skill values (planar defense, resistances, unlock counts)
- `UPGRADETYPES.SPEAR_LIGHTNING` -- upgrade type identifier for lightning spear skills
- `TheGenericKV:GetKV()` -- generic key-value storage for accomplishment tracking
- `SkillTreeFns` -- passed as parameter; provides lock factory functions and skill counting utilities

**Components used:**
- `planardefense` -- modified by CombatDefense skill (AddBonus/RemoveBonus)
- `damagetyperesist` -- modified by Allegiance skills (AddResist/RemoveResist)
- `damagetypebonus` -- modified by Allegiance skills (AddBonus/RemoveBonus)
- `rider` -- checked by Beefalo skill (IsRiding)

**Tags:**
- `player_shadow_aligned` -- added/removed by AllegianceShadow skill
- `player_lunar_aligned` -- added/removed by AllegianceLunar skill
- `wathgrithrshielduser` -- added/removed by arsenal_shield_1 skill
- `battlesongcontaineruser` -- added/removed by songs_container skill
- `UPGRADETYPES.SPEAR_LIGHTNING.."_upgradeuser"` -- added/removed by arsenal_spear_5 skill

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `POS_Y_1` to `POS_Y_5` | constant (local) | `180` to `25` | Vertical position constants for skill node rows. Used to calculate all skill Y coordinates. |
| `ALLEGIANCE_POS_Y_1` to `ALLEGIANCE_POS_Y_4` | constant (local) | varies | Vertical positions for allegiance skill nodes. Derived from POS_Y constants. |
| `ARSENAL_SHIELD_Y_1`, `ARSENAL_SHIELD_Y_2` | constant (local) | varies | Vertical positions for shield skill nodes. Calculated as midpoints between other rows. |
| `ARSENAL_UPGRADES_Y_1`, `ARSENAL_UPGRADES_Y_2` | constant (local) | varies | Vertical positions for arsenal upgrade skills. |
| `X_GAP` | constant (local) | `68.5` | Horizontal gap between skill tree columns. |
| `SONGS_POS_X_1`, `SONGS_POS_X_2` | constant (local) | `-215`, `-177` | Horizontal positions for songs skill column. |
| `ARSENAL_POS_X_1` to `ARSENAL_POS_X_4` | constant (local) | varies | Horizontal positions for arsenal skill columns (spear, helmet, shield). |
| `ARSENAL_POS_X_MIDDLE` | constant (local) | varies | Center X position between arsenal columns 2 and 3. |
| `BEEFALO_POS_X` | constant (local) | varies | Horizontal position for beefalo skill column. |
| `COMBAT_POS_X` | constant (local) | varies | Horizontal position for combat skill. |
| `ALLEGIANCE_LOCK_X`, `ALLEGIANCE_SHADOW_X`, `ALLEGIANCE_LUNAR_X` | constant (local) | `202`, `178`, `225` | Horizontal positions for allegiance lock and skill nodes. |
| `TITLE_Y`, `TITLE_Y_2` | constant (local) | `210`, `22` | Vertical positions for group title labels. |
| `POSITIONS` | table | --- | Maps skill node IDs to `{x, y}` coordinate tables. Used to position nodes in the UI. |
| `ORDERS` | table | --- | Array of `{group_name, {title_x, title_y}}` defining skill group display order and title positions. |
| `ONACTIVATE_FNS` | table | --- | Map of skill names to activation callback functions. Called when skill is unlocked/activated. |
| `ONDEACTIVATE_FNS` | table | --- | Map of skill names to deactivation callback functions. Called when skill is deactivated. |

## Main functions
### `CreateAddTagFn(tag)` (local)
* **Description:** Factory function that returns a closure. The returned function adds the specified tag to the player entity when called. Used for skill `onactivate` callbacks.
* **Parameters:**
  - `tag` -- string tag name to add to the entity
* **Returns:** Function that takes `inst` parameter and calls `inst:AddTag(tag)`
* **Error states:** None

### `CreateRemoveTagFn(tag)` (local)
* **Description:** Factory function that returns a closure. The returned function removes the specified tag from the player entity when called. Used for skill `ondeactivate` callbacks.
* **Parameters:**
  - `tag` -- string tag name to remove from the entity
* **Returns:** Function that takes `inst` parameter and calls `inst:RemoveTag(tag)`
* **Error states:** None

### `CreateAccomplishmentLockFn(key)` (local)
* **Description:** Factory function that returns a lock function for accomplishment-based skill unlocking. The lock checks if a generic KV value equals "1". Returns "question" icon if readonly, otherwise boolean lock state.
* **Parameters:**
  - `key` -- string key for TheGenericKV lookup
* **Returns:** Function with signature `(prefabname, activatedskills, readonly) → "question" | boolean`
* **Error states:** None

### `CreateAccomplishmentCountLockFn(key, value)` (local)
* **Description:** Factory function that returns a lock function for count-based accomplishment unlocking. The lock checks if a generic KV value (defaulting to 0) is greater than or equal to the required value.
* **Parameters:**
  - `key` -- string key for TheGenericKV lookup
  - `value` -- number minimum count required (default `1`)
* **Returns:** Function with signature `(prefabname, activatedskills, readonly) → "question" | boolean`
* **Error states:** None

### `BuildSkillsData(SkillTreeFns)`
* **Description:** Main entry point that constructs the complete skill tree data structure. Iterates through all skill definitions, assigns positions from `POSITIONS` table, auto-adds group tags, and resolves localization strings from `STRINGS.SKILLTREE.WATHGRITHR`. Returns a table containing `SKILLS` (all skill node definitions) and `ORDERS` (group display order).
* **Parameters:**
  - `SkillTreeFns` -- table providing skill tree utility functions including `CountSkills`, `MakeFuelWeaverLock`, `MakeNoLunarLock`, `MakeCelestialChampionLock`, `MakeNoShadowLock`
* **Returns:** Table with structure `{ SKILLS = {...}, ORDERS = {...} }`
* **Error states:** Errors if `SkillTreeFns` is nil or missing required methods. Errors if `POSITIONS` table lacks coordinates for a skill ID.

## Events & listeners
**Listens to:** None identified. This is a data configuration file that returns static skill tree definitions. No event listeners are registered.

**Pushes:** None identified. This file does not fire any events directly.

**World state watchers:** None identified. This file does not watch any world state variables.