---
id: yoth_knightmanager
title: Yoth Knightmanager
description: Manages knight spawning logic for the Yoth event by tracking shrines, princesses, and cooldown states.
tags: [event, boss, combat, ai]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: f0f8cf95
system_scope: world
---

# Yoth Knightmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`yoth_knightmanager` is a world-scoped component responsible for orchestrating knight summoning during the Yoth event. It tracks active knight shrines, manages princess-to-player relationships, and determines when knights should be spawned based on cooldowns, spatial constraints, and shrine status. This component only exists on the master simulation and interfaces with the `petleash` component to spawn `knight_yoth` entities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("yoth_knightmanager")
-- The component automatically registers event listeners and begins tracking shrines/princesses.
-- Typical usage occurs internally; modders usually interact via events like `ms_register_yoth_princess`.
```

## Dependencies & tags
**Components used:** `petleash`
**Tags:** Adds `gilded_knight` (as a constraint tag, not added to owner entities); checks `yoth_princesscooldown_buff`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shrines` | table | `{}` | Tracks active knight shrines (`shrine` instance → `true` map). |
| `princesses` | table | `{}` | Maps `player` instance → `hat` (pet carrier) instance. |
| `hats` | table | `{}` | Inverted mapping of `princesses` (`hat` → `player`). |
| `rescheduletasks` | table | `{}` | Stores pending tasks used to reschedule knight spawn checks per owner. |

## Main functions
### `OnKnightShrineActivated(shrine)`
* **Description:** Registers a knight shrine as active.
* **Parameters:** `shrine` (entity instance) — the shrine entity being activated.
* **Returns:** Nothing.

### `OnKnightShrineDeactivated(shrine)`
* **Description:** Deregisters a knight shrine as inactive.
* **Parameters:** `shrine` (entity instance) — the shrine entity being deactivated.
* **Returns:** Nothing.

### `IsKnightShrineActive()`
* **Description:** Returns whether any knight shrine is active *and* the Yoth event is currently running.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if at least one shrine is active and `SPECIAL_EVENTS.YOTH` is active.

### `GetActiveKnightShrines()`
* **Description:** Returns the internal table tracking active shrines.
* **Parameters:** None.
* **Returns:** `table` — the `shrines` map.

### `IsOnCooldown(owner)`
* **Description:** Checks if the owner (player or object) is currently on princess-spawn cooldown.
* **Parameters:** `owner` (entity instance) — the entity whose cooldown state is checked.
* **Returns:** `boolean` — `true` if the `yoth_princesscooldown_buff` debuff is present.

### `SpawnKnights(hat, pos)`
* **Description:** Spawns a sequential wave of `knight_yoth` entities at a target position using the pet leash attached to `hat`. Applies warning sound, staggered delays, and reveal animations.
* **Parameters:** 
  * `hat` (entity instance) — must have a `petleash` component.
  * `pos` (vector3) — spawn position (x, y, z).
* **Returns:** Nothing.
* **Error states:** Early returns if `petleash` cannot spawn pets (e.g., full capacity or invalid positions). Knights are spawned one at a time with `0.75–1.25` second delays between them.

### `RescheduleSpawnKnights(owner, timetocheck)`
* **Description:** Cancels any pending spawn check for `owner` and schedules a new one. Default delay is `5 + random(0,1)` seconds.
* **Parameters:** 
  * `owner` (entity instance) — the player whose spawn task is rescheduled.
  * `timetocheck` (number, optional) — delay in seconds before rechecking.
* **Returns:** Nothing.

### `TryToSpawnKnights(owner)`
* **Description:** Evaluates conditions (cooldown, nearby knights, platform presence, pet count, valid spawn offset) and triggers `SpawnKnights` if all pass. Always reschedules a follow-up check afterward.
* **Parameters:** `owner` (entity instance) — the player attempting to summon knights.
* **Returns:** `boolean` — `true` if knights were successfully spawned, `false` otherwise.

### `RegisterPrincess(owner, hat)`
* **Description:** Registers a `hat` as the princess for `owner`. Triggers an immediate cooldown check and schedules a spawn attempt after a short delay.
* **Parameters:** 
  * `owner` (entity instance) — the player.
  * `hat` (entity instance) — the pet carrier (hat) item.
* **Returns:** Nothing.

### `UnregisterPrincess(owner, hat)`
* **Description:** Removes the princess registration for `owner`. Cancels pending spawn tasks and notifies listeners via event `yoth_oncooldown_cancel`.
* **Parameters:** 
  * `owner` (entity instance) — the player.
  * `hat` (entity instance) — the pet carrier (hat) item.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns an empty debug string; currently unused.
* **Parameters:** None.
* **Returns:** `string` — `""`.

## Events & listeners
- **Listens to:** 
  * `ms_knightshrineactivated` (on `TheWorld`) — triggers `OnKnightShrineActivated`.
  * `ms_knightshrinedeactivated` (on `TheWorld`) — triggers `OnKnightShrineDeactivated`.
  * `ms_register_yoth_princess` (on `TheWorld`) — triggers `RegisterPrincess`.
  * `ms_unregister_yoth_princess` (on `TheWorld`) — triggers `UnregisterPrincess`.
- **Pushes:** 
  * `yoth_oncooldown` — fired on an owner when registering with an active cooldown and no knights nearby.
  * `yoth_oncooldown_cancel` — fired on an owner when unregistering a princess.
