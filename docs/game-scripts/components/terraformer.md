---
id: terraformer
title: Terraformer
description: Provides functionality to modify terrain tiles at a given world position, supporting both standard terraforming and plowing operations.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: d4a29dc0
---

# Terraformer

## Overview
The `Terraformer` component enables an entity to alter the underlying ground tile (turf) at a specific world position. It supports two modes: standard terraforming (e.g., turning grass into dirt) and plowing (a restricted subset with additional validation). It optionally triggers custom logic via a callback function and handles downstream effects like soil collapse for adjacent entities.

## Dependencies & Tags
- **Component Usage:** Relies on `TheWorld.Map` (from `TheWorld`) for tile coordinate mapping and tile state manipulation.
- **Additional Dependencies:** Uses `TheWorld.components.undertile` if no explicit `turf` is set.
- **Tags:** Does not add or remove any tags on itself or target entities.
- **External Modules:** Requires `worldtiledefs` (aliased as `GroundTiles`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `turf` | `WORLD_TILES.*` | `nil` | The target tile type to apply during terraforming. If `nil`, defaults to the underlying tile from `undertile` component or `WORLD_TILES.DIRT`. |
| `onterraformfn` | `function?` | `nil` | Optional callback invoked after tile replacement. Signature: `(inst, pt, original_tile_type, original_tile_def)`. If absent, defaults to `HandleDugGround`. |
| `plow` | `boolean` | `nil` | When truthy, enables plow mode (uses `CanPlowAtPoint` validation); otherwise uses `CanTerraformAtPoint`. |

> **Note:** The constructor initializes `self.inst`, but `turf`, `onterraformfn`, and `plow` are commented out and thus must be set externally before use (typically via direct assignment on the component instance).

## Main Functions
### `Terraformer:Terraform(pt, doer)`
* **Description:** Converts the tile at world point `pt` to the configured `turf`, executes post-terraform logic (custom or default), and triggers collapse events for adjacent "soil"-tagged entities (unless plowing). Returns `true` on success, `false` if terrain modification is invalid at the location.
* **Parameters:**
  - `pt`: A point object supporting `:Get()` → `(x, y, z)`.
  - `doer`: Optional entity that initiated the action (e.g., a player); used to propagate the `"onterraform"` event to them (e.g., for player-specific gameplay effects like Wolfgang’s strength bonus).

## Events & Listeners
- **Listens For:**
  - None.
- **Triggers:**
  - `"onterraform"` on `self.inst` (the owner of this component).
  - `"onterraform"` on `doer`, if `doer` is non-nil.
  - `"collapsesoil"` on each entity on the same tile that has the `"soil"` tag (only when *not* plowing).