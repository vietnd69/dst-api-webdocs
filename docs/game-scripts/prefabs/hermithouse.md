---
id: hermithouse
title: Hermithouse
description: Manages the hermit crab’s home structure, including construction progression, friend-based recipe unlocking, hermit crab spawning, and pearl-based decoration scoring.
tags: [building, hermitcrab, crafting, spawning, decorations]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 52ec84ce
system_scope: entity
---

# Hermithouse

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hermithouse` prefab and its variants implement a multi-stage construction structure for the hermit crab. It tracks construction progress, manages spawning and housing of the hermit crab, enables dynamic decoration via the `pearldecorationscore` component (which measures area美化), and controls recipe unlocks based on the hermit crab’s friendship level and decoration score. It integrates heavily with `constructionsite`, `spawner`, `container`, `pearldecorationscore`, `health`, and `craftingstation` components.

## Usage example
```lua
-- Typically used via prefab spawning or construction upgrade, not directly instantiated.
-- Example of programmatic construction upgrade:
local house = SpawnPrefab("hermithouse")
house.components.constructionsite:Enable()
house:StartTrackingHermitCrab()
house:ListenForEvent("pearldecorationscore_updatestatus", function() house.components.constructionsite:Enable() end, TheWorld)
```

## Dependencies & tags
**Components used:** `burnable`, `constructionsite`, `container`, `craftingstation`, `deployhelper`, `drownable`, `friendlevels`, `health`, `pearldecorationscore`, `spawner`, `inspectable`, `lightpostpartner`, `groomer`.

**Tags:** Adds `"structure"`, `"decoratable"`, `"groomer"`, `"dressable"`, `"antlion_sinkhole_blocker"`, `"hermithouse"`, `"constructionsite"` (for stages under construction). Conditionally adds `"highfriendlevel"` on save/load based on hermit crab max friendship.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | number | `5` (for built homes), per construction stage | Current house stage level (1–5). Used to select animation and sound variants. |
| `_hermitcrab` | entity | `nil` | Reference to the active hermit crab entity currently in the house. |
| `ornamentfx` | table | `nil` or `{}` | Map of slot indices to `FxEntity` instances for visual ornamentation. |
| `lightson` | boolean | `false` | Internal flag tracking if interior lights are currently on. |
| `cached_coords` | table | `{x = -1, z = -1}` | Tile coordinates used by `deployhelper` to avoid redundant grid updates. |
| `group_outline` | entity or `nil` | `nil` | Visual grid outline shown during placement; only on clients. |
| `hermitcrab_skin` | net_string | `nil` | Networked string property storing the house’s current skin (only on dressable versions). |
| `inittask`, `doortask`, `ejectchildtask` | TaskFn or `nil` | `nil` | Timers for initialization, door opening/closing, and child ejection. |

## Main functions
### `StartTrackingHermitCrab(inst, hermitcrab)`
* **Description:** Establishes tracking of the hermit crab entity currently in the house (or pending to spawn). Registers `friend_level_changed` event listeners and triggers `CheckUnlocks`.
* **Parameters:** `hermitcrab` (entity, optional) — defaults to `inst.components.spawner.child`.
* **Returns:** Nothing.
* **Error states:** Safely handles missing or stale hermit crab entities; only updates if `inst._hermitcrab` differs.

### `StopTrackingHermitCrab(inst, hermitcrab)`
* **Description:** Stops listening to friend level changes and clears unlocked recipes if the tracked hermit crab leaves or is destroyed.
* **Parameters:** `hermitcrab` (entity).
* **Returns:** Nothing.

### `CheckUnlocks(inst)`
* **Description:** Evaluates the current decoration score and hermit crab friendship level to enable/disable construction of level 5 (`hermithouse2`) and unlockable recipes (e.g., `hermitcrab_lightpost`, `hermitcrab_teashop`). Based on thresholds in `UNLOCKABLE_RECIPES` and `UNLOCKABLE_LVL5_CONSTR`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if either `friendlevels` or `pearldecorationscore` components are disabled.

### `OnConstructed(inst, doer)`
* **Description:** Triggered when construction finishes. Upgrades the house to the next stage, moves the hermit crab to the new house, preserves ornament animations, and sets up initial decorations (laundry, ornaments) for new container-equipped stages.
* **Parameters:** `doer` (entity, optional) — the player who built/construction.
* **Returns:** Nothing.
* **Error states:** Assumes `inst._construction_product` exists; performs final item assignment only if container exists.

### `OnEnableHelper(inst, enabled)`
* **Description:** Controls the visual `gridplacer_group_outline` during placement and repositioning of the house, by drawing the grid footprint based on `GetHermitCrabOccupiedGrid`.
* **Parameters:** `enabled` (boolean) — true when helper should draw outline; false when helper is disabled.
* **Returns:** Nothing.

### `CanEnableHelper(inst)`
* **Description:** Predicate for `deployhelper` to decide if placement is allowed. Returns true only when inside a valid hermit crab decoration area.
* **Parameters:** None.
* **Returns:** boolean — `true` if in valid area, else `false`.

### `IsPointWithinHermitArea(home, pt)`
* **Description:** Checks whether a world point lies within the decoration-eligible area of a given house. Uses server-side `pearldecorationscore:IsPointWithin` or client-side `group_outline` grid data.
* **Parameters:** `home` (entity), `pt` (Vector3).
* **Returns:** boolean.

### `CanDeployHermitDecorationAtPoint(pt, radius)`
* **Description:** Global helper function used elsewhere to determine if a decoration can be placed at a point, respecting house area and optional radius constraints (e.g., overlapping zones).
* **Parameters:** `pt` (Vector3), `radius` (number, optional).
* **Returns:** boolean.

### `AddDecor(inst, data)`
* **Description:** Attaches an ornament visual (`FxEntity`) to a container slot when an item is inserted. Syncs item’s visual state to `ornamentfx[slot]`.
* **Parameters:** `data` (table) — expected to contain `slot` (number) and `item` (entity).
* **Returns:** Nothing.

### `RemoveDecor(inst, data)`
* **Description:** Removes and discards the ornament visual for a given slot when an item is removed.
* **Parameters:** `data` (table) — expected to contain `slot` (number).
* **Returns:** Nothing.

### `RefreshDecor(inst, item)`
* **Description:** Rebuilds the visual effect for an ornament item when it is updated (e.g., reskins).
* **Parameters:** `item` (entity) — the ornament item currently in the container.
* **Returns:** Nothing.

### `OnHermitHouseSkinChanged(inst, skin_build)`
* **Description:** Responds to house skin changes (e.g., Yule variant), reskins ornament items in container slots and updates ornament FxEntity animations.
* **Parameters:** `skin_build` (string, optional) — current skin’s build name.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `friend_level_changed` — on the hermit crab, triggers `CheckUnlocks`.
  - `pearldecorationscore_updatestatus`, `pearldecorationscore_updatescore` — on `TheWorld`, triggers `CheckUnlocks`.
  - `ms_hermitcrab_relocated` — on `TheWorld`, toggles `pearldecorationscore` based on area validity.
  - `itemget`, `itemlose` — on `inst`, used to add/remove ornament visuals.
  - `onremove` — on `inst`, removes house from `HERMIT_HOMES` tracking.
  - `clocksegschanged` — on `TheWorld`, ejection logic if night/dusk duration is sufficient.
  - `teleported`, `teleport_move`, `ms_hermitcrab_relocated` — in `pearldecorationscore:Enable`, to update cached cache when world changes.
- **Pushes:**
  - `pearldecorationscore_updatestatus` — when enabling/disabling decorations (via `pearldecorationscore`).
  - `home_upgraded` — when a construction stage completes successfully, pushed on the hermit crab with `{house=new_house, doer=doer}`.
  - `onvacatehome` — on the vacating hermit crab.
  - `gohomefailed` — indirectly via `Spawner:GoHome`.
  - `ms_register_pearl_entity` — at end of construction.