---
id: autoterraformer
title: Autoterraformer
description: Automatically transforms the terrain tile beneath an entity by repeatedly replacing it with the first item in its container.
tags: [terrain, world, automation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 023a45b3
system_scope: world
---

# Autoterraformer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AutoTerraformer` enables an entity to automatically terraform (reshape) the terrain in real time as it moves. It is typically attached to devices like the AutoTerraformer block, which transforms tiles beneath them by consuming items (e.g., dirt, cobblestone) from its own `container`. The component repeatedly checks the entity's current tile, compares it to the tile type of the first item in the container, and applies changes as needed—such as replacing grass with dirt or filling holes.

It interacts with the `container`, `finiteuses`, `inventory`, `inventoryitem`, and `undertile` components during operation. Events like `"onterraform"` are pushed upon completion of each tile change.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("container")
inst:AddComponent("autoterraformer")
inst:AddComponent("finiteuses")
inst.components.container:SetHoldable(true)
-- Populate slot 1 with a tile item (e.g., "dirt")
inst.components.autoterraformer:StartTerraforming()
-- Terraforming proceeds as long as the entity moves and has valid items.
```

## Dependencies & tags
**Components used:** `container`, `finiteuses`, `undertile`, `inventory`, `inventoryitem`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component belongs to. |
| `repeat_tile_delay` | number | `TUNING.AUTOTERRAFORMER_REPEAT_DELAY` | Delay (in seconds) between repeated terraforming on the same tile. |
| `container` | `Container` | — | Reference to the entity’s `container` component. |
| `last_x`, `last_y` | number or `nil` | `nil` | Last known tile coordinates; used to detect position changes. |
| `repeat_delay` | number or `nil` | `nil` | Countdown timer before re-processing the same tile. |

## Main functions
### `FinishTerraforming(x, y, z)`
* **Description:** Called after successfully terraforming a tile. Fires the `"onterraform"` event, uses up one finite charge if present, and invokes a custom callback (`onfinishterraformingfn`) if defined.
* **Parameters:**  
  `x`, `y`, `z` (numbers) — world coordinates where the terraforming occurred.
* **Returns:** Nothing.
* **Error states:** None.

### `DoTerraform(px, py, pz, x, y)`
* **Description:** Performs a single terraforming operation at the given tile coordinates. Replaces the current tile if possible, respecting `map` placement rules and undertile layers. Removes the used item from the container.
* **Parameters:**  
  `px`, `py`, `pz` (numbers) — world position coordinates.  
  `x`, `y` (numbers) — tile map coordinates to modify.
* **Returns:** `true` if an undertile layer was revealed (`underneath_tile` was present); `false` or `nil` otherwise.
* **Error states:** Returns early with no change if the item tile matches the current tile, or if placement is invalid per `map:CanPlaceTurfAtPoint` / `map:CanTerraformAtPoint`.

### `StartTerraforming()`
* **Description:** Initializes repeat-tile logic and begins updating the component every frame via `OnUpdate`.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopTerraforming()`
* **Description:** Halts periodic updates and resets tracking coordinates.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Called every frame after `StartTerraforming`. Checks if the entity has moved to a new tile or needs re-processing on the current tile. Triggers `DoTerraform` as needed.
* **Parameters:**  
  `dt` (number) — delta time in seconds.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** `"onterraform"` — fired at the end of each successful terraforming operation (via `FinishTerraforming`). No data is passed with this event.
