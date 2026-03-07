---
id: grotto_pool_small
title: Grotto Pool Small
description: Creates a small, non-networked decorative pool entity with visual effects, light emission, and interaction with the grotto waterfall system.
tags: [visual, environment, fx, water]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8c3e8fb1
system_scope: environment
---

# Grotto Pool Small

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`grotto_pool_small` is a prefab definition for a static environmental object representing a small grotto water pool. It renders an animated tile, emits a dim blue-tinged light, and optionally spawns a small waterfall component (selected randomly between two variants) as a child entity. The pool registers itself with the world’s grotto pool registry and integrates with the game’s save/load system to preserve its waterfall child across sessions. It is non-persistent (pristine) on the server and creates client-only FX (steam particles) during initialization on non-dedicated clients.

## Usage example
```lua
-- Instantiates the grotto_pool_small prefab at the current world position
local pool = SpawnPrefab("grotto_pool_small")
pool.Transform:SetPosition(world_x, world_y, world_z)
```

## Dependencies & tags
**Components used:** `watersource` (added via `inst:AddComponent` on master), `inspectable` (added on master only), `MiniMapEntity`, `Light`, `AnimState`, `Transform`, `Network`  
**Tags:** Adds `FX`, `NOCLICK`, `antlion_sinkhole_blocker`, `birdblocker`, `watersource`; sets `no_wet_prefix = true`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_waterfall` | entity or `nil` | `nil` | Reference to the spawned waterfall child entity; set during `setup_children`. |

## Main functions
### `setup_children(inst)`
*   **Description:** Ensures a waterfall child entity exists (`grotto_waterfall_small1` or `grotto_waterfall_small2`) and positions it identically to the pool. Attaches an event listener to clear the reference when the waterfall is removed.
*   **Parameters:** `inst` (entity) — the pool instance.
*   **Returns:** Nothing.

### `register_pool(inst)`
*   **Description:** Sends a `ms_registergrottopool` event to the world with the pool instance and a `small = true` flag. Used by the sound system to manage grotto pool audio groups.
*   **Parameters:** `inst` (entity) — the pool instance.
*   **Returns:** Nothing.

### `makesmallmist(proxy)`
*   **Description:** Creates a client-only FX entity (steam particles) positioned at and parented to the provided proxy. It plays a randomized steam animation, sets a light override, and removes itself when the proxy entity is destroyed.
*   **Parameters:** `proxy` (entity or `nil`) — reference entity used for positioning/parenting.
*   **Returns:** `inst` (entity) — the created FX entity, or `nil` if `proxy` is `nil`.
*   **Error states:** Returns `nil` if `proxy` is `nil`.

### `on_save(inst, data)`
*   **Description:** Saves the GUID of the waterfall child entity (if any) into the save data table. Returns a list containing the saved ID for dependency resolution.
*   **Parameters:** `inst` (entity), `data` (table) — the save data table.
*   **Returns:** `{wf_id}` (table of GUID string) or `nil` if no waterfall exists.

### `on_load_postpass(inst, newents, data)`
*   **Description:** After prefabs are loaded, retrieves the saved waterfall entity using the GUID and reassigns it to `inst._waterfall`.
*   **Parameters:** `inst` (entity), `newents` (table of GUID→entity mappings), `data` (table or `nil`) — loaded save data.
*   **Returns:** Nothing.

### `on_removed(inst)`
*   **Description:** Cleans up by removing the waterfall child entity (if present) when the pool is destroyed.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` (on pool and waterfall children) — triggers cleanup (`on_removed` or clearing `_waterfall`).
- **Pushes:** `ms_registergrottopool` — fires during `register_pool` to register the pool with the world’s grotto pool system.

## Properties (Detailed)
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `no_wet_prefix` | boolean | `true` | Prevents prepending "wet_" to animation states, indicating this pool doesn’t wet the player. |
| `scrapbook_specialinfo` | string | `"GROTTOPOOL"` | Metadata for scrapbook display. |
| `scrapbook_build`, `scrapbook_bank`, `scrapbook_anim` | string | See source | Animation assets used for scrapbook entry. |
| `scrapbook_adddeps` | table | `{"moonglass"}` | Dependencies required to display this entry. |