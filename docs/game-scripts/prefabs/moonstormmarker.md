---
id: moonstormmarker
title: Moonstormmarker
description: Creates a rotating minimap marker used to visually indicate an active moon storm event.
tags: [minimap, event, visual]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8b9ecdb1
system_scope: world
---

# Moonstormmarker

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `moonstormmarker` prefab creates a short-lived, rotating minimap icon used during moon storm events. It does not behave like a typical entity with persistent logic — instead, it exists solely to provide a visual cue on the minimap that updates periodically. It spawns a `globalmapicon` to ensure the marker is visible across clients in multiplayer. The prefab is non-simulating (`persists = false`), non-blocking (`NOBLOCK` tag), and is used exclusively on the master simulation.

## Usage example
```lua
-- Typically created internally by the game during a moon storm event
-- Manual usage (e.g., for debugging) would look like:
local inst = SpawnPrefab("moonstormmarker_big")
inst:AddTag("NOBLOCK") -- already added by default
```

## Dependencies & tags
**Components used:** `Transform`, `MiniMapEntity`, `SoundEmitter`, `Network`  
**Tags:** Adds `NOBLOCK`  
**Prefabs referenced:** `globalmapicon`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `marker_index` | number | `1` (master only) | Current frame index (0–7) for the rotating marker animation. Only used on the master. |
| `icon` | entity reference | `nil` (set later) | Reference to the spawned `globalmapicon` used for multiplayer minimap visibility. |

## Main functions
### `do_marker_minimap_swap(inst)`
*   **Description:** Rotates the minimap icon to the next frame (0–7) in the sequence to create an animation effect. Called periodically by `DoPeriodicTask`.
*   **Parameters:** `inst` (entity) — the marker instance.
*   **Returns:** Nothing.
*   **Error states:** Resets `marker_index` to `0` if `nil`; wraps to `0` after `7` via modulo operation.

### `show_minimap(inst)`
*   **Description:** Spawns a `globalmapicon` to mirror this marker’s minimap appearance across clients and schedules periodic icon swaps. Called once on initialization.
*   **Parameters:** `inst` (entity) — the marker instance.
*   **Returns:** Nothing.
*   **Error states:** `inst.icon` is set to the spawned `globalmapicon` entity.

## Events & listeners
- **Pushes:** None identified.
- **Listens to:** None identified.  
  (Note: Uses `DoPeriodicTask` and `DoTaskInTime` for scheduling, not event listeners.)

### Additional notes
- Two prefab variants are exported: `"moonstormmarker_big"` (default) and `"monstormmarker_debug"` (likely typo for `"moonstormmarker"` in name). Both use the same constructor `fn`.
- The `fn` function returns early on clients (`if not TheWorld.ismastersim`) — no local logic is executed on non-master nodes.
- The icon image files are loaded via `Asset("MINIMAP_IMAGE", "moonstormmarker{0-7}")`, and the filename is built at runtime as `"moonstormmarker" .. index .. ".png"`.