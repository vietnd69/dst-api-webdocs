---
id: winch
title: Winch
description: Manages the operational state and movement logic of a winch, including line extension/retraction, speed control, and depth-based animation.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 9870a4a0
---

# Winch

## Overview
This component handles the physics and state management of a winch mechanism in the game—specifically tracking the vertical line length (e.g., anchor line), controlling raising/lowering movement at configurable speeds, updating a "winch_ready" tag based on line state, and notifying other systems via events during transitions.

## Dependencies & Tags
**Tags:**  
- Adds/removes the `"winch_ready"` tag dynamically based on `winch_ready` state (true when line is fully retracted/empty).

**Components:**  
- None explicitly added via `AddComponent`. Depends on the entity having access to `TheWorld.Map:GetTileAtPoint()`, `GetTileInfo()`, and `TUNING.ANCHOR_DEPTH_TIMES`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `winch_ready` | boolean | `true` | Indicates whether the winch line is fully retracted (ready for operation). Controls the `"winch_ready"` tag. |
| `line_length` | number | `0` | Current length of the deployed line. Increases when lowering, decreases when raising. |
| `is_raising` | boolean | `false` | True if the winch is currently retracting (raising) the line. |
| `is_static` | boolean | `true` | True if the winch is idle (not updating each frame). Set false during movement. |
| `raising_speed` | number | `1` | Speed at which the line is retracted per second (scaled by multiplier via `SetRaisingSpeedMultiplier`). |
| `lowering_speed` | number | `0.5` | Speed at which the line is deployed per second (scaled by multiplier via `SetLoweringSpeedMultiplier`). |

## Main Functions
### `Winch:GetCurrentDepth()`
* **Description:** Calculates and returns the current ocean depth at the winch’s position using tile data or an override function. Used to determine full extension point when lowering.  
* **Parameters:** None.

### `Winch:StartRaising(loading_in)`
* **Description:** Initiates line retraction (raising). Starts depth-testing updates, emits `"start_raising_winch"` event, and invokes `onstartraisingfn` callback if set.  
* **Parameters:**  
  - `loading_in` (boolean): Passed to the `"start_raising_winch"` event; indicates whether this action was triggered during level loading.

### `Winch:StartLowering(loading_in)`
* **Description:** Initiates line deployment (lowering). Starts depth-testing updates, emits `"start_lowering_winch"` event, and invokes `onstartloweringfn` callback if set.  
* **Parameters:**  
  - `loading_in` (boolean): Passed to the `"start_lowering_winch"` event; indicates whether this action was triggered during level loading.

### `Winch:FullyRaised()`
* **Description:** Finalizes retraction: sets `line_length = 0`, stops updates, sets `winch_ready = true`, invokes `onfullyraisedfn` callback (if set), and emits `"winch_fully_raised"` event.  
* **Parameters:** None.

### `Winch:FullyLowered()`
* **Description:** Finalizes deployment: sets `line_length` to current depth, stops updates, invokes `onfullyloweredfn` callback (if set), and emits `"winch_fully_lowered"` event.  
* **Parameters:** None.

### `Winch:StartDepthTesting(is_raising)`
* **Description:** Begins continuous depth updates (calls `OnUpdate` each frame) based on movement direction. Sets `is_static = false` and `is_raising = is_raising`.  
* **Parameters:**  
  - `is_raising` (boolean): Direction of movement (`true` = raising, `false` = lowering).

### `Winch:StopDepthTesting()`
* **Description:** Stops depth updates by setting `is_static = true`, `is_raising = false`, and calling `inst:StopUpdatingComponent(self)`.  
* **Parameters:** None.

### `Winch:OnUpdate(dt)`
* **Description:** Core update logic executed while moving. Adjusts `line_length` per second based on speed and direction, then triggers `FullyRaised()` or `FullyLowered()` upon reaching limits.  
* **Parameters:**  
  - `dt` (number): Delta time since last frame.

### `Winch:SetLoweringSpeedMultiplier(mult)`
* **Description:** Sets the current lowering speed multiplier (replaces `lowering_speed` directly).  
* **Parameters:**  
  - `mult` (number): New speed value for lowering.

### `Winch:SetRaisingSpeedMultiplier(mult)`
* **Description:** Sets the current raising speed multiplier (replaces `raising_speed` directly).  
* **Parameters:**  
  - `mult` (number): New speed value for raising.

### `Winch:SetOnFullyLoweredFn(fn)`, `SetOnFullyRaisedFn(fn)`, etc.
* **Description:** Registers optional callback functions executed at key transition points (e.g., start/end of movement).  
* **Parameters:**  
  - `fn` (function): Callback accepting `inst` as argument.

## Events & Listeners
- **Events emitted:**  
  - `"start_raising_winch"`  
  - `"start_lowering_winch"`  
  - `"winch_fully_raised"`  
  - `"winch_fully_lowered"`  
- **No internal event listeners** (`inst:ListenForEvent`) are present in this component.