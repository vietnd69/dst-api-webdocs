---
id: rat_gym
title: Rat Gym
description: Manages carrat training sessions, item handling, and structural state changes for rat gyms in the Year of the Carrat event.
tags: [training, event, inventory, fire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7bc14e82
system_scope: entity
---

# Rat Gym

> Based on game build **7140014** | Last updated: 2026-03-06

## Overview
The `rat_gym` prefab defines four training structures (`carrat_gym_direction`, `carrat_gym_speed`, `carrat_gym_reaction`, `carrat_gym_stamina`) that accept carrat items and train them. It integrates multiple components to manage item storage (`shelf`, `inventory`), training logic (`gym`), structural durability (`workable`, `burnable`), and event-specific trading rules (`trader`). The component handles carrat ingestion, training start/stop, music state updates, burn state transitions, and owner-restricted item access.

## Usage example
```lua
-- Example: Deploy and use a carrat gym
local gym = SpawnPrefab("yotc_carrat_gym_speed")
gym.Transform:SetPosition(x, y, z)

-- Train a carrat
local carrat = SpawnPrefab("carrat")
gym.components.shelf:PutItemOnShelf(carrat)
gym.components.gym:SetTrainee(carrat)
gym.components.gym:StartTraining()
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `shelf`, `trader`, `inventory`, `timer`, `gym`, `inspectable`, `burnable`, `propagator`, `fueled`, `perishable`.  
**Tags:** Adds `structure`. Checks `burnt`, `player`.  
**Tags used in tests:** Checks `player`, `ignoretalking` (via talker component indirectly).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `rat_trainer_id` | string? | `nil` | User ID of the player who placed the rat in the gym. Used to enforce ownership restrictions on item removal. |
| `_musicstate` | net_tinybyte | `CARRAT_MUSIC_STATES.NONE` | Networked state indicating current music state (`NONE`, `TRAINING`, etc.). |

## Main functions
### `getcarrat(inst, item, train)`
*   **Description:** Accepts a carrat item, places it on the shelf, registers it as a trainee, starts training (if `train` is true), and applies color overrides for the carrat’s appearance.
*   **Parameters:** `inst` (Entity) — the gym instance; `item` (Entity) — the carrat prefab instance; `train` (boolean) — whether to immediately begin training.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; assumes valid carrat and inventory/shelf state.

### `ejectitem(inst, item)`
*   **Description:** Removes and drops an item from the gym’s inventory/shelf, resets its state machine to `"idle"`, and clears its perished callback if registered.
*   **Parameters:** `inst` (Entity) — the gym instance; `item` (Entity) — the item to eject.
*   **Returns:** Nothing.
*   **Error states:** If `item` is not the shelved item, it is first dropped via inventory. Safe for `nil` input.

### `MakeGym(name, build, size)`
*   **Description:** Factory function to create gym prefabs with a full set of components, animations, and behaviors. Returns three prefabs: the gym structure, its deployable kit item, and its placer entity.
*   **Parameters:** `name` (string) — base name (e.g., `"carrat_gym_speed"`); `build` (string) — animation bank/build name; `size` (number) — physics radius.
*   **Returns:** Prefab (gym), Prefab (item), Prefab (placer).

### `ShouldAcceptItem(inst, item, giver)`
*   **Description:** Trader accept test function that determines if a carrat can be accepted based on gym capacity and carrat perish condition.
*   **Parameters:** `inst` (Entity) — the gym; `item` (Entity) — proposed item; `giver` (Entity) — item provider (usually player).
*   **Returns:** `true` if carrat passes health/perish threshold; `false` otherwise.
*   **Error states:** May notify `giver` of rejection via talker if carrat is too perishable.

### `OnShelfTakeTest(inst, taker, item)`
*   **Description:** Determines if an entity (`taker`) may remove a shelved carrat.
*   **Parameters:** `inst` (Entity) — the gym; `taker` (Entity) — entity attempting to take the item; `item` (Entity) — the shelved carrat.
*   **Returns:** `true` if taker is the original trainer, `false` if another non-player/taker violates ownership, or `true` if the original owner is offline.
*   **Error states:** Returns `false` for non-player takers; notify `taker` with localized fail string if ownership denied.

## Events & listeners
- **Listens to:** `itemget`, `itemlose`, `perished`, `musicstatedirty`, `onremove` (via gym trainee listener), `death` (via gym trainee listener), `hit`, `hammered`.
- **Pushes:** `ratupdate`, `rest`, `starttraining`, `endtraining`, `hit`, `dropitem`, `onburnt`, `onextinguish`, `ignite`.