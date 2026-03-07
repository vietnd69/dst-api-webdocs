---
id: waterplant_pollen
title: Waterplant Pollen
description: Manages the visual and gameplay effects of waterplant pollen clouds, including spawning fish attractants (chum pieces) over time and fading out after dispersal.
tags: [environment, fx, timer]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a2a78e50
system_scope: environment
---

# Waterplant Pollen

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `waterplant_pollen.lua` file defines two prefabs: `waterplant_pollen_fx` (land-based pollen cloud) and `waterplant_pollen_fx_ocean` (ocean variant that emits fish-attracting chum pieces). The ocean variant uses the `timer` component to schedule dispersal after a fixed duration, while the land variant simply vanishes after ~35 frames and triggers the ocean variant. It is part of the environmental FX system for water plants (e.g., watering flowers in the Forest/Caves).

## Usage example
```lua
-- Land-based pollen effect
local land_pollen = SpawnPrefab("waterplant_pollen_fx")
land_pollen.Transform:SetPosition(x, y, z)

-- Ocean-based pollen effect (produces chum pieces periodically)
local ocean_pollen = SpawnPrefab("waterplant_pollen_fx_ocean")
ocean_pollen.Transform:SetPosition(x, y, z)
-- Disperses automatically after TUNING.WATERPLANT.POLLEN_DURATION seconds
```

## Dependencies & tags
**Components used:** `timer`
**Tags added:** `FX`, `NOCLICK`, `notarget`, `pollen`, `chum` (ocean variant only)

## Properties
No public properties — both prefabs are self-contained FX entities with no mutable state exposed for external modification.

## Main functions
### `spawn_ocean_pollen(inst)`
* **Description:** Called once (~35 frames after creation) for the land variant; spawns the ocean variant at the same position and conditionally signals the source flower if nearby fish count is low.
* **Parameters:** `inst` (Entity) — the land-based pollen instance.
* **Returns:** Nothing.

### `on_piece_removed(piece)`
* **Description:** Listener for `onremove` events on chum pieces; decrements the chum piece count and spawns a replacement if dispersal has not yet started (i.e., `persists == true`).
* **Parameters:** `piece` (Entity) — the removed chum piece.
* **Returns:** Nothing.

### `spawn_chum_piece(inst)`
* **Description:** Spawns a new chum piece (`chumpiece`) in a random position around the pollen cloud if the piece count is below `MAX_PIECES` (5), and only if the spawn point is underwater.
* **Parameters:** `inst` (Entity) — the ocean pollen instance.
* **Returns:** Nothing.

### `on_timer_done(inst, data)`
* **Description:** Handles the `"disperse"` timer completion; disables persistence, stops sound, removes `chum` tag, triggers fade-out, and schedules removal.
* **Parameters:**
  * `inst` (Entity) — the ocean pollen instance.
  * `data` (table) — timer data, expected to contain `name == "disperse"`.
* **Returns:** Nothing.

### `on_ocean_removed(inst)`
* **Description:** Cleanup handler for when the ocean pollen is removed; forcibly removes all active chum pieces.
* **Parameters:** `inst` (Entity) — the ocean pollen instance.
* **Returns:** Nothing.

### `client_fading_dirty(inst)`
* **Description:** Starts a periodic task to reduce the opacity of the animation over time when the `fadingdirty` event is received (client-side only, non-dedicated servers).
* **Parameters:** `inst` (Entity) — the ocean pollen instance.
* **Returns:** Nothing.

### `update_fade(inst)`
* **Description:** Periodic task (called every frame) that decreases the alpha value of the `OverrideMultColour` to fade out the visual effect.
* **Parameters:** `inst` (Entity) — the ocean pollen instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  * `animover` — for land variant; triggers self-removal when animation ends.
  * `timerdone` — for ocean variant; fires `on_timer_done` on `"disperse"` completion.
  * `onremove` — for ocean variant; fires `on_ocean_removed` to clean up chum pieces.
  * `fadingdirty` — for ocean variant (client-side only, non-dedicated servers); triggers fade task.
  * `onremove` (on chum pieces) — via `on_piece_removed` listener added during chum piece creation.

- **Pushes:**
  * None — the prefab does not fire custom events. The land variant indirectly signals `pollenlanded` on the source flower *if present and low-fish conditions are met*, but this is done via `:PushEvent("pollenlanded")` on the flower, not the pollen instance itself.