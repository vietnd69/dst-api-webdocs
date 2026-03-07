---
id: moonstorm_static
title: Moonstorm Static
description: Provides the core prefabs and logic for Moonstorm-related static electricity entities including stationary containers, roaming sparks, catchers, and upgrade components.
tags: [combat, environment, moonstorm, loot, inventory]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8a2d7a4e
system_scope: environment
---

# Moonstorm Static

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moonstorm_static.lua` defines five key prefabs for the Moonstorm event in DST: `moonstorm_static`, `moonstorm_static_nowag`, `moonstorm_static_item`, `moonstorm_static_catcher`, and `moonstorm_static_roamer`. These prefabs implement both stationary static containers (which explode or complete an experiment) and mobile, catchable lightning sparks that roam during Moonstorms. The prefabs integrate with components for health, combat, locomotion, trading, and custom Moonstorm-specific systems like `moonstormstaticcapturable` and `moonstormstaticcatcher`.

## Usage example
```lua
-- Spawn a stationary static container
local static = SpawnPrefab("moonstorm_static")
static.Transform:SetPosition(x, y, z)

-- Spawn a roaming Moonstorm spark
local roamer = SpawnPrefab("moonstorm_static_roamer")
roamer.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `health`, `combat`, `inspectable`, `inventoryitem`, `upgrader`, `tradable`, `stackable`, `locomotor`, `equippable`, `moonstormstaticcatcher`, `moonstormstaticcapturable`, `hudindicatable`, `trader`, `locomotor`

**Tags:** `moonstorm_static`, `soulless`, `moonstormstatic_catcher`, `moonstormstaticcapturable`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `experimentcomplete` | boolean | `nil` | Set when `moonstorm_static` completes its animation sequence. Controls whether explosion occurs on death. |
| `playermade` | boolean | `nil` | Set when `moonstorm_static_item` is crafted by a player, altering visual appearance. |
| `_needs_tool` | boolean | `nil` | Used by `moonstorm_static_nowag` to indicate it's waiting for a WAG tool. |
| `zigzagtask` | Task | `nil` | Reference to the recurring zigzag movement task for roamer entities. |
| `roamerdecaytask` | Task | `nil` | Reference to the decay timer for roamer entities. |

## Main functions
### `finished(inst)`
*   **Description:** Initiates the completion animation for `moonstorm_static`. When the animation finishes, the prefab is replaced with `moonstorm_static_item`.
*   **Parameters:** `inst` (entity instance) — the static container instance.
*   **Returns:** Nothing.
*   **Error states:** Sets `inst.experimentcomplete = true` to prevent explosion on subsequent death.

### `stormstopped(inst)`
*   **Description:** Schedules a delayed health kill for the static entity if it is no longer inside a Moonstorm.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `MakePlayerMade(inst)`
*   **Description:** Applies player-crafted visual overrides to `moonstorm_static_item` (replaces empty symbols and changes inventory image).
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `PlayInitAnimation(inst)`
*   **Description:** Plays the `pre_newgame` animation on `moonstorm_static_nowag` upon capture; sets 4-faced orientation and triggers a follow-up animation.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `OnZigZagUpdate(inst)`
*   **Description:** Controls the erratic, zigzag movement of `moonstorm_static_roamer`. Adjusts speed multiplier and position randomly, and evaluates whether to start/stop decay based on Moonstorm zone membership.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** Nothing.

### `OnCaught_roamer(inst, obj, doer)`
*   **Description:** Converts a captured `moonstorm_static_roamer` into `moonstorm_static_nowag`, preserves the catcher's rotation, and plays the init animation. Fires a world event upon capture.
*   **Parameters:** `inst` (roamer), `obj` (unused), `doer` (entity doing the capturing).
*   **Returns:** Nothing.

### `ShouldTrackfn_roamer(inst, viewer)`
*   **Description:** Determines if a `moonstorm_static_roamer` should be tracked for HUD indicators by a given viewer.
*   **Parameters:**  
  - `inst` (roamer entity)  
  - `viewer` (potential tracker entity)  
*   **Returns:** `true` if viewer has `moonstormevent_detector`, is within range (`1.5x` max indicator range), not in frustum, and can line-of-sight see the roamer.
*   **Error states:** Returns `false` if viewer is invalid or outside valid tracking conditions.

## Events & listeners
- **Listens to:**  
  - `attacked` — triggers `onattackedfn` (plays hit animation and sound for static containers).  
  - `death` — triggers `ondeath` (explosive or silent removal based on `experimentcomplete`).  
  - `ms_stormchanged` — on Moonstorm events, schedules `stormstopped` to kill if out of storm.  
  - `animover` — delegates to cleanup callbacks like `finished_callback`, `inst.Remove`, or `PlayInitAnimation_pst`.  
  - `exitlimbo` / `enterlimbo` — manages idle sound loops for `moonstorm_static_item`.  
  - `need_tool` / `need_tool_over` — toggles idle animation and state for `moonstorm_static_nowag`.  
- **Pushes:**  
  - `ms_moonstormstatic_roamer_spawned` — fired when a roamer is created.  
  - `ms_moonstormstatic_roamer_captured` — fired when a roamer is captured.  
  - `imagechange` — fired via `inventoryitem:ChangeImageName` during player-craft handling.

