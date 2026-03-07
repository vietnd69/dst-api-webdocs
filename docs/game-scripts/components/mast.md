---
id: mast
title: Mast
description: Manages sail state and forces for a boat mast, including furling/unfurling mechanics, physics interaction with the boat, and animation synchronization.
tags: [boat, physics, animation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: ece6fe9e
system_scope: physics
---

# Mast

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Mast` is a component that manages the sail mechanics of a boat, including raising/lowering (furling/unfurling), sail force application, and velocity control. It integrates with the `boatphysics` component via `AddMast` and `RemoveMast`, and dynamically manages tags and animations to reflect sail state. It supports both player-driven furling and automatic unfurling, and tracks participants (furlers) performing the action.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("mast")
inst.components.mast:SetSailForce(TUNING.BOAT.MAST.BASIC.SAIL_FORCE)
inst.components.mast:UnfurlSail() -- Start lowering the sail
```

## Dependencies & tags
**Components used:** `boatphysics` (via `self.boat.components.boatphysics:AddMast` / `RemoveMast`), `soundemitter`, `animstate`, `transform`, `highlightchildren` (optional).  
**Tags:** Adds/removes `sailraised`, `saillowered`, `sail_transitioning`, and removes `rotatableobject` when attached to a boat.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `is_sail_raised` | boolean | `false` | Whether the sail is currently raised (unfurled). |
| `inverted` | boolean | `false` | If true, sail logic is inverted (lower values mean more force). |
| `sail_force` | number | `TUNING.BOAT.MAST.BASIC.SAIL_FORCE` | Base sail force applied to the boat. |
| `max_velocity` | number | `TUNING.BOAT.MAST.BASIC.MAX_VELOCITY` | Maximum velocity cap applied to the boat. |
| `furlunits_max` | number | `4.5` | Max furl units required to fully raise the sail manually. |
| `furlunits` | number | `furlunits_max` | Current furl unit accumulation (0 = unfurled, `furlunits_max` = furled). |
| `autounfurlunits` | number | `8` | Rate at which the sail automatically unfurls per second when no furlers are active. |
| `furlers` | table | `{}` | Map of furler entities to their pulling strength. |
| `boat` | entity or `nil` | `nil` | Reference to the current boat entity. |
| `rudder` | entity | Created via `SpawnPrefab("rudder")` | The rudder entity associated with this mast. |

## Main functions
### `SetSailForce(force)`
*   **Description:** Sets the sail force value used in `CalcSailForce`.
*   **Parameters:** `force` (number) - the new sail force value.
*   **Returns:** Nothing.

### `CalcSailForce()`
*   **Description:** Computes the effective sail force based on current furl state and `inverted` flag.
*   **Parameters:** None.
*   **Returns:** (number) Current sail force. Returns `0` when the sail is neither raised nor transitioning in the expected way.

### `CalcMaxVelocity()`
*   **Description:** Computes the effective max velocity cap based on current furl state and `inverted` flag.
*   **Parameters:** None.
*   **Returns:** (number) Current max velocity. Returns `0` when the sail is neither raised nor transitioning in the expected way.

### `SetBoat(boat)`
*   **Description:** Attaches or detaches the mast from a boat entity. Updates `boatphysics` registration, event listeners, rotation, and tags.
*   **Parameters:** `boat` (entity or `nil`) - the boat to attach to, or `nil` to detach.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `boat` is unchanged.

### `SetRudder(obj)`
*   **Description:** Assigns and parents a rudder entity to this mast. Adds the rudder to `highlightchildren` for UI highlighting.
*   **Parameters:** `obj` (entity) - the rudder prefab instance.
*   **Returns:** Nothing.

### `UnfurlSail()`
*   **Description:** Starts the process of lowering the sail (transitioning to "unfurled" state). Initiates animation, sound, and sets `is_sail_transitioning = true`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SailFurled()`
*   **Description:** Called when the sail finishes being furled (raised). Resets furl units, stops transition, updates animation, plays sound, and clears all furlers.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SailUnfurled()`
*   **Description:** Called when the sail finishes being unfurled (lowered). Resets furl units, sets `is_sail_raised = true`, and updates animation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CloseSail()`
*   **Description:** Instantly closes the sail to the "inactive" state (furled if `inverted`, unfurled if not).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `AddSailFurler(doer, strength)`
*   **Description:** Registers a player or entity pulling the sail to raise it. Starts transition and plays sound.
*   **Parameters:** `doer` (entity) - the entity performing the pull; `strength` (number) - pull strength per frame.
*   **Returns:** Nothing.

### `RemoveSailFurler(doer)`
*   **Description:** Unregisters a furler entity and sends a `"stopfurling"` event to the doer.
*   **Parameters:** `doer` (entity) - the entity to remove.
*   **Returns:** Nothing.

### `GetCurrentFurlUnits()`
*   **Description:** Calculates the sum of active furler strengths — those currently performing valid pull animations.
*   **Parameters:** None.
*   **Returns:** (number) Total current furl units per frame.

### `GetFurled0to1()`
*   **Description:** Returns normalized furl state: `0` = fully unfurled, `1` = fully furled.
*   **Parameters:** None.
*   **Returns:** (number) Float in range `[0, 1]`.

### `SetRudderDirection(x, z)`
*   **Description:** Rotates the mast to face the rudder's target direction in world space (Y is ignored).
*   **Parameters:** `rudder_direction_x` (number) - X offset from mast to target; `rudder_direction_z` (number) - Z offset.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Updates the sail furl state each frame during transitions: accumulates `furlunits` from furlers or auto-unfurls, triggers state completion callbacks, and updates animation percentage.
*   **Parameters:** `dt` (number) - delta time in seconds.
*   **Returns:** Nothing.

### `OnRemoveEntity()`
*   **Description:** Handles mast removal (e.g., sinking or destruction). Spawns an appropriate FX (`sink_fx` or `"collapse_small"`), and detaches from boat.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnDeath()`
*   **Description:** Handles mast death event (e.g., boat sinking). Sets `boat_death = true`, kills movement sound, and detaches from boat.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `"onremove"` on the boat entity (sets `self.boat = nil` via `OnBoatRemoved`); `"death"` on the boat entity (triggers `OnDeath`); `"onupdate"` (via component update when `is_sail_transitioning` is true).
- **Pushes:** `"stopfurling"` to furler entities when they are removed via `RemoveSailFurler`.

`<`!-- End of documentation -->
