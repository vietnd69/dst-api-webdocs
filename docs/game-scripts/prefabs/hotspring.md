---
id: hotspring
title: Hotspring
description: Represents a dynamic thermal pool entity that provides health and sanity restoration to occupants, can be transformed into a calcified glass state via bath bombs or full moon cycles, and yields loot when mined after calcification.
tags: [environment, entity, water, loot, restoration]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7355d0c8
system_scope: environment
---

# Hotspring

> Based on game build **7140014** | Last updated: 2026-03-05

## Overview
The `hotspring` prefab defines a recurring environmental structure found in DST worlds. It functions as both a bathable pool and a dynamic resource node. Occupants within its radius gain periodic health regeneration and context-sensitive sanity modification (including lunacy area reversal). The pool supports three states: pristine (active), bath-bombed (glowing/hot), and glassed (calcified/mined). It integrates with multiple systems including `watersource`, `heater`, `bathingpool`, `workable`, and `lootdropper`. State transitions (e.g., full moon → glassification, bath bomb application → activation) are handled via world-state listeners and component callbacks.

## Usage example
```lua
-- Example of spawning and configuring a hotspring instance
local inst = SpawnPrefab("hotspring")
inst.Transform:SetPosition(x, y, z)

-- Trigger bath bomb effect (if not full moon)
local bathbomb = SpawnPrefab("bathbomb")
if bathbomb then
    bathbomb.components.bathbomb:UseOn(inst)
end

-- Later, mine the calcified spring after full moon
inst.components.workable:SetWorkable(true) -- enabled via OnFullMoonChanged callback
```

## Dependencies & tags
**Components used:** `bathbombable`, `bathingpool`, `heater`, `inspectable`, `lootdropper`, `watersource`, `workable`  
**Tags added:** `watersource`, `antlion_sinkhole_blocker`, `birdblocker`, `HASHEATER` (in pristine state only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._glassed` | boolean | `false` | True if the spring is in calcified glass state. |
| `inst._bathbombed` | boolean | `false` | True if the spring is bath-bombed (not stored in state; derived from `bathbombable` component). |
| `inst._fx_task` | Task | `nil` | Periodic task for steam FX generation. |
| `inst._glass_sparkle_tick` | number | `nil` | Frame counter for glass-phase sparkle animations. |
| `inst.bathingpoolents` | table | `nil` | Table of entities currently occupying the spring. |
| `inst.bathingpooltask` | Task | `nil` | Task for periodic spring occupancy tick. |
| `inst.delay_refill_task` | Task | `nil` | Task for post-refill delay (triggered by moon phase change). |

## Main functions
### `EnableBathingPool(inst, enable)`
*   **Description:** Adds or removes the `bathingpool` component from the hotspring. Called during activation/deactivation (e.g., glassification, bath bomb application).
*   **Parameters:** `enable` (boolean) - if `true`, adds the `bathingpool` component and configures radius/occupant callbacks.
*   **Returns:** Nothing.

### `Refill(inst, snap)`
*   **Description:** Resets the spring to its pristine state. Cancels glass state, enables water source availability, resets bath bomb flags, disables heating, and re-enables animations/sound.
*   **Parameters:** `inst` (Entity) - the hotspring entity; `snap` (boolean) - if `true`, skips refill animation andFX delays.
*   **Returns:** Nothing.

### `TurnToGlassed(inst, is_loading)`
*   **Description:** Transitions the spring to a calcified glass state: ejects occupants, disables water and bath-bomb capabilities, disables lighting, updates layering for rendering, and initializes work state for mining.
*   **Parameters:** `inst` (Entity); `is_loading` (boolean) - if `true`, skips animation and sets idle directly (used during world load).
*   **Returns:** Nothing.

### `OnGlassedSpringMineFinished(inst, miner)`
*   **Description:** Called when the glassed hotspring is fully mined. Drops glass loot, conditionally drops a gem (blue or red) based on luck roll, then calls `RemoveGlass` to reset the spring.
*   **Parameters:** `inst` (Entity); `miner` (Entity) - the entity performing the mine action.
*   **Returns:** Nothing.

### `GetHeat(inst)`
*   **Description:** Computes and configures heating behavior for the `heater` component. Returns a heat magnitude based on bath bomb state and spring availability.
*   **Parameters:** `inst` (Entity).
*   **Returns:** number - `0` (inactive), `TUNING.HOTSPRING_HEAT.PASSIVE`, or `TUNING.HOTSPRING_HEAT.ACTIVE`.
*   **Error states:** Always sets thermics on the heater component; returns `0` only in depleted state.

### `OnStartBeingOccupiedBy(inst, ent)`
*   **Description:** Registers an entity as an occupant and starts the occupancy tick task (if first occupant). Sets up sanity modifier for the occupant.
*   **Parameters:** `inst` (Entity); `ent` (Entity) - the occupant.
*   **Returns:** Nothing.

### `OnStopBeingOccupiedBy(inst, ent)`
*   **Description:** Removes occupant and cancels the occupancy task if no occupants remain. Removes the sanity modifier for the departing entity.
*   **Parameters:** `inst` (Entity); `ent` (Entity).
*   **Returns:** Nothing.

### `OnBathBombed(inst)`
*   **Description:** Callback invoked when a bath bomb is used on the spring. If full moon, triggers glassification; otherwise activates glowing, hot state with animations and lighting.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Provides human-readable status string used by `inspectable`. Returns `"GLASS"`, `"BOMBED"`, `"EMPTY"`, or `nil`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** string? - status identifier.

## Events & listeners
- **Listens to:**  
  - `isfullmoon` world state (`OnFullMoonChanged`) - triggers glassification if bath-bombed.  
  - `moonphase` world state (`delay_refill`) - schedules refill after glass removal.  
  - `EntityOnSave`, `OnSave` (`OnSave`) - serializes state.  
  - `OnEntitySleep`, `OnEntityWake` (`OnSleep`, `OnWake`) - pauses/resumes FX based on entity visibility.

- **Pushes:**  
  - `healthdelta` (via `health:DoDelta`) for occupants.  
  - `knockback` (via `ent:PushEventImmediate`) when occupants are ejected.  
  - `loot_prefab_spawned`, `entity_droploot` (via `lootdropper`).  
  - `on_loot_dropped` on spawned loot entities.

- **Uses component events:**  
  - `workable` callbacks: `SetOnWorkCallback` → `OnGlassSpringMined`; `SetOnFinishCallback` → `OnGlassedSpringMineFinished`.  
  - `bathbombable` callback: `SetOnBathBombedFn` → `OnBathBombed`.  
  - `bathingpool` callbacks: `SetOnStartBeingOccupiedBy` → `OnStartBeingOccupiedBy`; `SetOnStopBeingOccupiedBy` → `OnStopBeingOccupiedBy`.