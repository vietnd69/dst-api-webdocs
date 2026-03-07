---
id: dustmoth
title: Dustmoth
description: Manages the behavior, combat stats, trading interactions, and inventory logic for the Dustmoth creature entity in DST.
tags: [combat, trader, inventory, ai]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e80e43e1
system_scope: entity
---

# Dustmoth

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The Dustmoth prefab defines the behavior and properties of the Dustmoth NPC. It aggregates multiple components—including `combat`, `health`, `locomotor`, `trader`, `eater`, `inventory`, `lootdropper`, `sleeper`, and others—to implement the creature's gameplay mechanics: patrolling caves, accepting certain food items, trading them for charged status, dropping blueprints upon request, and handling stuck detection via periodic position tracking. It uses a custom state graph (`SGdustmoth`) and brain (`dustmothbrain`) for its AI.

## Usage example
```lua
-- Typical usage occurs internally when the game spawns a Dustmoth via SpawnPrefab("dustmoth").
-- No manual instantiation is expected for modders.
-- Key extension points include:
-- - Modifying Tuning values (e.g., TUNING.DUSTMOTH.WALK_SPEED)
-- - Overriding loot tables via SetSharedLootTable('dustmoth', ...)
-- - Using inst:ListenForEvent("dustmothden_repaired", fn) in mod code to detect recovery
```

## Dependencies & tags
**Components used:** `locomotor`, `combat`, `health`, `trader`, `eater`, `sleeper`, `lootdropper`, `inventory`, `inspectable`, `knownlocations`, `homeseeker`, `timer`  
**Tags added:** `cavedweller`, `animal`  
**Tags checked:** `dustmothfood` (via `trader`'s accept test)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_charged` | boolean | `false` | Indicates whether the Dustmoth has consumed a charged item (`dustmeringue`) and is eligible to drop a blueprint. |
| `_time_spent_stuck` | number | `0` | Accumulates time in seconds the Dustmoth has remained immobile (used for AI stuck detection). |
| `_find_dustables` | boolean | `true` | Controls whether the Dustmoth attempts to locate and interact with dustables (e.g., dirt mounds). Reset during `dustoff` cooldown. |
| `_dustoff_cooldown_task` | task | `nil` | Task handle for the cooldown period after `dustoff` animation; sets `_find_dustables` back to `true` on completion. |
| `_previous_position` | Vector3 | `(0,0,0)` | Stores the last position for stuck detection comparison. |
| `_check_stuck_task` | periodic task | `nil` | Periodic task (`CHECK_STUCK_FREQUENCY`) that runs `CheckIsStuck` to detect if the Dustmoth is stuck. |
| `_last_played_search_anim_time` | number | `-COOLDOWN * random()` | Tracks time since last search animation to enforce cooldown. |

## Main functions
### `StartDustoffCooldown(inst)`
*   **Description:** Initiates a cooldown after the Dustmoth performs the `dustoff` animation. During this time, `_find_dustables` is `false`, preventing interactions with dustables. Restores `_find_dustables` to `true` after the cooldown ends.
*   **Parameters:** `inst` (entity) — the Dustmoth instance.
*   **Returns:** Nothing.
*   **Error states:** Cancels any existing cooldown task to avoid overlaps.

### `CheckIsStuck(inst)`
*   **Description:** Checks whether the Dustmoth has remained stationary for too long (stuck), accumulating `_time_spent_stuck`. Only runs if the stategraph does not have the `"busy"` tag (e.g., during idle/wandering states).
*   **Parameters:** `inst` (entity) — the Dustmoth instance.
*   **Returns:** Nothing (modifies `_time_spent_stuck` internally).
*   **Error states:** Skips check if `"busy"` state tag is active (e.g., during animations or combat).

### `FindBlueprintLootsIndex(x, y, z)`
*   **Description:** Locates the highest index among valid blueprints (from `BLUEPRINT_LOOTS`) within a 16-unit radius of the specified position. Used to determine which recipes are *already known* by nearby players to avoid redundancy.
*   **Parameters:** `x`, `y`, `z` (numbers) — world coordinates for search.
*   **Returns:** `number?` — highest index in `BLUEPRINT_LOOTS` for known blueprints, or `nil` if none are found.
*   **Error states:** Returns `nil` if no matching blueprints exist.

### `TryToDropBlueprint(inst)`
*   **Description:** Attempts to drop a blueprint for a recipe not yet known by the nearest player. If all blueprints are known, falls back to a random recipe with `TUNING.DUSTMOTH.BLUEPRINT_DROP_CHANCE_REPEAT` probability.
*   **Parameters:** `inst` (entity) — the Dustmoth instance.
*   **Returns:** `boolean` — `true` if a blueprint was successfully spawned and flung, `false` otherwise.
*   **Error states:** Returns `false` if no valid player is nearby or the player lacks a `builder` component.

### `OnEntitySleep(inst)` / `OnEntityWake(inst)`
*   **Description:** Handles cleanup and initialization of the stuck-detection periodic task when the entity enters or leaves sleep state. `OnEntitySleep` cancels `_check_stuck_task`; `OnEntityWake` restarts it.
*   **Parameters:** `inst` (entity) — the Dustmoth instance.
*   **Returns:** Nothing.
*   **Error states:** `OnEntitySleep` safely cancels only if the task exists.

### `OnSave(inst, data)` / `OnLoad(inst, data)`
*   **Description:** Saves and restores the `_charged` state across sessions. Used to persist blueprint-readiness across server restarts.
*   **Parameters:** `inst` (entity), `data` (table) — persistence data table.
*   **Returns:** Nothing.
*   **Error states:** `OnLoad` silently ignores `nil` or missing `data.charged`.

### `StartCheckStuckTask(inst)`
*   **Description:** Starts or reuses the periodic stuck-check task (`_check_stuck_task`) at `CHECK_STUCK_FREQUENCY` (0.5s), with an initial delay of 0.25s.
*   **Parameters:** `inst` (entity) — the Dustmoth instance.
*   **Returns:** Nothing.
*   **Error states:** Ensures only one task exists at a time.

## Events & listeners
- **Listens to:** `attacked` — triggers `OnAttacked` to drop all inventory items upon taking damage.
- **Listens to:** `oneat` — triggers `OnEat` to mark the Dustmoth as `_charged` and eligible for blueprint drops after eating `dustmeringue`.
- **Listens to:** `dustmothden_repaired` — triggers `OnFinishRepairingDen` to reset `_charged` state, resetting the blueprint trade cycle.
- **Pushes:** `onrefuseitem` — fired via `OnRefuseItem` when an invalid item is offered for trade and the giver is valid.

