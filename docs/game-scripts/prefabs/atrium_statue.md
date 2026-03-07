---
id: atrium_statue
title: Atrium Statue
description: A boss-related interactive statue that dynamically changes appearance based on nightmare phase and drops Thulecite materials when destroyed.
tags: [boss, world, environment, loot, transformation]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f66d9c7b
system_scope: world
---

# Atrium Statue

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `atrium_statue` is a static environmental prefab used in the Nightmare phase of the game. It serves as an interactive object that visually transforms between "day" and "night" phases based on the current nightmare state, and responds to mining interactions via the `workable` and `lootdropper` components (commented out in the constructor but enabled at runtime via prefabs/overrides). Its core responsibilities are phase-aware animation state management and loot generation upon destruction.

## Usage example
The `atrium_statue` prefab is instantiated via `MakeStatue` and returned as one or two prefabs (`atrium_statue` and `atrium_statue_facing`). As a prefabricated entity, it is typically spawned in map generation, not manually constructed by mods. A modder may reference its loot table or phase behavior in custom content:

```lua
-- Example: Use its loot table in a custom dropper
inst:AddComponent("lootdropper")
inst.components.lootdropper:SetChanceLootTable("atrium_statue_loot")

-- Example: Listen for nightmare phase changes to adapt behavior
inst:WatchWorldState("nightmarephase", function(inst, phase)
    -- Custom phase response logic
end)
```

## Dependencies & tags
**Components used:** `inspectable`, `savedrotation` (conditional), `lootdropper` (via prefabs/overrides), `workable` (via prefabs/overrides).  
**Tags:** `structure`, `minable`.  
**Tags added by prefabs:** None directly; tags are managed at prefab level.

## Properties
No public properties are initialized directly in this file. Runtime properties such as `workleft`, `_suffix`, and `_phasetask` are managed internally via component state and `inst` fields.

## Main functions
This file defines several local functions used internally by the prefab's lifecycle. These are not exposed as component methods but are critical for behavior.

### `OnWorked(inst, worker, workleft)`
* **Description:** Updates the statue's animation based on remaining mining progress. Displays progressive idle animations (`idle_low`, `idle_med`, `idle_full`) depending on how much work remains.
* **Parameters:**  
  - `inst` (Entity) - The statue entity.  
  - `worker` (Entity or nil) - The entity performing work (unused here).  
  - `workleft` (number) - Remaining work units; compared against `TUNING.MARBLEPILLAR_MINE`.
* **Returns:** Nothing.
* **Error states:** None identified; relies on `TUNING.MARBLEPILLAR_MINE`.

### `OnWorkFinished(inst)`
* **Description:** Triggered when mining completes. Drops loot via `lootdropper`, spawns a small collapse FX prefab, spawns a random nightmare mob (`nightmarebeak` or `crawlingnightmare`), and removes the statue entity.
* **Parameters:**  
  - `inst` (Entity) - The statue entity.
* **Returns:** Nothing.

### `DoFx(inst)`
* **Description:** Plays sound and spawns transition FX (`statue_transition`, `statue_transition_2`) when phase changes visually.
* **Parameters:**  
  - `inst` (Entity) - The statue entity.
* **Returns:** Nothing.

### `ShowPhaseState(inst, phase, instant)`
* **Description:** Updates the statue’s suffix (`"_night"` or `""`) and animation to match the given `nightmarephase`. Plays transition FX unless `instant` is true. Calls `OnWorked` to refresh animation.
* **Parameters:**  
  - `inst` (Entity) - The statue entity.  
  - `phase` (string) - Current nightmare phase (e.g., `"wild"`).  
  - `instant` (boolean) - If true, change state immediately without FX.
* **Returns:** Nothing.

### `OnNightmarePhaseChanged(inst, phase, instant)`
* **Description:** Handles world-phase change events by scheduling or immediately invoking `ShowPhaseState`. Cancels any pending phase task if needed.
* **Parameters:**  
  - `inst` (Entity) - The statue entity.  
  - `phase` (string) - New nightmare phase.  
  - `instant` (boolean) - Whether to apply change immediately (e.g., if statue is asleep).
* **Returns:** Nothing.

### `OnEntitySleep(inst)`
* **Description:** Called when the entity (e.g., player) goes to sleep. Immediately synchronizes phase state to current `nightmarephase` without delay.
* **Parameters:**  
  - `inst` (Entity) - The statue entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"nightmarephase"` (via `inst:WatchWorldState`) - Triggers `OnNightmarePhaseChanged` when world nightmare phase changes.  
  - `entity sleep` state changes (via `inst.OnEntitySleep`) - Triggers immediate phase update.  
- **Pushes:**  
  - No direct events; relies on core engine events for phase updates and entity removal.

## Loot table
The `atrium_statue_loot` table is defined at the top of the file and referenced by `lootdropper` (when active). It provides weighted drops:  
- `"thulecite"` (1.0 weight),  
- `"thulecite"` (0.25 weight),  
- `"thulecite_pieces"` (1.0, 1.0, 0.5, 0.5 weights).  

Loot behavior adheres to DST’s `LootDropper` logic (e.g., ash conversion when burnt).