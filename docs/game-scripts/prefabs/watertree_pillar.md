---
id: watertree_pillar
title: Watertree Pillar
description: Acts as a large ocean-dwelling structure that periodically spawns grassgators, drops items when rammed by boats, blocks lightning, and manages canopy effects for nearby players.
tags: [environment, boss, structure, physics]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b58d089f
system_scope: environment
---

# Watertree Pillar

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `watertree_pillar` is a static environmental structure that functions as a dynamic boss-like entity in DST. It serves as a habitat for `grassgator` spawns, interacts with player proximity to adjust canopy awareness, regenerates or drops items (`oceantreenut`, `twigs`, `cutgrass`, etc.) upon boat collisions, blocks lightning strikes, and manages nearby `oceanvine_cocoon` behavior. It integrates closely with multiple components to handle physics (collision, falling), lighting (canopy shadows/rays), proximity detection, child spawning, timers, and networked save/load operations.

## Usage example
```lua
local watertree = SpawnPrefab("watertree_pillar")
-- The prefab is self-contained; once spawned, it manages its own behavior.
-- Example manual interventions (rarely needed):
-- watertree.components.childspawner:SetMaxChildren(12)
-- watertree.components.timer:StartTimer("custom", 30)
```

## Dependencies & tags
**Components used:** `boatphysics` (via collision listener), `canopylightrays`, `canopyshadows`, `childspawner`, `distancefade`, `heavyobstaclephysics`, `inspectable`, `knownlocations`, `lightningblocker`, `playerprox`, `timer`.  
**Tags added:** `cocoon_home`, `shadecanopy`, `ignorewalkableplatforms`.  
**Tags used in FindEntities:** `tree` (for blockers), `webbed` (cocoons), `oceanvine` (vines), `firefly`/`FX`, `NOBLOCK`, `NOCLICK`, `DECOR`, `flying`, `boat`, `walkingplank`, `_inventoryitem`, `structure`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `num_oceantreenuts` | number | `START_NUM_OCEANTREENUTS` (1) | Current count of available `oceantreenut` items. |
| `_cocoons_to_regrow` | number | `0` | Number of `oceanvine_cocoon` instances to regrow after destruction. |
| `last_ram_time` | number | `nil` | Game time (cycles + time) of the last boat ram event. |
| `items_to_drop` | table | `nil` | List of prefabs to drop sequentially. |
| `drop_items_task` | task | `nil` | Reference to the current item drop task. |
| `_lightning_drop_task` | task | `nil` | Reference to the current post-lightning drop task. |
| `players` | table | `{}` | Map of nearby players; used for canopy zone tracking. |
| `roots`, `_ripples` | entity | created on spawn | Child entities for visual roots and water ripples. |

## Main functions
### `DropItems(inst)`
*   **Description:** Initiates sequential dropping of items (e.g., `oceantreenut`, `twigs`, `cutgrass`) at randomized radial positions around the pillar. Handles falling physics for heavy items like `oceantreenut`.
*   **Parameters:** `inst` (entity) — the watertree pillar instance.
*   **Returns:** Nothing.
*   **Error states:** Removes `inst.items_to_drop` after last item; cancels `inst.drop_items_task`.

### `generate_items_to_drop(inst)`
*   **Description:** Populates `inst.items_to_drop` with a random number of small items and optionally one `oceantreenut` if `num_oceantreenuts > 0`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `alert_nearby_cocoons(inst, picker, loot)`
*   **Description:** Triggers the `"activated"` event on all `oceanvine_cocoon` entities within `RAM_ALERT_COCOONS_RADIUS` (25), notifying them of a player picking items.
*   **Parameters:** `inst` (entity), `picker` (player), `loot` (unused).
*   **Returns:** Nothing.

### `cocoon_regrow_check(inst)`
*   **Description:** Spawns a new `oceanvine_cocoon` at a randomized location around the pillar, within an annular region. Decrements `_cocoons_to_regrow` and reschedules itself if needed.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnCollide(inst, data)`
*   **Description:** Callback triggered on collision. If a boat hits the pillar with high velocity (> 0.8), it triggers camera shake, alerts cocoons, and starts item drops after a recharge period (`TUNING.WATERTREE_PILLAR_RAM_RECHARGE_TIME`). Also resizes missing vines.
*   **Parameters:** `inst` (entity), `data` (collision data) — includes `other` (boat) and `hit_dot_velocity`.
*   **Returns:** Nothing.

### `OnLightningStrike(inst)`
*   **Description:** Initiates a delayed drop of random small items (`twigs`, `cutgrass`, etc.) after a lightning strike, avoiding overlap if a drop is already scheduled.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnTimerDone(inst, data)`
*   **Description:** Handles timed events: regrows `oceantreenut` after `OCEANTREENUT_REGENERATE_TIME`, and regrows `oceanvine_cocoon` after `OCEANVINE_COCOON_REGEN_BASE`.
*   **Parameters:** `inst` (entity), `data` (table with `name` field: `"regrow_oceantreenut"` or `"cocoon_regrow_check"`).
*   **Returns:** Nothing.

### `SpawnMissingVines(inst)`
*   **Description:** Checks for existing `oceanvine` entities within range and spawns 1–2 new vines if below target count (`TUNING.OCEANTREE_VINE_DROP_MAX + random offset`).
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnNear(inst, player)` / `OnFar(inst, player)`
*   **Description:** Adjusts `player.canopytrees` count and fires `"onchangecanopyzone"` event when players enter or exit the canopy radius (`MIN` to `MAX`).
*   **Parameters:** `inst` (entity), `player` (entity).
*   **Returns:** Nothing.

### `OnSave(inst, data)` / `OnLoad(inst, data)` / `OnPreLoad(inst, data)`
*   **Description:** Save/load helpers. Stores `num_oceantreenuts`, `last_ram_time`, and `_cocoons_to_regrow`. `OnPreLoad` initializes child spawner with world settings.
*   **Parameters:** `inst` (entity), `data` (table to populate/read).
*   **Returns:** Nothing.

### `OnRemoveEntity(inst)`
*   **Description:** Cleanup on removal: destroys `roots` and `_ripples`, decrements `canopytrees` for all known players, and fires `"onchangecanopyzone"`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `on_collide` — triggers `OnCollide` for boat impact detection.
- **Listens to:** `timerdone` — triggers `OnTimerDone` for regrowth timing.
- **Listens to:** `cocoon_destroyed` — triggers `OnNearbyCocoonDestroyed` to schedule cocoon regrowth.
- **Listens to:** `phasechanged` (on `TheWorld`) — triggers `OnPhaseChanged` to spawn fireflies during day.
- **Pushes:** `onchangecanopyzone` — fired on player entry/exit of canopy zone.
- **Pushes:** `startfalling`, `stopfalling` — via `heavyobstaclephysics` for dropped items.
- **Pushes:** `activated` — on nearby cocoons during ramming.