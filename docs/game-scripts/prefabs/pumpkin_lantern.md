---
id: pumpkin_lantern
title: Pumpkin Lantern
description: Manages the lifecycle, lighting, and day/night transitions for the pumpkin lantern item, including fading animations, perishability, and loot drops.
tags: [lighting, perishable, inventory, daynight, loot]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 469ed047
system_scope: environment
---

# Pumpkin Lantern

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The pumpkin lantern is a wearable light source that automatically adjusts its illumination based on the world's day/night cycle. It uses networked state (`net_smallbyte`) to synchronize fade progress between server and client. The component integrates with several core systems: `inventoryitem` for drop/put-in-handler callbacks, `health` and `perishable` for durability, and `lootdropper` for fireflies loot. It does not define traditional methods but relies on event-driven callbacks and periodic tasks to manage its state.

## Usage example
```lua
-- The pumpkin_lantern is instantiated via Prefab system, not manually.
-- Example of spawning and configuring in a mod:
local lantern = SpawnPrefab("pumpkin_lantern")
lantern.Transform:SetPosition(x, y, z)
-- It will automatically begin fading in if it is nighttime and not held.
```

## Dependencies & tags
**Components used:** `health`, `inventoryitem`, `lootdropper`, `perishable`, `inspectable`, `combat`  
**Tags:** Adds `veggie` and `light` to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._fade` | `net_smallbyte` | `FADE_FRAMES * 2 + 1` (i.e., `11`) | Networked integer tracking fade progress (0 to 11); controls light intensity/radius and animation blending. |
| `FADE_FRAMES` | number | `5` | Number of frames for fade-in/out phases; used to calculate timing. |
| `FADE_INTENSITY` | number | `0.8` | Base light intensity (multiplied by fade factor). |
| `FADE_RADIUS` | number | `1.5` | Base light radius (adjusted with flicker and fade). |
| `FADE_FALLOFF` | number | `0.5` | Base light falloff exponent. |

## Main functions
The pumpkin lantern does not expose standalone functions; functionality is embedded in callbacks and internal logic. Below are the key procedural functions that implement its behavior:

### `FadeIn(inst, instant)`
*   **Description:** Initiates fading-in the lantern’s light and animation to the night state. Used when the lantern is dropped at night or becomes visible after sunset.
*   **Parameters:**  
    `inst` (Entity) – the lantern prefab instance.  
    `instant` (boolean) – if `true`, skips animation transition and sets immediate state.  
*   **Returns:** Nothing.  
*   **Error states:** Skips animation if already in `idle_night_loop`.

### `FadeOut(inst, instant)`
*   **Description:** Initiates fading-out the lantern’s light and animation to the day state. Used when the lantern is held, stored in inventory, or during daylight.
*   **Parameters:**  
    `inst` (Entity) – the lantern prefab instance.  
    `instant` (boolean) – if `true`, skips animation transition and sets immediate state.  
*   **Returns:** Nothing.  
*   **Error states:** Skips animation if already in `idle_day` or if dead.

### `OnUpdateFade(inst)`
*   **Description:** Periodic task callback (every `FRAMES`) that updates light intensity, radius, and falloff based on `_fade` counter. Controls flicker animation toggle and schedules cancelation of fade task upon completion.
*   **Parameters:**  
    `inst` (Entity) – the lantern instance.  
*   **Returns:** Nothing.

### `OnFadeDirty(inst)`
*   **Description:** Called when `_fade` changes (networked or local). Ensures `OnUpdateFade` task is scheduled to run periodically.
*   **Parameters:**  
    `inst` (Entity) – the lantern instance.  
*   **Returns:** Nothing.

### `ondeath(inst)`
*   **Description:** Event handler for `death`. Stops perish timer, cancels day tasks, fades out light, spawns fireflies loot, and plays broken animation/sound.
*   **Parameters:**  
    `inst` (Entity) – the lantern instance.  
*   **Returns:** Nothing.

### `onperish(inst)`
*   **Description:** Handler for when perish timer completes. Plays the `rotten` animation and kills the entity.
*   **Parameters:**  
    `inst` (Entity) – the lantern instance.  
*   **Returns:** Nothing.

### `CanFade(inst)`
*   **Description:** Predicate that returns whether the lantern can transition between day/night states. Prevents fading when held or dead.
*   **Parameters:**  
    `inst` (Entity) – the lantern instance.  
*   **Returns:** `true` if not held and not dead; otherwise `false`.

### `OnIsDay(inst, isday, delayed)`
*   **Description:** World-state watcher for `isday`. Handles delayed transitions to smooth day/night changes.
*   **Parameters:**  
    `inst` (Entity) – the lantern instance.  
    `isday` (boolean) – current world day state.  
    `delayed` (boolean) – whether this is the initial or delayed event.  
*   **Returns:** Nothing.

### `OnDropped(inst)`
*   **Description:** Inventory item callback triggered on drop. Restarts perish timer if not dead, stops day watch task, and begins appropriate fade-in/out based on current world time.
*   **Parameters:**  
    `inst` (Entity) – the lantern instance.  
*   **Returns:** Nothing.

### `OnPutInInventory(inst)`
*   **Description:** Inventory item callback triggered when placed in inventory. Stops perish timer, cancels day watch task, and immediately fades out light.
*   **Parameters:**  
    `inst` (Entity) – the lantern instance.  
*   **Returns:** Nothing.

### `OnLoad(inst)`
*   **Description:** Post-load handler to reinitialize fade and animation state based on world time and inventory status.
*   **Parameters:**  
    `inst` (Entity) – the lantern instance.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `death` – triggers `ondeath` to handle destruction and loot.  
  - `fadedirty` (client) – triggers `OnFadeDirty` to synchronize fade updates from server.  
  - World state `isday` via `WatchWorldState` – triggers `OnIsDay` for day/night transitions.  
- **Pushes:**  
  - None explicitly (relies on parent components for event propagation).