---
id: savedrotation
title: Savedrotation
description: Manages saving and loading of an entity's rotation state across game sessions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 4b9842e9
---

# Savedrotation

## Overview
This component records and restores the rotation (orientation) of an entity during save/load cycles. It ensures that rotated objects—particularly those placed on rotating platforms like boats—retain their correct orientation when the game is loaded.

## Dependencies & Tags
- `Transform` component (used via `self.inst.Transform:GetRotation()` and `self.inst.Transform:LoadRotation()`).
- No explicit tags are added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component belongs to. Assigned in constructor. |
| `dodelayedpostpassapply` | `boolean?` | `nil` | Optional flag (commented out in constructor) indicating whether delayed application of rotation should occur. Not actively used in current implementation. |

## Main Functions

### `OnSave()`
* **Description:** Captures and returns the entity's current rotation. Returns `nil` if rotation is zero; otherwise returns a table `{ rotation = <angle> }`.
* **Parameters:** None.

### `LoadPostPass(newents, data)`
* **Description:** Applies the saved rotation from the save data to the entity during post-load phase. Handles loading of rotation values, and optionally triggers `ApplyPostPassRotation` if a delayed application is needed.
* **Parameters:**
  - `newents`: Table of newly loaded entities (unused in this function).
  - `data`: Save data table containing `rotation` value.

### `ApplyPostPassRotation(angle)`
* **Description:** Schedules a deferred set-rotation operation to run in the next frame (via `DoTaskInTime(0, ...)`). Used to ensure correct orientation of objects placed on rotating platforms *after* initial placement logic completes.
* **Parameters:**
  - `angle`: Numeric rotation value (in degrees) to apply.

## Events & Listeners
None.