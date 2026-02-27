---
id: moonstormwatcher
title: Moonstormwatcher
description: Monitors moonstorms and adjusts the entity's movement speed based on storm intensity, visibility state, and mount status.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 6cb5c8a6
---

# Moonstormwatcher

## Overview
This component listens for global moonstorm events and dynamically modifies the entity's walking speed during moonstorms. It integrates with the `stormwatcher`, `playervision`, `rider`, and `locomotor` components to apply or remove speed penalties depending on the current moonstorm level, visibility modifiers (e.g., goggles or ghost vision), and whether the entity is mounted.

## Dependencies & Tags
- **Component Dependencies**: `stormwatcher`, `playervision`, `rider`, `locomotor`
- **Events Listened To**: `ms_stormchanged` (on `TheWorld`), `gogglevision`, `ghostvision`, `mounted`, `dismounted` (on the owner entity)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | `boolean` | `false` | Whether a moonstorm is currently active and speed modification is applied. |
| `moonstormlevel` | `number` | `0` | *Not used* — retained for compatibility; actual level is computed on demand via `GetMoonStormLevel()`. |
| `moonstormspeedmult` | `number` | `TUNING.MOONSTORM_SPEED_MOD` | Speed multiplier applied during moonstorms (clamped to `[0, 1]`). |
| `delay` | `any` | `nil` | Reserved for future use — unused in current implementation. |

## Main Functions

### `ToggleMoonstorms(data)`
* **Description:** Enables or disables moonstorm speed adjustments based on incoming storm-change data. If enabled, registers event listeners to update speed in response to vision or mount changes.
* **Parameters:**  
  `data` (table): Must contain `stormtype` (e.g., `STORM_TYPES.MOONSTORM`) and `setting` (boolean indicating whether the storm is active).

### `SetMoonstormSpeedMultiplier(mult)`
* **Description:** Updates the global speed multiplier used during moonstorms. Dynamically registers/removes listeners and applies the new multiplier if the storm is active.
* **Parameters:**  
  `mult` (number): New speed multiplier, clamped to `[0, 1]`.

### `UpdateMoonstormLevel()`
* **Description:** Recalculates and broadcasts the current moonstorm level, then updates the entity's speed accordingly.
* **Parameters:** None.

### `UpdateMoonstormWalkSpeed()`
* **Description:** Triggers a recalculation of the entity’s moonstorm-based speed using the current storm level and visibility/mount state.
* **Parameters:** None.

### `UpdateMoonstormWalkSpeed_Internal(level)`
* **Description:** Applies or removes the speed multiplier via the `locomotor` component, based on storm level, moonstorm multiplier, and vision/mount conditions (no penalty if level < `TUNING.SANDSTORM_FULL_LEVEL` or if goggle/ghost vision is active or entity is mounted).
* **Parameters:**  
  `level` (number? | nil): Current moonstorm level; if `nil`, no action is taken.

### `GetMoonStormLevel()`
* **Description:** Retrieves the current moonstorm level from the `stormwatcher` component.
* **Parameters:** None.  
* **Returns:** `number?` — The current moonstorm level, or `nil` if `stormwatcher` is missing.

## Events & Listeners
- **Listens for (on `TheWorld`)**:
  - `"ms_stormchanged"` → calls `ToggleMoonstorms(data)`
- **Listens for (on `self.inst`)**:
  - `"gogglevision"` → updates walk speed
  - `"ghostvision"` → updates walk speed
  - `"mounted"` → updates walk speed
  - `"dismounted"` → updates walk speed
- **Emits (on `self.inst`)**:
  - `"moonstormlevel"` → `{ level = level }` — pushed after level update in `UpdateMoonstormLevel()`