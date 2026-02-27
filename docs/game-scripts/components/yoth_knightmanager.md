---
id: yoth_knightmanager
title: Yoth Knightmanager
description: Manages the activation of Knight Shrines and the spawning of Yoth Knights (Horsemen of the Aporkalypse) for Princess-related gameplay in the Year of the Horse event.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f0f8cf95
---

# Yoth Knightmanager

## Overview
This component orchestrates the Knight Shrine–triggered event logic for the Year of the Horse (YOTH) update, specifically managing when and how Yoth Knights are summoned when a Princess wielder is near an active Knight Shrine and free of cooldowns. It operates exclusively on the master simulation and coordinates interactions between shrines, princesses (players holding the Knight Hat), and knight summoning logic.

## Dependencies & Tags
* **Component Requirements**: This component expects `inst` to be an entity with a valid `Transform` and `IsPointNearHole`/`FindWalkableOffset` support in the world context. It does *not* add any components to `inst`, but relies on external components such as:
  * `petleash` (on the hat object passed to `RegisterPrincess`)
  * `yoth_princesscooldown_buff` (on player entities)
* **Tags Used**:
  * `gilded_knight` (used via `TheSim:CountEntities` to check for existing knights)
* **World Event Listeners**: Listens for `ms_knightshrineactivated`, `ms_knightshrinedeactivated`, `ms_register_yoth_princess`, and `ms_unregister_yoth_princess`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shrines` | `table` | `{}` | Tracks active Knight Shrines (keys are shrine entities, values are `true`). |
| `princesses` | `table` | `{}` | Maps player entities to their equipped Knight Hat (from `RegisterPrincess`). |
| `hats` | `table` | `{}` | Inverted mapping of `princesses`: maps hats to their associated player. |
| `rescheduletasks` | `table` | `{}` | Stores pending `DoTaskInTime` task handles keyed by player entity, for rescheduling knight spawn checks. |

## Main Functions

### `OnKnightShrineActivated(shrine)`
* **Description:** Registers an active Knight Shrine in the `shrines` table.
* **Parameters:**
  * `shrine`: Entity — the shrine that became active.

### `OnKnightShrineDeactivated(shrine)`
* **Description:** Removes a Knight Shrine from the `shrines` table.
* **Parameters:**
  * `shrine`: Entity — the shrine that was deactivated.

### `IsKnightShrineActive()`
* **Description:** Returns `true` if any Knight Shrine is currently active *and* the YOTH event is running.
* **Parameters:** None.

### `GetActiveKnightShrines()`
* **Description:** Returns the `shrines` table (a set of active shrine entities).
* **Parameters:** None.

### `IsOnCooldown(owner)`
* **Description:** Determines whether the given `owner` (player or non-player entity) is currently on cooldown for summoning knights. For non-players (e.g., dropped hats), it checks the nearest players in range.
* **Parameters:**
  * `owner`: Entity — the player or entity associated with the princess/hat.

### `SpawnKnights(hat, pos)`
* **Description:** Spawns four Yoth Knights in sequence with slight delays and a warning sound. Uses the `petleash` component on the `hat` to spawn `knight_yoth` pets at computed offsets.
* **Parameters:**
  * `hat`: Entity — the Knight Hat item with `petleash` component.
  * `pos`: Vector3 — world position where the warning sound should play (knights spawn at offset locations).

### `RescheduleSpawnKnights(owner, timetocheck)`
* **Description:** Cancels any pending spawn check task for `owner` and schedules a new one (default: 5–6 seconds). Used to defer summoning attempts (e.g., after cooldown expiration).
* **Parameters:**
  * `owner`: Entity — the player entity.
  * `timetocheck`: number (optional) — delay in seconds before retrying.

### `TryToSpawnKnights(owner)`
* **Description:** Evaluates and executes the conditions required to spawn knights: checks princess registration, cooldown status, absence of existing knights, no platform, and valid spawn position. If conditions met, calls `SpawnKnights`.
* **Parameters:**
  * `owner`: Entity — the player associated with the princess.

### `RegisterPrincess(owner, hat)`
* **Description:** Registers a player-hat pair as a princess. If on cooldown initially, emits `yoth_oncooldown` event for feedback. Schedules a spawn check with a small delay (~0.5–0.75s).
* **Parameters:**
  * `owner`: Entity — the player wielding the hat.
  * `hat`: Entity — the Knight Hat item.

### `UnregisterPrincess(owner, hat)`
* **Description:** Unregisters a princess. Cancels pending tasks and emits `yoth_oncooldown_cancel` for UI updates.
* **Parameters:**
  * `owner`: Entity — the player.
  * `hat`: Entity — the Knight Hat item.

### `GetDebugString()`
* **Description:** Currently returns an empty string; reserved for future debugging output.
* **Parameters:** None.

## Events & Listeners
* Listens for:
  * `"ms_knightshrineactivated"` → calls `OnKnightShrineActivated_Bridge`
  * `"ms_knightshrinedeactivated"` → calls `OnKnightShrineDeactivated_Bridge`
  * `"ms_register_yoth_princess"` → calls `RegisterPrincess_Bridge`
  * `"ms_unregister_yoth_princess"` → calls `UnregisterPrincess_Bridge`
* Emits events (via `owner:PushEvent`):
  * `"yoth_oncooldown"` — when princess registration occurs while already on cooldown.
  * `"yoth_oncooldown_cancel"` — when unregistering a princess.