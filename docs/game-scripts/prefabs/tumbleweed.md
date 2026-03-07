---
id: tumbleweed
title: Tumbleweed
description: A mobile environmental item that rolls in the wind and drops random loot when picked up or destroyed.
tags: [environment, loot, physics]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f8e29fab
system_scope: environment
---

# Tumbleweed

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `tumbleweed` prefab is an environmental, physics-enabled object that drifts across the world in the direction of the wind. It uses the `blowinwind` component to control movement and sound, and supports pickup, burning, and haunting behaviors. Upon interaction, it releases random loot items. It interacts with the world wind system, handles ground presence via `CheckGround`, and manages animation, sound, and state persistence.

## Usage example
```lua
local inst = SpawnPrefab("tumbleweed")
-- The tumbleweed automatically starts moving in the current wind direction
-- It will roll, play bounce sounds, and drop loot when picked up or burned
```

## Dependencies & tags
**Components used:** `blowinwind`, `burnable`, `combat`, `hauntable`, `inventoryitem`, `inspectable`, `locomotor`, `pickable`, `playerprox`, `propagator`, `stackable`, `worldwind`  
**Tags:** Adds `tumbleweed`, `pushable`, `corpse`, `plant`; checks `burnt`, `spider`, `spiderwhisperer`, `spiderdisguise`, `monster`, `player`, `frog`, `merm`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `loot` | table | `nil` | List of loot item prefabs generated for this tumbleweed. |
| `lootaggro` | table | `nil` | Boolean list indicating whether each corresponding loot item should generate aggro. |
| `angle` | number | `nil` | Current wind direction angle (in degrees) for movement. |
| `bouncepretask` | Task | `nil` | Delayed task to start bounce sounds. |
| `bouncetask` | Task | `nil` | Periodic bounce sound and ground-check task. |
| `restartmovementtask` | Task | `nil` | Delayed task to resume wind movement after a long action. |
| `bouncepst1`, `bouncepst2` | Tasks | `nil` | Post-animation bounce sound tasks. |
| `scrapbook_anim` | string | `"idle"` | Animation name used in Scrapbook UI. |

## Main functions
### `MakeLoot(inst)`
*   **Description:** Generates a weighted random list of 3 loot items for the tumbleweed, including common resources and rare items (including Chess pieces if unlocked).
*   **Parameters:** `inst` (entity) — the tumbleweed instance to populate loot for.
*   **Returns:** Nothing; populates `inst.loot` and `inst.lootaggro`.

### `onpickup(inst, picker)`
*   **Description:** Handles pickup logic: spawns loot items at the tumbleweed’s position, applies aggro to aggressive loot (e.g., spiders, bees), and spawns break effects.
*   **Parameters:** `inst` (entity), `picker` (entity or `nil`) — the entity picking up the tumbleweed.
*   **Returns:** `true` — signals that the tumbleweed should not be added to the picker’s inventory.
*   **Error states:** May spawn aggro loot even if `picker` is `nil` (e.g., during Haunted Nights or haunting).

### `DoDirectionChange(inst, data)`
*   **Description:** Updates the tumbleweed’s movement direction based on world wind changes.
*   **Parameters:**  
    - `inst` (entity)  
    - `data` (table, optional) — contains `angle` (degrees) and `velocity` (number).  
*   **Returns:** Nothing.
*   **Error states:** Returns early if the entity is asleep or missing the `blowinwind` component.

### `onburnt(inst)`
*   **Description:** Handles tumbleweed destruction by fire: stops movement, spawns ash stack, plays bounce animation sounds, and marks as burnt.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.
*   **Error states:** May cancel pending tasks multiple times safely.

### `OnLongAction(inst)`
*   **Description:** Pauses movement and sound during a long action (e.g., being held); resumes movement after a random delay.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `CheckGround(inst)`
*   **Description:** Validates that the tumbleweed is on solid ground; if not, it sinks and removes itself.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `CancelRunningTasks(inst)`
*   **Description:** Safely cancels all pending animation/sound tasks (e.g., on sleep or long action).
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"windchange"` (on `TheWorld`) — triggers direction updates via `DoDirectionChange`.  
  - `"startlongaction"` — triggers `OnLongAction` to pause movement.  
  - `"animover"` (internal callback) — to resume movement loop after animation.  
  - `"detachchild"` (internal) — emitted when detaching child effects (e.g., `tumbleweedbreakfx`).  
- **Pushes:**  
  - `"stacksizechange"` (via `stackable` component on ash)  
  - `"detachchild"` — emitted when detaching FX or itself.