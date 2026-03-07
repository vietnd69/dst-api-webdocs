---
id: burntground
title: Burntground
description: Manages the animated, fading visual effect of burnt ground patches, including network synchronization and persistence across saves.
tags: [environment, fx, persistence]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7e67cf9f
system_scope: environment
---

# Burntground

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `burntground` prefab creates a visual effect entity representing scorched terrain, typically left behind by fire-based events such as campfires burning out or lightning strikes. It uses an animation state with a dynamically fading alpha channel controlled by a small-byte network variable (`_fade`), which decrements over time until the entity automatically removes itself. The component supports synchronization between server and client, and persists fade state and orientation via save/load hooks.

## Usage example
```lua
-- Server-side creation (e.g., after a fire burns out)
local burnt = SpawnPrefab("burntground")
burnt.Transform:SetPosition(x, y, z)

-- Client-side instantiation with pre-existing fade state (e.g., during world load)
local faded_burnt = SpawnPrefab("burntground_faded")
faded_burnt.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network`  
**Tags:** Adds `NOCLICK` and `FX`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_fade` | net_smallbyte (synced) | `0` | Network variable tracking fade progress; values `0` to `64` map to full opacity to invisible. |

## Main functions
### `makeburntground(name, initial_fade)`
*   **Description:** Factory function returning a prefab definition for burnt ground entities. Can be used to create either a fresh burnt patch (`initial_fade = 0`) or one pre-faded (`initial_fade > 0`, e.g., `20`).
*   **Parameters:**  
    `name` (string) — name of the prefab (e.g., `"burntground"`).  
    `initial_fade` (number, optional) — starting fade value between `0` and `63`; defaults to `0`.
*   **Returns:** Prefab — a callable function that instantiates the entity with appropriate setup.

### `OnFadeDirty(inst)`
*   **Description:** Updates the alpha multiplier based on current `_fade` value to control visual opacity.
*   **Parameters:** `inst` (Entity) — the burntground entity instance.
*   **Returns:** Nothing.

### `UpdateFade(inst)`
*   **Description:** Decrements the `_fade` counter on each tick (if below `63`) and triggers the next fade step. When fade completes (`_fade >= 63`), removes the entity on the master sim; on clients, sets alpha to `0` without removal.
*   **Parameters:** `inst` (Entity) — the burntground entity instance.
*   **Returns:** Nothing.
*   **Error states:** No client-side removal — the entity remains (as invisible) but no further updates occur after fading completes.

### `OnSave(inst, data)`
*   **Description:** Saves fade and transform state (rotation, scale) to be persisted in world saves.
*   **Parameters:**  
    `inst` (Entity) — the burntground entity instance.  
    `data` (table) — save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores fade level, rotation, and scale from saved data during world load.
*   **Parameters:**  
    `inst` (Entity) — the burntground entity instance.  
    `data` (table) — loaded save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `fadedirty` — triggers visual alpha update via `OnFadeDirty`.
- **Pushes:** None.

## Static Prefabs Returned
- `"burntground"` — fresh burnt patch, starts fully visible.
- `"burntground_faded"` — pre-faded burnt patch, starts at fade level `20`.