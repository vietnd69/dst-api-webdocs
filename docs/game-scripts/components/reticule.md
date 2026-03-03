---
id: reticule
title: Reticule
description: Manages the visual targeting reticule for controller-based items, handling position updates, validity checks, and twin-stick aiming modes.
tags: [controller, targeting, ui, input]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e476c341
system_scope: input
---
# Reticule

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Reticule` manages the creation, positioning, and visual feedback of a targeting reticule for items used with a game controller. It dynamically updates reticule position based on controller inputs (including analog stick movement for twin-stick aiming), validates target locations against world constraints using the `aoetargeting` component, and toggles between valid/invalid coloration and bloom effects. The reticule entity itself is spawned and destroyed in response to `equip`/`unequip` events in `playercontroller.lua`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("reticule")
inst.components.reticule.reticuleprefab = "custom_reticule"
inst.components.reticule.validcolour = { 1, 1, 1, 1 }
inst.components.reticule.invalidcolour = { 0.5, 0.5, 0.5, 1 }
inst.components.reticule.targetfn = function(inst) return inst.Transform:GetWorldPosition() end
inst.components.reticule:CreateReticule()
```

## Dependencies & tags
**Components used:** `aoetargeting` (accessed for `alwaysvalid`, `allowwater`, and `deployradius` properties during position validation).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ease` | boolean | `false` | Enables linear interpolation (smoothing) of reticule position updates. |
| `smoothing` | number | `6.66` | Interpolation speed factor used when `ease` is `true`. |
| `reticuleprefab` | string | `"reticule"` | Prefab name used to spawn the reticule entity. |
| `validcolour` | `{ number, number, number, number }` | `{ 204/255, 131/255, 57/255, 1 }` | RGBA color used when the target position is valid. |
| `invalidcolour` | `{ number, number, number, number }` | `{ 1, 0, 0, 1 }` | RGBA color used when the target position is invalid. |
| `mouseenabled` | boolean | `false` | Enables mouse-based reticule positioning when no controller is attached. |
| `fadealpha` | number | `1` | Controls reticule fade opacity during mouse aiming. |
| `blipalpha` | number | `1` | Controls blip effect opacity when `Blip()` is called. |
| `targetpos` | Vector3 or DynamicPosition | `nil` | Internal target position for the reticule (set by `targetfn`, `mousetargetfn`, or twin-stick logic). |
| `targetfn` | function | `nil` | Callback to determine reticule position on update; signature `fn(inst)`. |
| `mousetargetfn` | function | `nil` | Callback to refine mouse-based target position; signature `fn(inst, pos)`. |
| `updatepositionfn` | function | `nil` | Custom position setter; signature `fn(inst, pos, reticule, ease, smoothing, dt)`. |
| `validfn` | function | `nil` | Custom validation callback; signature `fn(inst, reticule, pos, alwayspassable, allowwater, deployradius)`. |
| `twinstickmode` | number or `nil` | `nil` | Twin-stick aiming mode: `1` (offset-based) or `2` (lerp-based). |
| `twinstickrange` | number | `8` | Maximum distance (in tiles) for twin-stick reticule offset. |
| `pingprefab` | string or `nil` | `nil` | Prefab to spawn when `PingReticuleAt` is called. |
| `ispassableatallpoints` | boolean or `nil` | `nil` | Overrides `aoetargeting.alwaysvalid` if set. |
| `shouldhidefn` | function or `nil` | `nil` | Returns `true` if reticule should be hidden; signature `fn(inst)`. |

## Main functions
### `CreateReticule()`
* **Description:** Spawns the reticule prefab, sets up input handlers (mouse or controller), initializes state, and registers the camera update listener.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early with no effect if `SpawnPrefab(self.reticuleprefab)` fails.

### `DestroyReticule()`
* **Description:** Removes the reticule entity, cleans up input handlers and camera listener, and resets alpha values.
* **Parameters:** None.
* **Returns:** Nothing.

### `PingReticuleAt(pos)`
* **Description:** Spawns a one-time visual "ping" at the specified world position using the configured `pingprefab`. Applies the valid color and optional platform parenting.
* **Parameters:** `pos` (Vector3 or DynamicPosition) - target location for the ping.
* **Returns:** Nothing.
* **Error states:** Returns early if `pingprefab` is `nil`, `pos` is `nil`, or if `pos` is a `DynamicPosition` with no `walkable_platform`.

### `Blip()`
* **Description:** Initiates a blip animation by resetting `blipalpha` to `0` and starting component updates to increment it to `1`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early with no effect if `reticule` is `nil`.

### `OnUpdate(dt)`
* **Description:** Called each frame during a blip to increase `blipalpha` over time until it reaches `1`.
* **Parameters:** `dt` (number) - delta time in seconds.
* **Returns:** Nothing.

### `UpdatePosition(dt)`
* **Description:** Updates the reticule's position based on `targetpos`, validates the position using `aoetargeting` and `validfn`, and applies smoothing if enabled.
* **Parameters:** `dt` (number or `nil`) - delta time for smoothing; `nil` disables interpolation.
* **Returns:** Nothing.

### `OnCameraUpdate(dt)`
* **Description:** Main camera update loop for reticule position logic. Handles mouse follow, twin-stick aiming modes 1/2, or static `targetfn` updates.
* **Parameters:** `dt` (number) - delta time in seconds.
* **Returns:** Nothing.

### `IsTwinStickAiming()`
* **Description:** Reports whether the reticule is currently in twin-stick aiming mode.
* **Parameters:** None.
* **Returns:** `true` if `twinstickmode` is set and no mouse or direct targeting override is active.

### `UpdateTwinStickMode1()`
* **Description:** Implements offset-based twin-stick aiming: captures initial offset on stick activation and increments relative to the screen.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateTwinStickMode2()`
* **Description:** Implements direct steering twin-stick aiming: lerp from auto-target point to stick aim point based on stick magnitude.
* **Parameters:** None.
* **Returns:** Nothing.

### `ClearTwinStickOverrides()`
* **Description:** Resets twin-stick override state (`twinstickoverride`, `twinstickx`, `twinstickz`).
* **Parameters:** None.
* **Returns:** Nothing.

### `ShouldHide()`
* **Description:** Checks if the reticule should be hidden using the optional `shouldhidefn`.
* **Parameters:** None.
* **Returns:** `true` if `shouldhidefn(inst)` returns a truthy value, otherwise `false`.

## Events & listeners
- **Listens to:** Camera update callback (`_oncameraupdate`) attached via `TheCamera:AddListener`.
- **Pushes:** No custom events. Lifecycle is tied to component attach/detach via `OnRemoveFromEntity` and `OnRemoveEntity`, both aliased to `DestroyReticule`.
