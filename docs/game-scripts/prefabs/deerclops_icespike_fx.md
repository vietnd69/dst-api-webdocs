---
id: deerclops_icespike_fx
title: Deerclops Icespike Fx
description: Manages a reusable visual effect entity for Deerclops' ice spike projectiles.
tags: [fx, boss, reusable, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c3838b50
system_scope: fx
---

# Deerclops Icespike Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`deerclops_icespike_fx` is a reusable visual effect prefab used to represent ice spikes launched by Deerclops. It handles animation playback, sound emission, and scene lifecycle: after its animation completes, the entity is either returned to an owner's pool for reuse or destroyed if no pool exists. It is lightweight, non-interactive, and does not persist across sessions.

## Usage example
```lua
-- Obtain an instance from Deerclops' ice spike pool
local fx = table.remove(deerclops.icespike_pool)
fx:SetFXOwner(deerclops)
fx.RestartFX(fx, false, 2) -- small spike, variation 2
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity or `nil` | `nil` | Reference to the Deerclops entity that owns this FX instance for pooling purposes. |

## Main functions
### `SetFXOwner(owner)`
*   **Description:** Assigns the owner entity (typically the Deerclops instance) for later pooling upon FX expiry.
*   **Parameters:** `owner` (entity) – the entity that spawned this FX and maintains the `icespike_pool` array.
*   **Returns:** Nothing.

### `RestartFX(big, variation)`
*   **Description:** Restores the FX to the scene and plays a new animation based on size and variation.
*   **Parameters:**  
    - `big` (boolean) – if `true`, plays `"spike_big"` animation; otherwise `"spike"`.  
    - `variation` (number or `nil`) – integer suffix for the animation (e.g., `2` → `"spike2"`). If `nil`, a random value from `1`–`4` is used.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` – triggers cleanup logic via `OnAnimOver`, either returning the entity to its owner's pool or removing it entirely.
- **Pushes:** None identified