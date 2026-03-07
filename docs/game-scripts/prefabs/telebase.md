---
id: telebase
title: Telebase
description: Manages a structure that accepts gem placements to enable teleportation functionality, and responds to hammering by destroying itself and dropping gems.
tags: [structure, teleportation, crafting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 00c659c8
system_scope: world
---

# Telebase

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`telebase` is a structure prefab that supports interactive gem placement via `gemsocket` parts. It enables teleportation by validating that all attached sockets are occupied (i.e., `caninteractwith`). When hammered, it drops all active gems as `purplegem` and destroys itself. It integrates with multiple components for workability, loot dropping, object spawning, and inspection, and participates in a global registry (`TELEBASES`) used for finding nearby valid teleportation targets.

## Usage example
```lua
-- Typical instantiation in a prefab definition (built via prefabutil)
return Prefab("telebase", commonfn, assets, prefabs),
    MakePlacer("telebase_placer", "staff_purple_base_ground", "staff_purple_base_ground", "idle", true, nil, nil, nil, 90, nil, placerdecor)
```

## Dependencies & tags
**Components used:** `inspectable`, `workable`, `lootdropper`, `objectspawner`, `placer`, `savedrotation`  
**Tags:** Adds `telebase`, `CLASSIFIED`, `NOCLICK`, `placer` (to internal placer parts)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onteleto` | function | `teleport_target` | Called when another entity teleports *to* this telebase. Removes attached gems. |
| `canteleto` | function | `validteleporttarget` | Returns `true` if this telebase is a valid teleport destination (i.e., all `gemsocket` parts are occupied and not `caninteractwith`). |
| `scrapbook_speechstatus` | string | `"VALID"` | Inspection status string shown in scrapbook. |
| `TELEBASES` | table | `{}` (global) | Global registry of active telebase instances. |

## Main functions
### `FindNearestActiveTelebase(x, y, z, range, minrange)`
* **Description:** Searches the global `TELEBASES` registry to find the nearest valid telebase within `range` (squared) and at least `minrange` (squared) distance from the point `(x, y, z)`.
* **Parameters:**  
  `x`, `y`, `z` (numbers) — world coordinates to search from.  
  `range` (number, optional) — max distance squared (defaults to `math.huge`).  
  `minrange` (number, optional) — minimum distance squared.
* **Returns:** The nearest valid telebase entity, or `nil`.
* **Error states:** Returns `nil` if no valid telebase meets range criteria or if `minrange >= range`.

### `teleport_target(inst)`
* **Description:** Called when a teleport *to* this telebase occurs. Destroys all attached `gemsocket` objects and their functionality by invoking their `DestroyGemFn`, if present.
* **Parameters:** `inst` — the telebase entity.
* **Returns:** Nothing.

### `validteleporttarget(inst)`
* **Description:** Determines if the telebase is a valid teleport destination. A telebase is valid only if all its `objectspawner.objects` have `pickable.caninteractwith == false` (i.e., all sockets are occupied).
* **Parameters:** `inst` — the telebase entity.
* **Returns:** `true` if valid, `false` otherwise.

### `dropgems(inst)`
* **Description:** Iterates through attached `gemsocket` objects and spawns `purplegem` loot for each socket where `caninteractwith == true`.
* **Parameters:** `inst` — the telebase entity.
* **Returns:** Nothing.

### `ondestroyed(inst)`
* **Description:** Full destruction handler: drops gems, triggers `lootdropper:DropLoot()`, spawns a `collapse_small` effect, and removes the telebase entity.
* **Parameters:** `inst` — the telebase entity.
* **Returns:** Nothing.

### `onhit(inst)`
* **Description:** Animates `gemsocket` parts based on state: if sockets are occupied, plays `"hit_full"` animation; otherwise `"hit_empty"`.
* **Parameters:** `inst` — the telebase entity.
* **Returns:** Nothing.

### `OnGemChange(inst)`
* **Description:** Enables or disables bloom effect on all `gemsocket` parts depending on whether the telebase is currently a valid teleport target.
* **Parameters:** `inst` — the telebase entity.
* **Returns:** Nothing.

### `NewObject(inst, obj)`
* **Description:** Called when a new `gemsocket` object is spawned onto the telebase. Registers listeners for `"trade"` and `"picked"` events on the socket to trigger `OnGemChange`.
* **Parameters:**  
  `inst` — the telebase entity.  
  `obj` — the spawned gemsocket entity.
* **Returns:** Nothing.

### `OnBuilt(inst)`
* **Description:** Called when the telebase is built. Spawns three `gemsocket` parts at fixed relative positions, rotates them according to the telebase's orientation, and schedules them to be revealed with animation delays.
* **Parameters:** `inst` — the telebase entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onbuilt"` → `OnBuilt` — to initialize gem sockets on construction.  
  - `"ondeconstructstructure"` → `dropgems` — to refund gems when deconstructed.  
  - `"onremove"` → `OnRemove` — to clean up the telebase from the global `TELEBASES` registry and remove sockets.  
  - `"trade"` and `"picked"` (per `gemsocket`) → `OnGemChangeProxy` → `OnGemChange` — to toggle bloom and update validity state.
- **Pushes:** None (events are handled externally by DST's systems, e.g., `workable` triggers callbacks; no custom `PushEvent` calls are present).