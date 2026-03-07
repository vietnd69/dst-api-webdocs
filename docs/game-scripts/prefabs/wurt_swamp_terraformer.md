---
id: wurt_swamp_terraformer
title: Wurt Swamp Terraformer
description: Applies temporary swamp terrain changes to the world and automatically reverts them after a set duration.
tags: [world, terraform, duration, fx, wurt]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 07984694
system_scope: world
---

# Wurt Swamp Terraformer

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wurt_swamp_terraformer` is a prefab component responsible for transforming a configurable area of the world into a temporary swamp tile type (e.g., `SHADOW_MARSH` or `LUNAR_MARSH`) and scheduling automatic reversion. It manages tile-level modifications via the `undertile` component, spawns visual and audio feedback, and ensures state persistence across saves through custom `OnSave`/`OnLoad` handlers. It is typically instantiated as a one-shot actor triggered during gameplay (e.g., by Wurt's swamp item ability).

## Usage example
```lua
local terraformer = SpawnPrefab("wurt_swamp_terraformer")
terraformer.Transform:SetPosition(x, y, z)
terraformer:SetType("LUNAR")
terraformer:DoTerraform()
```

## Dependencies & tags
**Components used:** `timer`, `undertile` (via `TheWorld.components.undertile`)
**Tags:** `ignorewalkableplatforms`, `NOBLOCK`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `type` | string | `"SHADOW"` | Terraformer type key; must match a key in `fx_functions`. |
| `tile` | string | `WORLD_TILES.SHADOW_MARSH` | The swamp tile to apply. |
| `_terraformed_tiles` | table of `{x, y}` | `{}` | List of tile coordinates transformed by this instance. |
| `_terraforms_to_do` | number | `0` | Count of pending tile-transform tasks (used during revert scheduling). |
| `_terraforms_to_undo` | number | `0` | Count of tiles scheduled for reversion. |

## Main functions
### `SetType(terraform_type)`
* **Description:** Sets the terraformer’s type (affects visual effects) and the corresponding swamp tile type. Starts the FX timer if not already running.
* **Parameters:** `terraform_type` (string, optional) — e.g., `"SHADOW"` or `"LUNAR"`. Defaults to `"SHADOW"` if omitted.
* **Returns:** Nothing.
* **Error states:** No-op if a `"do_terraforming_fx"` timer already exists.

### `DoTerraform(pattern_fn, is_load)`
* **Description:** Applies the terraformation effect to a radial area around the instance. Tiles are modified with a small randomized delay to create a sequential visual effect. Only land tiles that are not ocean, impassable, or temporary are transformed.
* **Parameters:**
  * `pattern_fn` (function, optional) — custom tile-pattern generator taking `inst` and returning `(x_pattern, y_pattern)`. Defaults to `default_terraform_pattern_fn`.
  * `is_load` (boolean) — if `true`, skips sound playback and does not record tiles to `_terraformed_tiles` (used during world load).
* **Returns:** Nothing.
* **Error states:** Tiles blocked by objects or in `TILE_BLOCKER` groups are silently skipped.

### `UndoTerraform(is_load)`
* **Description:** Reverts all tiles recorded in `_terraformed_tiles` to their original types, as stored in the `undertile` component. Spawns revert FX and schedules the instance’s self-removal after a delay.
* **Parameters:** `is_load` (boolean) — if `true`, skips sound playback and timer adjustment; used during world load.
* **Returns:** Nothing.
* **Error states:** Tiles that no longer match the terraformer’s current `inst.tile` are silently skipped.

### `TerraformTileCallback(tile_x, tile_y, current_tile)`
* **Description:** Internal callback executed per tile after delay. Updates tile type and records original tile under `undertile`. Spawns swamp cover FX.
* **Parameters:**
  * `tile_x`, `tile_y` (number) — tile coordinates.
  * `current_tile` (string) — tile ID before terraforming.
* **Returns:** Nothing.

### `DeTerraformTileCallback(tile_x, tile_y)`
* **Description:** Internal callback executed per tile during revert. Restores original tile and cleans up `undertile` entry. Spawns revert FX.
* **Parameters:**
  * `tile_x`, `tile_y` (number) — tile coordinates.
* **Returns:** Nothing.

### `play_terraform_splash_sound(inst)`
* **Description:** Plays the terraforming splash sound at the terraformer’s position.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` — handles rescheduling FX, starting undo, or removing the instance depending on the timer name (`do_terraforming_fx`, `undo_terraforming`, `remove`).
- **Pushes:** None.