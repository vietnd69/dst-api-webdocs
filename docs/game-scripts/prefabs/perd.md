---
id: perd
title: Perd
description: Manages the character prefab for Perd, including behavior, components, and event-specific offering mechanics.
tags: [character, ai, event]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1ffcc92b
system_scope: entity
---

# Perd

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `perd` prefab defines the behavior and component configuration for the Perd character entity. It integrates standard character components (locomotion, health, combat, eater, sleeper), adds character-specific logic (e.g., seeking and interacting with the YOTG shrine event), and implements save/load callbacks for persistent home tracking. During the "Year of the Golden Chicken" (YOTG) event, it enables extra systems including a timer-based offering mechanic and shrine-related chain-reactive attacks.

## Usage example
```lua
local perd = SpawnPrefab("perd")
perd.Transform:SetPosition(x, y, z)
perd.DropOffering(perd) -- triggers a redpouch drop if cooldown is not active
```

## Dependencies & tags
**Components used:** `locomotor`, `homeseeker`, `eater`, `sleeper`, `health`, `combat`, `lootdropper`, `inventory`, `inspectable`, `timer` (event-specific).  
**Tags added:** `character`, `berrythief`, `perd` (event-specific via `IsSpecialEventActive(SPECIAL_EVENTS.YOTG)`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `seekshrine` | boolean | `nil` or `true` (event mode) | Indicates if the perd is currently interacting with the shrine (YOTG event only). |
| `scrapbook_hide` | table | `{ "hat" }` | List of animation symbols to hide in the Scrapbook UI. |
| `override_combat_fx_height` | string | `"high"` | Overrides combat hit effect vertical offset. |
| `DropOffering` | function | `nil` (event-specific) | Reference to the offering drop function (YOTG only). |

## Main functions
### `OnAttacked(inst)`
*   **Description:** During the YOTG event, this callback triggers when Perd is attacked. It scans nearby Perd entities for shrine interaction (`seekshrine`), removes their shrine flag, and recursively invokes `OnAttacked` on them to propagate the event. Cancels further listening after first trigger.
*   **Parameters:** `inst` (Entity) — the entity being attacked.
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `OnEat(inst, food)`
*   **Description:** Callback invoked when Perd eats. During YOTG, triggers offering creation if food is on the ground (not held) and offering cooldown is not active. Sets `inst.sg.statemem.dropoffering = true` and optionally begins shrine tracking.
*   **Parameters:**  
    `inst` (Entity) — the perd entity.  
    `food` (Entity) — the food item being eaten.  
*   **Returns:** Nothing.

### `lootsetfn(lootdropper)`
*   **Description:** Loot setup function. Adds a 10% chance to drop `redpouch` as loot if offering cooldown is not active.
*   **Parameters:** `lootdropper` (LootDropper component) — the component instance.
*   **Returns:** Nothing.

### `DropOffering(inst)`
*   **Description:** Drops a `redpouch` prefabricated item toward the nearest player using `LaunchAt`. Only activates if offering cooldown timer is not running. Starts the cooldown timer for one full day cycle.
*   **Parameters:** `inst` (Entity) — the perd entity.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves the GUID of the current home (from `homeseeker.home`) into the save data under `data.home`.
*   **Parameters:**  
    `inst` (Entity) — the perd entity.  
    `data` (table) — the save data table to populate.  
*   **Returns:** `nil` (if no home is set), or a table containing `{ data.home }`.

### `OnLoadPostPass(inst, newents, data)`
*   **Description:** Restores the `homeseeker.home` reference after load by resolving `data.home` GUID to an entity via `newents`.
*   **Parameters:**  
    `inst` (Entity) — the perd entity.  
    `newents` (table) — map of GUID → entity after load resolution.  
    `data` (table) — saved data containing `data.home`.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` — used for shrine event propagation during YOTG. Only added if `IsSpecialEventActive(SPECIAL_EVENTS.YOTG)` is true.
- **Pushes:** None directly, but triggers recursive calls to `OnAttacked` on other Perd entities.
