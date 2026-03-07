---
id: placer
title: Placer
description: Manages placement positioning, orientation, and visual feedback for deployable structures and items in the game world, including support for axis-aligned placement and boat edge snapping.
tags: [placement, positioning, visual, boat]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 33389a01
system_scope: world
---
# Placer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Placer` is a world-positioning component that manages the transient visual representation of an item or structure during player placement. It handles updating the placer entity's position and rotation in real time based on player input (mouse or controller), snap modes (tile, grid, boat edge), axis-aligned placement, and camera orientation. It also provides visual feedback (e.g., color changes and helper visualizations) indicating whether placement is allowed at the current location. It is typically used on placeholder or ghost prefabs during interaction and is tightly coupled with `deployhelper` for placement feedback.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("placer")

-- Configure placement behavior
inst.components.placer:SetBuilder(ThePlayer, recipe, item)
inst.components.placer.snap_to_tile = true
inst.components.placer.axisalignedplacement = true
inst.components.placer.oncanbuild = function(placer_inst) print("Can build!") end

-- Update loop (typically called from TheWorld Update)
inst:ListenForEvent("updaterate", function() inst.components.placer:OnUpdate(dt) end, TheWorld)
```

## Dependencies & tags
**Components used:** `deployhelper` (via `TriggerDeployHelpers` in `OnUpdate`)
**Tags:** Adds `boat` via `self.BOAT_MUST_TAGS` internally for boat-edge snapping logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `can_build` | boolean | `false` | Current result of `TestCanBuild()` indicating if the placement position is valid. |
| `mouse_blocked` | boolean or `nil` | `nil` | Whether the placement target is obstructed by player input blocking (e.g., UI overlay). |
| `testfn` | function or `nil` | `nil` | Custom test function used by `TestCanBuild`, taking position and rotation as arguments. |
| `radius` | number | `1` | Radius constraint used in some placement tests (modern usage unclear). |
| `selected_pos` | Vector3 or `nil` | `nil` | Cached world position for later deployment if no real-time mouse input is used. |
| `onupdatetransform` | function or `nil` | `nil` | Callback invoked each frame during position updates. |
| `oncanbuild` | function or `nil` | `nil` | Callback invoked when `can_build` is `true`. |
| `oncannotbuild` | function or `nil` | `nil` | Callback invoked when `can_build` is `false`. |
| `onfailedplacement` | function or `nil` | `nil` | Callback invoked on placement failure (currently unused). |
| `axisalignedplacement` | boolean | `false` | If axis-aligned placement mode is active. |
| `axisalignedplacementtoggle` | boolean | `false` | Temporary toggle state during input checks. |
| `axisalignedhelpers` | table or `nil` | `nil` | Helper table for axis-aligned placement visuals (grid of floor decals). |
| `linked` | table | `{}` | List of entities visually linked to this placer (same positioning/color updates). |
| `offset` | number | `1` | Default offset from player in controller mode. |
| `hide_inv_icon` | boolean | `true` | Whether the inventory icon should be hidden during placement. |
| `override_build_point_fn` | function or `nil` | `nil` | Overrides build-point computation (rarely used). |
| `override_testfn` | function or `nil` | `nil` | Overrides `testfn` in `TestCanBuild()`. |
| `BOAT_MUST_TAGS` | table | `{"boat"}` | Tags required to identify valid platforms for boat-edge snapping. |

## Main functions
### `OnRemoveEntity()`
*   **Description:** Cleans up resources when the placer entity is removed, including hiding the inventory icon and removing axis-aligned helper visuals.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Safely handles invalid entity references (e.g., if helpers were not created or removed).

### `SetBuilder(builder, recipe, invobject)`
*   **Description:** Assigns the player/controller (builder), recipe, and inventory object to the placer. Initializes axis-aligned helpers if needed and starts wall updates for smooth visual updates.
*   **Parameters:** 
    - `builder` (Entity or `nil`) — The player or entity performing the placement.
    - `recipe` (Recipe or `nil`) — The recipe associated with the item/structure.
    - `invobject` (InventoryItem or `nil`) — The inventory item being placed.
*   **Returns:** Nothing.

### `TestCanBuild()`
*   **Description:** Evaluates whether placement is allowed at the current position of `self.inst`. Uses `override_testfn`, `testfn`, or defaults to allowing placement.
*   **Parameters:** None.
*   **Returns:** 
    - `can_build` (boolean) — Whether the placement is allowed.
    - `mouse_blocked` (boolean) — Whether input is blocked by UI or interaction.

### `ToggleHideInvIcon(hide)`
*   **Description:** Controls whether the inventory icon associated with placement should be hidden or shown.
*   **Parameters:** 
    - `hide` (boolean) — If `true`, hides the icon; otherwise, shows it.
*   **Returns:** Nothing.

### `IsAxisAlignedPlacement()`
*   **Description:** Returns whether axis-aligned placement is currently active based on the item's permission and user profile.
*   **Parameters:** None.
*   **Returns:** (boolean) `true` if axis-aligned placement is enabled, `false` otherwise.

### `GetAxisAlignedPlacementTransform(x, y, z, ignorescale)`
*   **Description:** Snap a world position to the axis-aligned placement grid, applying integer snapping based on intervals and world offset.
*   **Parameters:** 
    - `x`, `y`, `z` (numbers) — World coordinates to snap.
    - `ignorescale` (boolean, optional) — If `true`, skips scaling back from grid space.
*   **Returns:** (number, number, number) — Snapped world coordinates.

### `UpdateAxisAlignedHelpers(dt)`
*   **Description:** Updates visual helpers (grid of floor decals) used during axis-aligned placement, including visibility fading, position updates, and collision testing per decal.
*   **Parameters:** 
    - `dt` (number) — Delta time since last frame.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Main update loop that recalculates placement position/rotation based on input mode (mouse/controller), snap modes, axis-aligned placement, and boat edge alignment. Handles visual feedback (color, visibility, linked entities) and triggers `deployhelper` for debug visuals.
*   **Parameters:** 
    - `dt` (number) — Delta time.
*   **Returns:** Nothing.

### `GetDeployAction()`
*   **Description:** Constructs and returns a `BufferedAction` representing a deployment of the held item or structure.
*   **Parameters:** None.
*   **Returns:** (BufferedAction) — Action ready to be executed by the builder.

### `LinkEntity(ent, lightoverride)`
*   **Description:** Adds an entity to the `linked` list so it shares placement updates and visual coloring. Optionally sets a light override on the linked entity.
*   **Parameters:** 
    - `ent` (Entity) — Entity to link.
    - `lightoverride` (number or `nil`) — Light intensity override value (>0), default `1`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `refreshaxisalignedplacementintervals` — Triggered on `ThePlayer`, causes `InitializeAxisAlignedHelpers()` to be called again (e.g., on mod changes).
- **Pushes:** `onplacerhidden`, `onplacershown` — Sent to the builder when mouse blocking state changes and `hide_inv_icon` is active.
