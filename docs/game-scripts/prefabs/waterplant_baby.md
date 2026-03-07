---
id: waterplant_baby
title: Waterplant Baby
description: A juvenile waterplant entity that grows barnacles over time and transforms into a fully grown waterplant under specific conditions.
tags: [growth, environment, harvest, lunar]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 09e86f22
system_scope: environment
---

# Waterplant Baby

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`waterplant_baby` is a prefab representing the initial stage of a waterplant entity. It grows barnacles incrementally and reacts to environmental and seasonal conditions (notably the full moon) to mature into a `waterplant` prefab. The entity behaves as a water obstacle and floater, and interacts with multiple components including `harvestable`, `shaveable`, `lootdropper`, `burnable`, and `floater`. It supports save/load persistence and rebirth logic after being destroyed (e.g., burnt).

## Usage example
```lua
local plant = SpawnPrefab("waterplant_baby")
plant.Transform:SetPosition(somewhere)
plant.WaitForRebirth(10) -- rebirth after 10 seconds (if burnt)
```

## Dependencies & tags
**Components used:** `floater`, `harvestable`, `shaveable`, `lootdropper`, `inspectable`, `burnable`, `propagator`, `inventoryitem`, `heavyobstaclephysics`, `soundEmitter`, `miniMapEntity`, `transform`, `animstate`, `network`

**Tags:** `ignorewalkableplatforms`, `seastack`, `waterplant`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_grow_task` | task or `nil` | `nil` | Task handle for triggering full moon–induced maturation. |
| `_rebirth_finish_time` | number or `nil` | `nil` | Timestamp when rebirth should complete. |
| `CanGrowToFullStage` | function | `try_full_grow` | Internal callback triggered by `WatchWorldState("isfullmoon", ...)`. |

## Main functions
### `update_layers(inst, pct)`
*   **Description:** Controls visibility of barnacle "buds" (`bud1`, `bud2`, `bud3`) based on growth percentage.
*   **Parameters:** `pct` (number) - normalized growth value (0.0 to 1.0).
*   **Returns:** Nothing.

### `finish_full_grow(inst)`
*   **Description:** Spawns a fully grown `waterplant`, transfers current barnacle count and state, and destroys the baby entity.
*   **Parameters:** `inst` (Entity) — the baby waterplant instance.
*   **Returns:** Nothing.
*   **Error states:** Only proceeds if `produce < maxproduce` was already resolved earlier; no safety check is re-run.

### `do_full_grow(inst)`
*   **Description:** Begins the visual and logical transformation to full growth: starts animation, shows next stage visuals, and schedules `finish_full_grow`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `try_full_grow(inst)`
*   **Description:** Checks if full growth conditions are met (full produce count). If yes, triggers `do_full_grow`; otherwise cancels pending growth task.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `on_full_moon(inst)`
*   **Description:** Called when a full moon is detected. Schedules growth transformation if the plant is fully barnacled and no growth task is pending.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `on_harvested(inst, picker, produce)`
*   **Description:** Resets barnacle layers and synchronize `shaveable.prize_count` to `0` after harvesting.
*   **Parameters:** `inst` (Entity), `picker` (Entity), `produce` (number) — current barnacle count.
*   **Returns:** Nothing.

### `on_grow(inst, produce)`
*   **Description:** Updates barnacle layer visibility after growth, plays animation, syncs `shaveable.prize_count`, and may schedule full moon growth if conditions are met.
*   **Parameters:** `inst` (Entity), `produce` (number) — current barnacle count.
*   **Returns:** Nothing.

### `can_shave(inst, shaver, shave_item)`
*   **Description:** Getter function for `shaveable.can_shave_test`; delegates to `harvestable:CanBeHarvested()`.
*   **Parameters:** `inst` (Entity), `shaver` (Entity), `shave_item` (Entity or `nil`).
*   **Returns:** `true` if harvestable, else `false`.

### `on_shaved(inst, shaver, shave_item)`
*   **Description:** Resets layers and produce to 0 after shaving, restarting the growth cycle.
*   **Parameters:** `inst` (Entity), `shaver` (Entity), `shave_item` (Entity or `nil`).
*   **Returns:** Nothing.

### `on_burnt(inst)`
*   **Description:** On burning, drops `barnacle_cooked` loot equal to current produce count, then replaces the entity with `waterplant_rock`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `wait_for_rebirth(inst, rebirth_time)`
*   **Description:** Initializes the rebirth sequence (hides barnacles, stops growing, schedules `do_rebirth`). Used after being burnt.
*   **Parameters:** `inst` (Entity), `rebirth_time` (number, optional) — seconds until rebirth. Defaults to `TUNING.WATERPLANT.REBIRTH_TIME`.
*   **Returns:** Nothing.

### `do_rebirth(inst)`
*   **Description:** Restores the baby state after rebirth: shows `stage1`, plays animation, and restarts growth.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `on_save(inst, data)`
*   **Description:** Serializes pending rebirth or growth state into save data.
*   **Parameters:** `inst` (Entity), `data` (table).
*   **Returns:** Nothing.

### `on_load(inst, data)`
*   **Description:** Restores pending rebirth or full-growth tasks after loading.
*   **Parameters:** `inst` (Entity), `data` (table or `nil`).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onburnt` — triggers `on_burnt`.
- **Watched world state:** `isfullmoon` — triggers `on_full_moon`.
- **Pushes:** `floater_startfloating` (via `floater:OnLandedServer`) — not directly in this file but triggered through component interaction.
- **Exposes custom methods:** `inst.WaitForRebirth(time)`, `inst._DoFullGrow()` — for debugging/development use.