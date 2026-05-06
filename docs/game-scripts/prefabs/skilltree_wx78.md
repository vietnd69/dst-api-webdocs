---
id: skilltree_wx78
title: Skilltree Wx78
description: Data configuration file defining the WX-78 character skill tree structure, including skill nodes, layout positions, groupings, activation callbacks, and allegiance locks.
tags: [wx78, skilltree, character, data]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: data
source_hash: 6ec7aceb
system_scope: player
---

# Skilltree Wx78

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`skilltree_wx78.lua` is a data configuration file that defines the complete skill tree structure for the WX-78 robot character. The file exports a `BuildSkillsData(SkillTreeFns)` factory function that returns a table containing all skill node definitions organized into four groups: Circuitry, Chassis, Drones, and Allegiance. Each skill node specifies visual positioning, connection paths, activation/deactivation callbacks, and lock conditions. The skill tree integrates with multiple components including `damagetypebonus`, `damagetyperesist`, `leader`, `linkeditemmanager`, `skilltreeupdater`, `timer`, and `upgrademoduleowner`.

## Usage example
```lua
-- Require and build the skill tree data:
local BuildSkillsData = require("prefabs/skilltree_wx78")
local SkillTreeFns = require("components/skilltreeupdater") -- Provides CountTags

local skillTreeData = BuildSkillsData(SkillTreeFns)

-- Access skill definitions:
local skills = skillTreeData.SKILLS
local orders = skillTreeData.ORDERS

-- Access a specific skill node:
local betterCharge = skills.wx78_circuitry_bettercharge
print(betterCharge.title) -- STRINGS.SKILLTREE.WX78.WX78_BETTER_CHARGE_TITLE
print(betterCharge.pos[1], betterCharge.pos[2]) -- Position coordinates

-- Iterate through skill groups:
for skillId, skillData in pairs(skills) do
    if skillData.group == "circuitry" then
        -- Process circuitry skills
    end
end
```

## Dependencies & tags
**External dependencies:**
- `prefabs/wx78_common` -- Provides `ActivateSocketsIn` and `DeactivateSocketsIn` helper functions for socket management
- `STRINGS.SKILLTREE.WX78` -- Localization strings for skill titles and descriptions
- `TUNING.SKILLS.WX78` -- Balance constants for skill effects (charge multipliers, resist values, damage bonuses)
- `TUNING.WX78_MAXCHARGELEVEL_SKILL` -- Maximum charge level when circuitry slot skill is active
- `TUNING.WX78_INITIAL_MAXCHARGELEVEL` -- Default maximum charge level
- `TheGenericKV` -- Key-value storage for checking boss kill progress (celestialchampion_killed, fuelweaver_killed)

**Components used:**
- `damagetypebonus` -- AddBonus/RemoveBonus for allegiance damage bonuses vs opposing faction
- `damagetyperesist` -- AddResist/RemoveResist for allegiance damage resistance
- `leader` -- RemoveFollower to detach possessed bodies when allegiance changes
- `linkeditemmanager` -- ForEachLinkedItemForPlayerOfPrefab to apply skill effects to backup bodies
- `skilltreeupdater` -- CountSkillTag to check skill tag counts for lock conditions
- `timer` -- GetTimeLeft/SetTimeLeft for charge regeneration time adjustment
- `upgrademoduleowner` -- SetMaxCharge to modify circuit slot capacity

**Tags:**
- `circuitry` -- Circuitry group skills
- `chassis` -- Chassis group skills
- `drones` -- Drone-related skills
- `allegiance` -- Allegiance lock and faction skills
- `lock` -- Lock node marker
- `wx78_maxbody` -- Skills that increase maximum backup body count
- `lunar_favor` -- Lunar allegiance faction tag
- `shadow_favor` -- Shadow allegiance faction tag
- `player_lunar_aligned` -- Added when lunar allegiance activated
- `player_shadow_aligned` -- Added when shadow allegiance activated
- `drone_zap_user` -- Added when zap drone skill activated
- `possessedbody` -- Tag checked on followers when removing allegiance

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SPACER` | constant (local) | `40` | Base spacing unit for skill node positioning in the UI grid. |
| `TEXT_SPACER` | constant (local) | `30` | Vertical spacing for skill group text labels (`SPACER * 0.75`). |
| `LOCK_SPACER` | constant (local) | `34` | Spacing multiplier for lock node positioning (`SPACER * 0.85`). |
| `BIG_GEAR_SHIFT` | constant (local) | `2` | Vertical offset for larger gear elements (`SPACER * 0.05`). |
| `ORIGIN_*` | constant (local) | varies | Coordinate origins for each skill group (CIRCUITRY, CHASSIS, DRONES, ALLEGIANCE). Used to calculate absolute node positions. |
| `GROUPS` | table | `{CIRCUITRY, CHASSIS, DRONES, ALLEGIANCE}` | String constants for skill group identifiers used in `group` and `tags` fields. |
| `ORDERS` | table | `{{group, {x, y}}, ...}` | Array defining display order and label positions for each skill group in the UI. |
| `SKILLS` | table | --- | Returned by `BuildSkillsData`; contains all skill node definitions keyed by skill ID. |

## Main functions
### `BuildSkillsData(SkillTreeFns)`
* **Description:** Factory function that constructs and returns the complete WX-78 skill tree data structure. Accepts `SkillTreeFns` (typically from `skilltreeupdater` component) to enable tag counting for lock conditions. Returns a table with `SKILLS` (all skill node definitions) and `ORDERS` (UI layout ordering).
* **Parameters:**
  - `SkillTreeFns` -- table providing `CountTags(prefabname, tag, activatedskills)` function for evaluating lock conditions
* **Returns:** Table with structure `{SKILLS = {...}, ORDERS = {...}}`
* **Error states:** None — function is pure data construction with no external state dependencies beyond passed parameters.

### `ActivateBetaCircuitsInBody(item, player)` (local)
* **Description:** Helper callback that activates beta circuit states on a backup body item. Called via `linkeditemmanager:ForEachLinkedItemForPlayerOfPrefab` when body circuits skill is activated.
* **Parameters:**
  - `item` -- backup body entity instance
  - `player` -- player entity instance
* **Returns:** None
* **Error states:** None — guards with `if item.TryToActivateBetaCircuitStates` before calling.

### `DeactivateBetaCircuitsInBody(item, player)` (local)
* **Description:** Helper callback that deactivates beta circuit states on a backup body item. Called via `linkeditemmanager` when body circuits skill is deactivated.
* **Parameters:**
  - `item` -- backup body entity instance
  - `player` -- player entity instance
* **Returns:** None
* **Error states:** None — guards with `if item.TryToDeactivateBetaCircuitStates` before calling.

### `CheckCircuitSlotStatesInBody(item, player)` (local)
* **Description:** Helper callback that checks circuit slot states on a backup body item. Called when circuitry slot skill is activated or deactivated to sync state across linked bodies.
* **Parameters:**
  - `item` -- backup body entity instance
  - `player` -- player entity instance
* **Returns:** None
* **Error states:** None — guards with `if item.CheckCircuitSlotStatesFrom` before calling.

### `ActivateGestaltTrapSocketsInBody(item, player)` (local)
* **Description:** Helper callback that activates gestalt trapper sockets on a backup body. Called when lunar allegiance is activated to apply socket effects to all linked bodies.
* **Parameters:**
  - `item` -- backup body entity instance
  - `player` -- player entity instance
* **Returns:** None
* **Error states:** None — delegates to `WX78Common.ActivateSocketsIn`.

### `DeactivateGestaltTrapSocketsInBody(item, player)` (local)
* **Description:** Helper callback that deactivates gestalt trapper sockets on a backup body. Called when lunar allegiance is deactivated.
* **Parameters:**
  - `item` -- backup body entity instance
  - `player` -- player entity instance
* **Returns:** None
* **Error states:** None — delegates to `WX78Common.DeactivateSocketsIn`.

### `ActivateShadowSocketsInBody(item, player)` (local)
* **Description:** Helper callback that activates shadow sockets on a backup body. Called when shadow allegiance is activated.
* **Parameters:**
  - `item` -- backup body entity instance
  - `player` -- player entity instance
* **Returns:** None
* **Error states:** None — delegates to `WX78Common.ActivateSocketsIn`.

### `DeactivateSocketsInBody(item, player)` (local)
* **Description:** Helper callback that deactivates all sockets on a backup body. Called when shadow allegiance is deactivated.
* **Parameters:**
  - `item` -- backup body entity instance
  - `player` -- player entity instance
* **Returns:** None
* **Error states:** None — delegates to `WX78Common.DeactivateSocketsIn`.

### `OnBackupBodyMaxCountLowered(inst)` (local)
* **Description:** Callback function that detaches excess backup bodies when a `wx78_maxbody` skill is deactivated. Ensures the number of attached bodies does not exceed the new maximum allowed by remaining skills.
* **Parameters:**
  - `inst` -- player entity instance with `wx78_classified` component
* **Returns:** None
* **Error states:** Silently skips body detachment if `inst.wx78_classified` is nil (guard present but function cannot perform intended behavior).

### `lock_open(prefabname, activatedskills, readonly)` (lock condition function)
* **Description:** Lock condition evaluator for allegiance lock nodes. Returns `true` if lock is open (skill can be activated), `false` if locked, or `"question"` if status is unknown in readonly mode. Checks maximum body count, opposing faction skills, and boss kill progress.
* **Parameters:**
  - `prefabname` -- string prefab name of the player
  - `activatedskills` -- table of currently activated skill IDs
  - `readonly` -- boolean; if true, returns status string instead of blocking
* **Returns:** `true` (open), `false` (locked), or `"question"` (unknown, readonly mode)
* **Error states:** None — all checks are guarded with proper conditionals.

## Skill Node Structure
Each skill node in the `SKILLS` table follows this schema:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string key | Conditional | `STRINGS.SKILLTREE` key for display title. Omitted for lock nodes. |
| `desc` | string key | Yes | `STRINGS.SKILLTREE` key for description text. |
| `icon` | string | Conditional | Icon asset name. Omitted for lock nodes. |
| `pos` | table | Yes | `{x, y}` coordinates relative to group origin. |
| `group` | string | Yes | Group identifier from `GROUPS` table. |
| `tags` | table | Yes | Array of tags for skill filtering and counting. |
| `root` | boolean | Optional | `true` if this is a root node (no prerequisites). |
| `connects` | table | Optional | Array of skill IDs this node connects to (children). |
| `forced_focus` | table | Optional | Navigation hints for UI focus movement (`up`, `down`, `left`, `right`). |
| `defaultfocus` | boolean | Optional | `true` to set as default focused skill on open. |
| `onactivate` | function | Optional | Callback fired when skill is activated. Receives `(inst, fromload)`. |
| `ondeactivate` | function | Optional | Callback fired when skill is deactivated. Receives `(inst, fromload)`. |
| `locks` | table | Optional | Array of lock node IDs that gate this skill. |
| `lock_open` | function | Lock nodes only | Function evaluating whether lock is open. |

## Skill Groups
### Circuitry (`GROUPS.CIRCUITRY`)
Focuses on charge regeneration, circuit buffs (alpha/beta/gamma), and upgrade module capacity. Root skills: `wx78_circuitry_betterunplug`, `wx78_circuitry_bettercharge`, `wx78_circuitry_alphabuffs_1`, `wx78_circuitry_betabuffs_1`, `wx78_circuitry_gammabuffs_1`.

### Chassis (`GROUPS.CHASSIS`)
Controls backup body capacity, ghost revive mechanics, and body circuit integration. Root skills: `wx78_extrabody_1`. Includes allegiance-adjacent skills like `wx78_bodycircuits`.

### Drones (`GROUPS.DRONES`)
Unlocks scout, delivery, and zap drone capabilities. Root skills: `wx78_scoutdrone_1`, `wx78_deliverydrone_1`, `wx78_zapdrone_1`. Zap drone adds `drone_zap_user` tag on activation.

### Allegiance (`GROUPS.ALLEGIANCE`)
Faction choice between Lunar and Shadow. Mutually exclusive — activating one locks out the other. Requires maximum body skills and boss kills to unlock. Adds faction tags and damage resist/bonus modifiers.

## Events & listeners
**Pushes:**
- None identified — skill tree data file does not push events directly; callbacks may push events via component methods.

**Listens to:**
- None identified — skill definitions register callbacks but do not subscribe to events in this file.

**World state watchers:**
- None identified — lock conditions check `TheGenericKV` but do not watch world state variables.