---
id: critterlab
title: Critterlab
description: Represents a decorative lab-themed critter den that emits idle sounds, plays animations, and supports prototyper functionality for crafting trees.
tags: [decoration, crafting, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: eaca2ea0
system_scope: environment
---

# Critterlab

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`critterlab` is a static decorative environment prefab that functions as a lab-themed critter den. It plays idle animations and ambient sounds when active, supports turning on/off via the `prototyper` component, and contributes to the world’s aesthetic and functional craftability system. It is commonly used in prefabricated rooms and world layouts. The prefab does not host logic itself but delegates behavior to attached components, notably `prototyper` and `hauntable`.

## Usage example
```lua
-- Typically instantiated internally by the worldgen system
local inst = Prefab("critterlab", fn, assets, prefabs)

-- After creation, the component behavior is controlled automatically:
-- - When turned on: plays idle sound and random proximity animations
-- - When turned off: stops sound and animations
-- - Can be hauntable by players (e.g., via hauntable component behavior)
```

## Dependencies & tags
**Components used:** `animstate`, `transform`, `minimapentity`, `soundemitter`, `network`, `inspectable`, `prototyper`, `hauntable`  
**Tags added:** `critterlab`, `antlion_sinkhole_blocker`, `prototyper`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `idletask` | Task or `nil` | `nil` | Holds the scheduled idle animation task; set/cleared by `blink()` and `onturnoff()`. |
| `scrapbook_specialinfo` | string | `"CRITTERDEN"` | Metadata used by the game to categorize this entity in the scrapbook. |
| `prototyper.trees` | TechTree | `TUNING.PROTOTYPER_TREES.CRITTERLAB` | Crafting trees associated with this prototyper. |
| `hauntable.hauntvalue` | number | `TUNING.HAUNT_TINY` | Haunt value applied when players approach or interact. |

## Main functions
### `blink(inst)`
*   **Description:** Plays a randomly selected proximity loop animation (`"proximity_loop1"`–`"proximity_loop4"`) and schedules the next blink after a random delay (1.0–2.0 seconds).
*   **Parameters:** `inst` (Entity) – The entity instance.
*   **Returns:** Nothing.
*   **Error states:** None. Only active when `onturnon` has been called and `idletask` is not `nil`.

### `onturnoff(inst)`
*   **Description:** Stops idle animations and sound loop when the prototyper is turned off.
*   **Parameters:** `inst` (Entity) – The entity instance.
*   **Returns:** Nothing.
*   **Error states:** Safely handles missing `idletask` by checking for `nil` before canceling.

### `onturnon(inst)`
*   **Description:** Starts the idle sound loop and initiates blinking animation when the prototyper is turned on.
*   **Parameters:** `inst` (Entity) – The entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly defined in this file. Event interactions occur via component callbacks (`onturnon`, `onturnoff`).
- **Pushes:** None.

### External component behaviors used:
- `inst.components.prototyper.onturnon` / `onturnoff` – Hooked to `onturnon`/`onturnoff` functions above.
- `inst.components.hauntable:SetHauntValue()` – Sets haunt threshold to `TUNING.HAUNT_TINY`.
- `inst.components.prototyper.trees` – Assigned `TUNING.PROTOTYPER_TREES.CRITTERLAB`.