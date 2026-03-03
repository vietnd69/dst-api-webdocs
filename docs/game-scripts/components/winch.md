---
id: winch
title: Winch
description: Manages rope line extension and retraction for anchor-based mechanics, updating depth-based state and triggering callbacks during operation.
tags: [mechanics, anchor, depth, map, update]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9870a4a0
system_scope: world
---

# Winch

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Winch` manages the dynamic extension and retraction of a rope line (e.g., for anchors) based on water depth at the entity's current location. It maintains the current line length, direction (raising or lowering), and speed multipliers, updating asynchronously while active. It supports callback hooks for operation start/complete events and integrates with the world’s tile depth data. The component is typically attached to anchor-related entities (e.g., winch structures).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("winch")
inst.components.winch:SetLoweringSpeedMultiplier(2.0)
inst.components.winch:SetRaisingSpeedMultiplier(1.5)
inst.components.winch:SetOnFullyRaisedFn(function(entity) print("Winch fully raised") end)
inst.components.winch:StartLowering()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds or removes `winch_ready` tag based on readiness state (`winch_ready = true` when line is fully retracted and ready for use).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `winch_ready` | boolean | `true` | Whether the winch is ready for operation (i.e., fully retracted). Controls the `winch_ready` tag. |
| `line_length` | number | `0` | Current length of line extended (in game units or depth units). |
| `is_raising` | boolean | `false` | Direction of movement: `true` if currently retracting line. |
| `is_static` | boolean | `true` | Whether the winch is idle (`true`) or actively changing depth (`false`). |
| `raising_speed` | number | `1` | Speed multiplier for line retraction per second. |
| `lowering_speed` | number | `0.5` | Speed multiplier for line extension per second. |

## Main functions
### `SetLoweringSpeedMultiplier(mult)`
*   **Description:** Sets the speed multiplier for lowering (extending) the line. Overrides the default `0.5`.
*   **Parameters:** `mult` (number) - new lowering speed factor.
*   **Returns:** Nothing.

### `SetRaisingSpeedMultiplier(mult)`
*   **Description:** Sets the speed multiplier for raising (retracting) the line. Overrides the default `1.0`.
*   **Parameters:** `mult` (number) - new raising speed factor.
*   **Returns:** Nothing.

### `SetOnFullyLoweredFn(fn)`
*   **Description:** Registers a callback function to be invoked when the line finishes extending to full depth.
*   **Parameters:** `fn` (function) - function accepting one argument: the winch entity.
*   **Returns:** Nothing.

### `SetOnFullyRaisedFn(fn)`
*   **Description:** Registers a callback function to be invoked when the line finishes retracting to zero length.
*   **Parameters:** `fn` (function) - function accepting one argument: the winch entity.
*   **Returns:** Nothing.

### `SetOnStartRaisingFn(fn)`
*   **Description:** Registers a callback function to be invoked at the start of a raising operation.
*   **Parameters:** `fn` (function) - function accepting one argument: the winch entity.
*   **Returns:** Nothing.

### `SetOnStartLoweringFn(fn)`
*   **Description:** Registers a callback function to be invoked at the start of a lowering operation.
*   **Parameters:** `fn` (function) - function accepting one argument: the winch entity.
*   **Returns:** Nothing.

### `SetOverrideGetCurrentDepthFn(fn)`
*   **Description:** Overrides the default depth calculation (which uses tile ocean depth data) with a custom function.
*   **Parameters:** `fn` (function) - function accepting one argument: the winch entity; must return a number (depth).
*   **Returns:** Nothing.

### `SetUnloadFn(fn)`
*   **Description:** Registers a callback to be invoked when the winch is unloaded or removed. *(Intended for use with serialization or cleanup logic.)*
*   **Parameters:** `fn` (function) - function accepting one argument: the winch entity.
*   **Returns:** Nothing.

### `GetCurrentDepth()`
*   **Description:** Calculates and returns the current water depth at the winch’s position.
*   **Parameters:** None.
*   **Returns:** number — depth value (units), or `0` if unable to determine depth or custom function not set.
*   **Error states:** Returns `0` if tile data is missing, ocean depth category is unrecognized, or custom override function returns `nil`.

### `StartRaising(loading_in)`
*   **Description:** Begins retracting the line (raising it) toward full retraction.
*   **Parameters:** `loading_in` (boolean) — indicates if this operation is part of loading a saved game.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; begins update loop via `StartDepthTesting`.

### `StartLowering(loading_in)`
*   **Description:** Begins extending the line (lowering it) toward full depth.
*   **Parameters:** `loading_in` (boolean) — indicates if this operation is part of loading a saved game.
*   **Returns:** `true` — always returns `true`.
*   **Error states:** No explicit failure conditions.

### `FullyRaised()`
*   **Description:** Finalizes a raising operation by setting line length to `0` and triggering the `onfullyraisedfn` callback and `winch_fully_raised` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `FullyLowered()`
*   **Description:** Finalizes a lowering operation by setting line length to current depth and triggering the `onfullyloweredfn` callback and `winch_fully_lowered` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartDepthTesting(is_raising)`
*   **Description:** Starts the update loop based on depth changes. Marks the winch as non-static and begins periodic `OnUpdate` calls.
*   **Parameters:** `is_raising` (boolean) — `true` if line is retracting, `false` if extending.
*   **Returns:** Nothing.

### `StopDepthTesting()`
*   **Description:** Stops the update loop, marking the winch as static and idle.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called each frame while the winch is active (`is_static = false`). Adjusts line length based on speed and direction; triggers finalization when target depth is reached.
*   **Parameters:** `dt` (number) — delta time in seconds since last frame.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:**  
  - `start_raising_winch` — fired when raising starts (data: `loading_in` boolean).  
  - `start_lowering_winch` — fired when lowering starts (data: `loading_in` boolean).  
  - `winch_fully_raised` — fired when line reaches zero length.  
  - `winch_fully_lowered` — fired when line reaches current depth.  

## Notes
- The `winch_ready` tag is automatically added/removed based on `winch_ready` property (`true` only when line is fully retracted).
- Save/load serialization is implemented (`OnSave`, `OnLoad`) and includes all major state properties.
- Depth calculation defaults to using `TUNING.ANCHOR_DEPTH_TIMES[depthcategory]` based on tile information. This can be overridden via `SetOverrideGetCurrentDepthFn`.
