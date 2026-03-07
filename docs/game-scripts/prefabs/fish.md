---
id: fish
title: Fish
description: Generates raw and cooked fish prefabs with support for drying, cooking, perishing, and bait functionality.
tags: [inventory, food, crafting, bait]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b61e899a
system_scope: inventory
---

# Fish

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `fish.lua` file defines a factory function for creating fish prefabs (raw and cooked) used in Don't Starve Together. It centralizes shared setup via `commonfn`, with specialized variants for raw (`rawfn`) and cooked (`cookedfn`) states. The raw fish exhibits animated "flop" behavior and sound effects upon placement, and supports drying and cooking. The cooked variant disables drying/cooking support but retains perishability and floatability. It integrates with the inventory, edible, perishable, dryable, cookable, bait, and tradable systems.

## Usage example
```lua
local raw_fish, cooked_fish = fish("my_fish", "my_fish_build")
```

## Dependencies & tags
**Components used:** `edible`, `stackable`, `bait`, `perishable`, `dryable`, `cookable`, `inspectable`, `inventoryitem`, `tradable`, `floater`, `soundemitter`, `animstate`, `transform`, `network`, `hauntable` (via `MakeHauntableLaunchAndPerish`)
**Tags:** `meat`, `catfood`, `pondfish`, `dryable` (raw only), `cookable` (raw only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `build` | string | `nil` (set at creation) | Build name used in stategraphs (e.g., `SGwilson`); passed from `fishingrod.lua` |
| `floptask` | `Task` or `nil` | `nil` | Reference to the currently scheduled flop sound task; cleaned up on inventory insertion or death |

## Main functions
### `commonfn(build, anim, loop, dryable, cookable)`
*   **Description:** Core factory function that initializes the base fish entity with shared components and tags. It is not called directly; instead, `rawfn` and `cookedfn` invoke it with specific parameters.
*   **Parameters:**  
    `build` (string) – Build asset name for the entity.  
    `anim` (string) – Initial animation name to play.  
    `loop` (boolean) – Whether to loop the animation.  
    `dryable` (boolean) – Whether to enable the `dryable` component and `dryable` tag.  
    `cookable` (boolean) – Whether to enable the `cookable` component and `cookable` tag.  
*   **Returns:** `inst` (Entity) – Fully configured entity instance (server-only).
*   **Error states:** Returns client-side proxy immediately on non-mastersim worlds; no components added on client.

### `rawfn(build)`
*   **Description:** Creates a raw fish prefab. Sets food stats, enables drying/cooking, adds animation looping and flop sound behavior, and configures perishing speed.
*   **Parameters:**  
    `build` (string) – Build asset name.
*   **Returns:** `inst` (Entity) – Raw fish entity.
*   **Error states:** Returns client-side proxy immediately on non-mastersim worlds.

### `cookedfn(build)`
*   **Description:** Creates a cooked fish prefab. Disables drying/cooking support, adjusts perishing time, and enables floater scaling/offset.
*   **Parameters:**  
    `build` (string) – Build asset name.
*   **Returns:** `inst` (Entity) – Cooked fish entity.
*   **Error states:** Returns client-side proxy immediately on non-mastersim worlds.

### `makefish(build)`
*   **Description:** Wraps `rawfn` and `cookedfn` as functions to support deferred prefab instantiation.
*   **Parameters:**  
    `build` (string) – Build asset name.
*   **Returns:** Two functions: `makerawfn`, `makecookedfn` – each returns the respective entity when invoked.

### `fish(name, build)`
*   **Description:** Top-level factory that produces two `Prefab` objects: one for raw fish and one for cooked fish.
*   **Parameters:**  
    `name` (string) – Base name of the prefab (e.g., `"fish"`).  
    `build` (string) – Build asset name.
*   **Returns:** Two `Prefab` objects: raw fish and `<name>_cooked`.

### `flopsound(inst)`
*   **Description:** Schedules two sequential fishing sound effects to simulate the fish flopping after being caught.
*   **Parameters:**  
    `inst` (Entity) – The fish entity.
*   **Returns:** Nothing.
*   **Error states:** Cancels existing `floptask` on re-entry to prevent duplication; creates `floptask` only on mastersim.

## Events & listeners
- **Listens to:** `animover` – triggers `flopsound` and re-plays `"idle"` animation when animation ends on raw fish.
- **Pushes:** None directly (uses `PushEvent` indirectly via component callbacks like `onperishreplacement` or `hauntable` logic).
- **Listens to:** `OnLoad` – assigns `stopkicking` to restart flop cleanup on save/load.
