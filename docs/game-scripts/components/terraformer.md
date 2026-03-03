---
id: terraformer
title: Terraformer
description: Modifies terrain tiles at a given point in the world, handling soil replacement, entity collapse events, and custom callbacks.
tags: [world, terrain, map]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: d4a29dc0
system_scope: world
---

# Terraformer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Terraformer` component enables terrain modification (terraforming) at a specific world point. It sets a new tile type at a given location, handles soil collapse events for nearby entities, and optionally executes a custom callback or default ground-handling logic. This component is typically attached to entities like shovels or construction tools that interact with the world surface.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("terraformer")
inst.components.terraformer.turf = WORLD_TILES.DIRT
inst.components.terraformer.plow = false
inst.components.terraformer.onterraformfn = function(inst, pt, old_tile, old_tile_data)
    print("Terrain changed from " .. old_tile)
end
inst.components.terraformer:Terraform(Vector3(10, 0, -10), some_doer_entity)
```

## Dependencies & tags
**Components used:** `undertile` (via `TheWorld.components.undertile:GetTileUnderneath`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `turf` | `WORLD_TILES` constant or `nil` | `nil` | The tile type to set at the target point. Falls back to `GetTileUnderneath` or `WORLD_TILES.DIRT` if `nil`. |
| `onterraformfn` | function or `nil` | `nil` | Optional callback invoked on terraform with `(self.inst, pt, original_tile_type, original_tile_data)`. If absent, defaults to `HandleDugGround`. |
| `plow` | boolean or `nil` | `nil` | If `true`, uses plowing validation (`CanPlowAtPoint`) instead of standard terraforming (`CanTerraformAtPoint`). |

## Main functions
### `Terraform(pt, doer)`
* **Description:** Applies terrain modification at the specified world point. Validates the tile location, sets a new tile, triggers soil collapse for nearby entities (if not plowing), and fires events.
* **Parameters:**
  * `pt` (`Vector3` or point-like object with `:Get()` returning x, y, z) — World coordinate of the terraform target.
  * `doer` (`Entity` or `nil`) — The entity performing the terraforming; used to push `"onterraform"` event (e.g., for Wolfgang’s effects).
* **Returns:** `true` on success, `false` if the point is invalid or blocked.
* **Error states:** Returns `false` early if `CanPlowAtPoint` (when `plow` is true) or `CanTerraformAtPoint` (otherwise) returns `false`. Does not modify tiles if validation fails.

## Events & listeners
- **Pushes:** `"onterraform"` — fired by the entity owning this component and optionally by the `doer` entity.
- **Listens to:** None identified.
