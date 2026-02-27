---
id: uianim
title: Uianim
description: Provides animated transitions for UI-related entity properties—including position, scale, tint, and rotation—using linear interpolation with easing.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: ui
source_hash: d11ee69e
---

# Uianim

## Overview
The `Uianim` component manages smooth, time-based animations for UI-focused entities in Don't Starve Together. It enables coordinated transitions of position (via `MoveTo`), scale (`ScaleTo`), tint (`TintTo`), and rotation (`RotateTo`), using cubic easing and a wall-updating loop for frame-accurate control. Animations can be interrupted or canceled, and callbacks can be executed upon completion.

## Dependencies & Tags
- **Component Requirements:**
  - `self.inst.UITransform`: Must support `SetPosition(x, y, z)`, `GetScale()`, `SetScale(x, y, z)`, and `SetRotation(rot)`.
  - `self.inst.widget`: Must support `SetTint(r, g, b, a)`.
- **Tags/Class Integration:**
  - Registers itself with the entity via `inst:StartWallUpdatingComponent(self)` to participate in the wall update loop (a dedicated UI animation update system).
  - No tags are added or removed.

## Properties
| Property | Type | Default Value | Description |
|---------|------|---------------|-------------|
| `inst` | `Entity` | (parameter) | The entity to which this component is attached. |
| `update_while_paused` | `boolean` | `true` | Controls whether animations continue during server pauses (e.g., in pause menus). |

**Note:** Animation-specific state (e.g., `tint_t`, `scale_dest`, `pos_whendone`) is stored as instance properties during active animations but are not part of the constructor’s public API.

## Main Functions

### `UpdateWhilePaused(update_while_paused)`
* **Description:** Sets whether the animation loop should continue running while the game is paused.
* **Parameters:**
  - `update_while_paused` (`boolean`): If `true`, animations proceed during pauses; otherwise, they pause.

### `FinishCurrentTint()`
* **Description:** Immediately completes the current tint animation by applying the destination tint value and invoking the `whendone` callback if present.
* **Parameters:** None.

### `CancelTintTo(run_complete_fn)`
* **Description:** Aborts the current tint animation, optionally invoking the completion callback before clearing state.
* **Parameters:**
  - `run_complete_fn` (`boolean?`): If `true` and a callback is queued, it runs before cancellation.

### `TintTo(start, dest, duration, whendone)`
* **Description:** Starts a tint animation from `start` to `dest` over `duration` seconds, using `outCubic` easing. Invokes `whendone` upon completion.
* **Parameters:**
  - `start` (`table`): `{ r, g, b, a }` – initial tint values (0–1).
  - `dest` (`table`): `{ r, g, b, a }` – target tint values.
  - `duration` (`number`): Animation duration in seconds.
  - `whendone` (`function?`): Optional callback invoked when the animation finishes.

### `FinishCurrentScale()`
* **Description:** Immediately completes the current scale animation, applying the destination scale value and invoking `whendone`.
* **Parameters:** None.

### `CancelScaleTo(run_complete_fn)`
* **Description:** Aborts the current scale animation, optionally running its completion callback.
* **Parameters:**
  - `run_complete_fn` (`boolean?`): If `true` and a callback is queued, it runs before cancellation.

### `ScaleTo(start, dest, duration, whendone)`
* **Description:** Starts a uniform scale animation over time. If a previous scale animation is running, it finishes that first.
* **Parameters:**
  - `start` (`number`): Initial scale factor.
  - `dest` (`number`): Target scale factor.
  - `duration` (`number`): Duration in seconds.
  - `whendone` (`function?`): Optional completion callback.

### `MoveTo(start, dest, duration, whendone)`
* **Description:** Animates the entity’s 3D position from `start` to `dest` using cubic easing.
* **Parameters:**
  - `start` (`table`): `{ x, y, z }` – starting position.
  - `dest` (`table`): `{ x, y, z }` – ending position.
  - `duration` (`number`): Duration in seconds.
  - `whendone` (`function?`): Optional completion callback.

### `RotateTo(start, dest, duration, whendone, infinite)`
* **Description:** Animates the entity’s rotation from `start` to `dest`. If `infinite` is `true`, animates indefinitely at a constant rotation speed (`dest` is treated as angular velocity).
* **Parameters:**
  - `start` (`number`): Initial rotation angle (degrees).
  - `dest` (`number`): Target rotation angle (or angular velocity if `infinite`).
  - `duration` (`number`): Duration in seconds (ignored if `infinite`).
  - `whendone` (`function?`): Optional completion callback.
  - `infinite` (`boolean?`): If `true`, rotates indefinitely.

### `CancelMoveTo(run_complete_fn)`
### `CancelRotateTo(run_complete_fn)`
* **Description:** Abort the current move or rotation animation, optionally invoking the completion callback.
* **Parameters:**
  - `run_complete_fn` (`boolean?`): Whether to run the `whendone` callback before canceling.

### `OnWallUpdate(dt)`
* **Description:** Core update loop for animations. Called by the wall update system each frame. Handles interpolation, completion logic, and cleanup. Respects pause state if `update_while_paused` is `false`.
* **Parameters:**
  - `dt` (`number`): Time elapsed since the last frame.

## Events & Listeners
This component does not listen for or dispatch events via `inst:ListenForEvent` or `inst:PushEvent`. It operates entirely through direct method calls and callback execution.