---
id: quagmire_coins
title: Quagmire Coins
description: Defines prefabs for quagmire coin items and their associated FX entities used in the Quagmire event.
tags: [event, quagmire, fx, item]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8809712d
system_scope: entity
---

# Quagmire Coins

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
This file defines prefabs for the four distinct quagmire coin variants (`quagmire_coin1` through `quagmire_coin4`) and a supporting FX prefab (`quagmire_coin_fx`). Each coin is an entity with inventory physics, a banked animation state, and network synchronization. A special FX prefab plays a looping animation during interactions (e.g., when coins are picked up or used). The prefabs are constructed using `MakeCoin` helper function and rely on the game's `event_server_data` system for server-side initialization.

## Usage example
```lua
-- Spawn a quagmire coin of type 3 (with FX support)
local coin3 = SpawnPrefabs("quagmire_coin3")

-- Spawn the FX entity for coin-related visual effects
local fx = SpawnPrefabs("quagmire_coin_fx")
```

## Dependencies & tags
**Components used:** None identified  
**Components added internally (via `inst.entity:AddX()`):** `Transform`, `AnimState`, `SoundEmitter`, `Network`  
**Tags:** Adds `quagmire_coin` to coin entities; adds `FX` and `NOCLICK` to FX entity.

## Properties
No public properties.

## Main functions
### `MakeCoin(id, hasfx)`
*   **Description:** Factory function that creates and returns a `Prefab` for a specific quagmire coin variant (1–4). Configures the entity’s appearance, tags, physics, and network behavior. When `hasfx` is true, includes the FX prefab as a dependency.
*   **Parameters:**  
    - `id` (number) – Coin variant identifier (1 to 4), determines which symbol variant is used.  
    - `hasfx` (boolean) – Whether this coin type triggers FX. If true, `quagmire_coin_fx` is included in prefabs.
*   **Returns:** A `Prefab` object.
*   **Error states:** Returns `nil` for invalid `id` values outside 1–4 (implementation not shown but implied by context).

### `fxfn()`
*   **Description:** Constructor function for the `quagmire_coin_fx` prefab. Sets up a non-interactive FX entity that plays a looping animation (`opal_loop`) and is marked as FX and non-clickable.
*   **Parameters:** None.
*   **Returns:** A `Prefab` object (returned via `Prefab(..., fxfn, assets)`).

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  

> **Note:** Server-side initialization is delegated to external `event_server_data` callbacks (`master_postinit` and `master_postinit_fx`) that are called only on the master sim. These are not defined in this file and are assumed to be part of the Quagmire event’s shared Lua context.