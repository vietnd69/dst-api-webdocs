---
id: transparentonsanity
title: Transparentonsanity
description: Dynamically adjusts an entity's transparency and volume based on the player's sanity level and combat status when in insanity mode, primarily for client-side visual feedback.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 8a5789c3
---

# Transparentonsanity

## Overview
This client-side component dynamically modulates an entity's alpha (transparency) and sound volume based on the local player's sanity status—particularly when in Insanity Mode—and optionally, whether the entity is the player's current combat target. It introduces a subtle, time-varying oscillation to the transparency effect and ensures smooth transitions between alpha states.

## Dependencies & Tags
- Requires `AnimState` component (for color/alpha overrides).
- Requires `SoundEmitter` component (for optional volume override).
- Uses replica data from `replica.combat` and `replica.sanity` (client-side networked data).
- No components are added or tags set by this component itself.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to. |
| `offset` | `number` | Random float (0–1) | Time offset used in the sine-wave oscillator for alpha variation. |
| `osc_speed` | `number` | `0.25 + math.random() * 2` | Speed multiplier for the oscillation (Hz-like). |
| `osc_amp` | `number` | `0.25` | Amplitude of the alpha oscillation. |
| `alpha` | `number` | `0` | Current alpha value (0 = fully transparent, 1 = opaque). |
| `most_alpha` | `number` | `0.4` | Maximum alpha the entity can reach (i.e., baseline opacity under full effect). |
| `target_alpha` | `number?` | `nil` | Desired alpha based on sanity/combat logic. |
| `onalphachangedfn` | `function?` | `nil` | Optional callback invoked on alpha changes. |
| `calc_percent_fn` | `function?` | `nil` | Optional custom function to compute sanity percentage override. |

## Main Functions

### `PushAlpha(alpha, most_alpha)`
* **Description:** Applies the given alpha to the entity’s `AnimState` (via `OverrideMultColour`) and optionally adjusts `SoundEmitter` volume and triggers a user-defined callback.  
* **Parameters:**  
  - `alpha` (number): The new alpha value (0–1 scale).  
  - `most_alpha` (number): The maximum alpha baseline; volume multiplier is scaled relative to this.

### `OnEntitySleep()`
* **Description:** Pauses updates for this component when the entity goes to sleep (i.e., is not actively simulated).  
* **Parameters:** None.

### `OnEntityWake()`
* **Description:** Resumes updates and forces an immediate alpha recalibration when the entity wakes.  
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Called each frame during active updates. Computes new alpha based on time progression and sanity status.  
* **Parameters:**  
  - `dt` (number): Delta time since last frame.

### `ForceUpdate()`
* **Description:** Immediately recalculates and applies the target alpha without interpolation. Used for urgent updates (e.g., wake-up events).  
* **Parameters:** None.

### `CalcaulteTargetAlpha()`
* **Description:** Computes the desired alpha using the following priority:  
  1. If the entity is the local player’s current combat target → return `most_alpha`.  
  2. If `calc_percent_fn` is defined, use its output as the sanity percentage.  
  3. Else, if the player is in Insanity Mode, compute percentage as `1 - sanity:GetPercent()`.  
  4. Multiply the percentage by `most_alpha` and apply sine-based oscillation variance.  
  5. Default to `0` if none apply.  
* **Parameters:** None.

### `DoUpdate(dt, force)`
* **Description:** Core update logic: increments `offset`, computes `target_alpha`, then either sets `alpha` directly (`force = true`) or interpolates toward `target_alpha` per frame. Calls `PushAlpha` with the current `alpha`.  
* **Parameters:**  
  - `dt` (number): Delta time.  
  - `force` (boolean): If `true`, skips interpolation and snaps alpha immediately.

### `GetDebugString()`
* **Description:** Returns a string containing the current alpha value for debugging.  
* **Parameters:** None.

## Events & Listeners
- Listens for:  
  - `"sleep"` → `OnEntitySleep`  
  - `"wake"` → `OnEntityWake`  
- Listens for component updates via `inst:StartUpdatingComponent(self)`/`StopUpdatingComponent(self)` tied to entity wake/sleep lifecycle.  
- Does *not* explicitly push events (only triggers callbacks via `onalphachangedfn`).