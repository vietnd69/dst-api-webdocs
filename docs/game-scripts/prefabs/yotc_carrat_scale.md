---
id: yotc_carrat_scale
title: Yotc Carrat Scale
description: A gym-scale structure that accepts carrat rats, displays their stats via animated rods, and manages their interaction during training.
tags: [gym, structure, race, training, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1671a4c1
system_scope: entity
---

# Yotc Carrat Scale

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`yotc_carrat_scale` is a structure component that functions as a carrat-rat training scale. It accepts a carrat via the `trader` component, stores it on its shelf using the `shelf` component, and visually displays the carrat's stats (speed, direction, reaction, stamina) via animated rod symbols. It also integrates with `workable`, `burnable`, and `lootdropper` for durability, hammering, and destruction behavior. The component maintains state through callbacks for item acquisition, stat updates, item loss, and persistence across game saves.

## Usage example
```lua
-- Deploy the carrat scale structure (typically handled by its deployable kit)
local scale = SpawnPrefab("yotc_carrat_scale")

-- Accept and train a carrat
local carrat = SpawnPrefab("carrat")
carrat.Transform:SetPosition(scale.Transform:GetWorldPosition())
scale.components.trader:AcceptItem(carrat)

-- Update the displayed stats (e.g., after stat training)
scale:DoTaskInTime(0, function() if scale.updateratstats then scale.updateratstats(scale) end end)
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `shelf`, `trader`, `inventory`, `timer`, `inspectable`, `burnable`, `propagator`, `hauntable`, `lunarhailbuildup`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`

**Tags:** Adds `structure` (via `inst:AddTag("structure")`); checks `burnt`, `player`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `rat` | Entity (optional) | `nil` | The carrat currently placed on the scale. |
| `rat_trainer_id` | string (optional) | `nil` | User ID of the player who originally placed the carrat. |
| `updateratstats` | function | `updateratstats` (defined) | Public method to refresh stat animations after carrat stat changes. |
| `OnSave`, `OnLoad`, `OnLoadPostPass`, `OnRemoveItem` | function | Assigned in `fn()` | Serialization and entity removal callbacks. |

## Main functions
### `SetStat(inst, dir, stam, reac, speed)`
*   **Description:** Animates the scale’s stat rods to reflect the given stat values for the carrat.
*   **Parameters:** `dir`, `stam`, `reac`, `speed` (numbers) — stat values for direction, stamina, reaction, and speed respectively. If all are truthy, sets rod animations after a delay.
*   **Returns:** Nothing.
*   **Error states:** No-op if any stat argument is `nil`.

### `ejectitem(inst, item)`
*   **Description:** Removes and drops an item (e.g., a carrat) from the scale’s shelf, returning the scale to idle animation.
*   **Parameters:** `inst` (Entity), `item` (Entity or `nil`) — item to eject. If not currently on the shelf, drops it.
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Handles burnt state: runs default burnt structure behavior and removes the `trader` component (making the scale unusable).
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnIgnite(inst)`
*   **Description:** Handles ignition: disables the `trader`, runs default ignite behavior, and ejects the carrat (if present).
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnExtinguish(inst)`
*   **Description:** Re-enables the `trader` component after the scale is extinguished.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onhit(inst)`
*   **Description:** Called on work damage (e.g., hammering while active); ejects the carrat and plays a hit animation.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onhammered(inst)`
*   **Description:** Called when the scale is fully hammered (destroyed): extinguishes fire (if any), drops loot, spawns a collapse FX, and removes the entity.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `ShouldAcceptItem(inst, item, giver)`
*   **Description:** Determines if the scale accepts the given item (carrat); rejects if carrat is too perishable.
*   **Parameters:** `item` (Entity), `giver` (Entity).
*   **Returns:** `true` if accepted, `false` otherwise. May trigger a localized message to the giver on rejection.

### `OnGetItem(inst, data, notrain)`
*   **Description:** Handles carrat placement: stores the carrat, sets up removal callbacks, applies color overrides, animates, and updates stat rods.
*   **Parameters:** `data` (table with `item` key), `notrain` (unused in implementation).
*   **Returns:** Nothing.

### `updateratstats(inst)`
*   **Description:** Refreshes stat rod animations for the current carrat; plays extension/loop animation and slide sound.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnLoseItem(inst, data)`
*   **Description:** Handles carrat removal: resets stats, re-enables trader, clears overrides, plays off animation.
*   **Parameters:** `inst` (Entity), `data` (table, unused).
*   **Returns:** Nothing.

### `OnRemoveItem(inst, taker, item)`
*   **Description:** Cleanup callback when the carrat is removed; clears `OnRemoveFn` and triggers `OnLoseItem`.
*   **Parameters:** `inst` (Entity), `taker` (Entity), `item` (Entity).
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Provides status string for the `inspectable` component: `"BURNT"`, `"CARRAT"`, or `"CARRAT_GOOD"` if any stat >= 5.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `string` status.

### `TestForCarratIdle(inst)`
*   **Description:** Randomly plays a stat-specific idle animation (e.g., "speed") while looping on the scale, based on carrat stat weights.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onbuilt(inst)`
*   **Description:** Plays placement sound and animation upon building the structure.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `itemget`, `itemlose`, `animover`, `onremove`, `perished`, `onbuilt`.
- **Pushes:** None directly (relies on component-emitted events like `dropitem`, `onextinguish`, etc. from `burnable`, `shelf`, etc.).