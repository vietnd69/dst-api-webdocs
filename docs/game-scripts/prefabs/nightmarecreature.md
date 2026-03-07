---
id: nightmarecreature
title: Nightmarecreature
description: Factory function for creating nightmare creature prefabs with dynamic behavior based on game world state, such as shadow rift presence and nightmare dawn.
tags: [combat, ai, boss, shadow, entity]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f6de29a8
system_scope: entity
---

# Nightmarecreature

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This script defines a reusable factory function `MakeShadowCreature` that generates prefabs for nightmare creature variants (`crawlingnightmare`, `nightmarebeak`, and `ruinsnightmare`). It configures core combat, movement, and sanity mechanics, and applies contextual logic—such as planar transformation when shadow rifts are active for `ruinsnightmare`. The factory handles initialization of components (`health`, `combat`, `locomotor`, `sanityaura`, `lootdropper`, `shadowsubmissive`, `knownlocations`, `planardamage`, `planarentity`) and registers event listeners for attacks, death, and world state changes (e.g., `isnightmaredawn`, `ms_riftaddedtopool`).

## Usage example
```lua
-- Typical usage is internal to DST; prefabs are returned and registered via the Prefab system.
-- Example external instantiation (for modding reference):
local prefabs = require("prefabs/nightmarecreature")
local creature = prefabs[1]() -- Creates a crawlingnightmare instance
```

## Dependencies & tags
**Components used:** `locomotor`, `health`, `combat`, `sanityaura`, `lootdropper`, `shadowsubmissive`, `knownlocations`, `planardamage`, `planarentity`.
**Tags added:** `nightmarecreature`, `gestaltnoloot`, `monster`, `hostile`, `shadow`, `notraptrigger`, `shadow_aligned`, `shadowsubmissive`.
**Tags checked:** `playerghost`, `crazy`, `shadowdominance`, `inherentshadowdominance`.

## Properties
No public properties. Configuration is performed via the `data` table passed to `MakeShadowCreature`, and all internal state is managed via components.

## Main functions
### `MakeShadowCreature(data)`
*   **Description:** Creates and returns a prefab definition for a nightmare creature variant. It sets up all required components, event listeners, sound settings, animations, and tags.
*   **Parameters:** `data` (table) - a table containing keys: `name` (string), `build` (string), `bank` (string), `num` (number), `speed` (number), `health` (number), `damage` (number), `attackperiod` (number), optionally `physics_rad` (number), `stategraph` (string), `master_postinit` (function), and `prefabs` (table of strings).
*   **Returns:** A prefab object (result of `Prefab(...)`).
*   **Error states:** None documented; assumes valid `data` keys and tunings.

### `retargetfn(inst)`
*   **Description:** Custom retarget function used by the `combat` component to select the best target among players, prioritizing those with shadow dominance within a reduced range.
*   **Parameters:** `inst` (Entity) - the nightmare creature instance.
*   **Returns:** `target` (Entity or `nil`) — the selected target, or `nil` if no valid targets; additionally returns a boolean indicating if the target should be forced when the current target lacks dominance.
*   **Error states:** Returns `nil` if no valid players are within range or none are valid targets per `combat:CanTarget`.

### `OnAttacked(inst, data)`
*   **Description:** Event handler that sets the attacker as the creature’s target and attempts to recruit one nearby `nightmarecreature` to assist.
*   **Parameters:** `inst` (Entity), `data` (table with `attacker` field).
*   **Returns:** Nothing.

### `OnDeath(inst, data)`
*   **Description:** If killed by a "crazy" afflicter (e.g., NPC with `crazy` tag) and no loot table is set, grants one `nightmarefuel` as loot.
*   **Parameters:** `inst` (Entity), `data` (table with optional `afflicter` field).
*   **Returns:** Nothing.

### `ScheduleCleanup(inst)`
*   **Description:** Schedules a delayed task to clear loot, reset loot table, and kill the creature—used to handle cleanup on nightmare dawn.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnNightmareDawn(inst, dawn)`
*   **Description:** Listener for `isnightmaredawn` world state; triggers `ScheduleCleanup` if `dawn` is `true`.
*   **Parameters:** `inst` (Entity), `dawn` (boolean).
*   **Returns:** Nothing.

### `RuinsNightmare_OnNewState(inst, data)`
*   **Description:** Manages movement sound playback for `ruinsnightmare` depending on state (e.g., `moving` state tag).
*   **Parameters:** `inst` (Entity), `data` (table with `statename` field, optional).
*   **Returns:** Nothing.

### `RuinsNightmare_CheckRift(inst)`
*   **Description:** For `ruinsnightmare`, dynamically adds/removes planar entity and damage components based on whether a shadow rift is active in the world.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `attacked` — triggers `OnAttacked` to re-target and share aggro.
  - `death` — triggers `OnDeath` to adjust loot if killed by a crazy entity.
  - `newstate` — triggers `RuinsNightmare_OnNewState` for `ruinsnightmare` to manage movement sounds.
  - `ms_riftaddedtopool`, `ms_riftremovedfrompool` — triggers `RuinsNightmare_CheckRift` to toggle planar state.
- **Pushes:** None.
- **World state watched:** `isnightmaredawn` — triggers `OnNightmareDawn` on dawn transition.