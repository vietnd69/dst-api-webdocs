---
id: mushtree_moonspore
title: Mushtree Moonspore
description: Manages the behavior, lifecycle, and combat mechanics of moon spores, including population density regulation, proximity-based explosion triggering, and area-of-effect damage upon popping.
tags: [environment, combat, entity]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 78238fb7
system_scope: environment
---

# Mushtree Moonspore

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mushtree_moonspore` prefab represents a dangerous environmental entity that floats near mushtrees and explodes upon player or enemy proximity or manual deconstruction. It integrates multiple components: `workable` (for player interaction), `perishable` (for natural decay), `burnable` (for fire damage), `propagator` (for heat propagation), `combat` (for area damage), and custom logic for density regulation and state-triggered events. It uses the `SGmoonspore` state graph for animation and behavioral state management.

## Usage example
```lua
local spore = SpawnPrefab("spore_moon")
if spore ~= nil then
    -- Position and configure
    spore.Transform:SetPosition(x, y, z)
    spore.persists = true
    spore.components.workable:SetWorkable(true)
end
```

## Dependencies & tags
**Components used:** `inspectable`, `workable`, `perishable`, `stackable`, `burnable`, `propagator`, `combat`, `hauntable` (via `MakeHauntablePerish`)
**Tags:** Adds `"spore"` initially; removes `"spore"` upon pop/depletion; `"NOCLICK"` is added when depleted.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `crowdingtask` | Task | `nil` | Periodic task tracking spore density; cancels when task runs or entity is destroyed. |
| `_prox_task` | Task | `nil` | Periodic proximity-check task active when entity is awake and not in a `busy` state. |
| `_alwaysinstantpops` | boolean | `nil` | If set, popping is instant; otherwise, emits `"preparedpop"` first. |

## Main functions
### `depleted(inst)`
*   **Description:** Handles cleanup and finalization when the spore has fully depleted or been destroyed. Removes from simulation, disables interaction, and schedules removal after offscreen delay.
*   **Parameters:** `inst` (Entity) — the spore entity instance.
*   **Returns:** Nothing.
*   **Error states:** Calls `inst:Remove()` after 3 seconds if offscreen; otherwise just invalidates interactability.

### `onworked(inst, worker)`
*   **Description:** Triggered when the spore is successfully worked on (e.g., netted). Triggers pop event and removes `"spore"` tag to disable crowding detection.
*   **Parameters:** 
    * `inst` (Entity) — the spore instance.
    * `worker` (Entity) — the entity performing the action (unused directly in function).
*   **Returns:** Nothing.

### `checkforcrowding(inst)`
*   **Description:** Enforces density limits for spores in a given area. If too many spores are within range, sets perish percent to 0 (instant decay). Otherwise schedules the next check.
*   **Parameters:** `inst` (Entity) — the spore instance.
*   **Returns:** Nothing.
*   **Error states:** Recursively schedules itself via `inst.crowdingtask` unless density is exceeded.

### `onpopped(inst)`
*   **Description:** Handles explosion logic: plays pop sound and triggers area attack against nearby valid targets.
*   **Parameters:** `inst` (Entity) — the spore instance.
*   **Returns:** Nothing.
*   **Error states:** Excludes entities with tags in `AREAATTACK_EXCLUDETAGS`; attacks in a circle of radius `TUNING.MOONSPORE_ATTACK_RANGE`.

### `do_proximity_test(inst)`
*   **Description:** Scans for nearby combat-capable entities. If a valid target is found within proximity and not in a `"busy"` state, triggers pop (instant or prepared).
*   **Parameters:** `inst` (Entity) — the spore instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early if current state graph has `"busy"` tag; only targets with `_combat` component and one of `{"player","monster","character"}` tags.

### `schedule_testing(inst)`
*   **Description:** Cancels existing proximity tasks and starts a periodic proximity check (`PROXIMITY_TEST_TIME` = 15 frames).
*   **Parameters:** `inst` (Entity) — the spore instance.
*   **Returns:** Nothing.

### `spore_entity_sleep(inst)`
*   **Description:** Called when the spore enters sleep mode (e.g., world chunk unloads). Stops all active tasks.
*   **Parameters:** `inst` (Entity) — the spore instance.
*   **Returns:** Nothing.

### `spore_entity_wake(inst)`
*   **Description:** Called when the spore wakes up (e.g., world chunk loads). Schedules proximity tests and runs an immediate check.
*   **Parameters:** `inst` (Entity) — the spore instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `"popped"` — fires `onpopped` to trigger explosion and area damage.
- **Pushes:** `"pop"` — fires when the spore detonates (e.g., on work completion or manual trigger); `"preparedpop"` — fires when proximity triggers, before explosion (if `_alwaysinstantpops` is falsy).