---
id: mapscroll
title: Mapscroll
description: Represents a map scroll item that records and displays map data, supporting both overworld and cave locations with dynamic description and visual updates.
tags: [map, inventory, data, ui]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4b4b7c28
system_scope: world
---

# Mapscroll

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`mapscroll` is a prefabricated item that functions as a recorded map, storing and displaying exploration data for the current world location (overworld or cave). It integrates with several components including `maprecorder` for data handling, `inspectable` for dynamic tooltip descriptions, `inventoryitem` for visual representation, and `fuel` for burnability. The item automatically updates its description and appearance based on the recorded map data.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("maprecorder")
inst.components.maprecorder:RecordMap(player)
```

## Dependencies & tags
**Components used:** `tradable`, `inspectable`, `erasablepaper`, `maprecorder`, `inventoryitem`, `fuel`, `burnable`, `propagator`, `hauntable_launch`.  
**Tags:** Adds `mapscroll` via `inst:AddTag("mapscroll")`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `OnBuiltFn` | function | `OnBuilt` | Callback executed when the item is built, triggers map recording. |
| `prefab` | string | `"mapscroll"` or `"mapscroll_tricker"` | Prefab identifier used to differentiate standard vs. Tricker variant behavior. |
| `pickupsound` | string | `"paper"` | Sound played when the item is picked up. |
| `AnimState` | AnimState component | — | Manages visual appearance and animation state (bank/build/animation). |

## Main functions
### `OnBuilt(inst, builder)`
*   **Description:** Record map data upon item construction. Calls `maprecorder:RecordMap(builder)` to capture the world map as of the builder’s knowledge.
*   **Parameters:**  
    `inst` (Entity) – the mapscroll entity instance.  
    `builder` (Entity) – the player entity who built the mapscroll.  
*   **Returns:** Nothing.

### `OnTeach(inst, learner)`
*   **Description:** Notifies the learner entity that the map has been taught. Triggers the `"learnmap"` event on the learner with the mapscroll instance.
*   **Parameters:**  
    `inst` (Entity) – the mapscroll entity instance.  
    `learner` (Entity) – the player receiving the map knowledge.  
*   **Returns:** Nothing.

### `OnDataChanged(inst)`
*   **Description:** Updates the item’s description, image name, and build animation based on recorded map data (author, day, location).
*   **Parameters:**  
    `inst` (Entity) – the mapscroll entity instance.  
*   **Returns:** Nothing.

### `common_clientfn()`
*   **Description:** Client-side initialization. Creates the base entity with transform, anim state, network, physics, and audio components. Sets default animation, floatable behavior, and tags.
*   **Parameters:** None.
*   **Returns:** Entity (pre-configured client-side representation).

### `common_serverfn(inst)`
*   **Description:** Server-side initialization. Adds required components and configures callbacks for map recording, inspection, and fuel behavior.
*   **Parameters:**  
    `inst` (Entity) – the fully initialized entity instance.  
*   **Returns:** Nothing.

### `fn()` and `fn_tricker()`
*   **Description:** Prefab constructors. Both create identical client entities via `common_clientfn()`, then call `common_serverfn()` on the master simulation. `fn_tricker()` additionally overrides the `inspectable.nameoverride` and forces the inventory image name to `"mapscroll"`.
*   **Parameters:** None.
*   **Returns:** Prefab definition for `"mapscroll"` and `"mapscroll_tricker"`.

## Events & listeners
- **Listens to:**  
  - `"learnmap"` event push (via `learner:PushEvent("learnmap", { map = inst })` in `OnTeach`).  
- **Pushes:**  
  - `"imagechange"` via `inst.components.inventoryitem:ChangeImageName()` when inventory image is updated.  
  - `"learnmap"` on learner entity to signal map transmission.