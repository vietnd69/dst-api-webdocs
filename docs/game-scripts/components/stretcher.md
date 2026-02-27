---
id: stretcher
title: Stretcher
description: Dynamically scales and rotates an entity to stretch toward a target entity's position over time.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: d03207dc
---

# Stretcher

## Overview
This component continuously adjusts the scale and orientation of its owner entity to visually stretch toward a specified target entity. It is typically used for visual effects such as elastic connections or body elongation in gameplay mechanics.

## Dependencies & Tags
- Relies on the entity having `Transform`, `AnimState`, and `Update` components.
- Calls `inst:StartUpdatingComponent(self)` and `inst:StopUpdatingComponent(self)`, indicating it integrates with the entity’s update loop.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component belongs to (set in constructor). |
| `target` | `Entity?` | `nil` | The entity to stretch toward; may be `nil`. |
| `restinglength` | `number` | `1` | Target distance used to determine natural (non-stretched) length for scaling. |
| `widthratio` | `number` | `1` | Controls how much the width scales relative to length scaling. |

## Main Functions

### `SetRestingLength(length)`
* **Description:** Sets the resting length used as the baseline for computing stretch scale.
* **Parameters:**
  * `length` (`number`): The desired resting length value.

### `SetWidthRatio(ratio)`
* **Description:** Sets the width scaling multiplier relative to the length scale change.
* **Parameters:**
  * `ratio` (`number`): Scaling factor that determines how width changes as the entity stretches.

### `SetStretchTarget(inst)`
* **Description:** Assigns or clears the target entity to stretch toward. Automatically manages the update loop based on whether a target is set.
* **Parameters:**
  * `inst` (`Entity?`): The target entity; if `nil`, disables updates.

### `OnEntitySleep()`
* **Description:** Pauses updates when the owner entity enters sleep state (e.g., off-screen or inactive).
* **Parameters:** None.

### `OnEntityWake()`
* **Description:** Restarts or conditionally resumes updates when the owner entity wakes. Only updates if a valid target exists.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Core update logic. Adjusts scale and rotation to stretch toward the target. Stops updating if the target becomes invalid.
* **Parameters:**
  * `dt` (`number`): Delta time since last frame (unused in calculations, but passed by update system).

## Events & Listeners
None.