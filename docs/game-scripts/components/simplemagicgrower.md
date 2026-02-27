---
id: simplemagicgrower
title: Simplemagicgrower
description: A component that recursively triggers magical growth on an entity until it reaches a specified final growth stage, then stops and removes the magicgrowth tag.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: ca6b684b
---

# Simplemagicgrower

## Overview
This component implements a recursive growth mechanism that accelerates the natural growth process of an entity by repeatedly applying growth steps until a target growth stage (`last_stage`) is reached. It is designed to work alongside a `growable` component and temporarily tags the entity with `"magicgrowth"` during active growth.

## Dependencies & Tags
- **Component dependency:** Requires the `growable` component to be present on the same entity.
- **Tags added:** `"magicgrowth"` (added when `StartGrowing` is called).
- **Tags removed:** `"magicgrowth"` (removed after reaching `last_stage`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set in `_ctor`) | Reference to the owning entity. |
| `last_stage` | `number` | `nil` | The target growth stage at which to stop magical growth. Set via `SetLastStage`. |

## Main Functions

### `SetLastStage(last_stage)`
* **Description:** Sets the target growth stage (`last_stage`) that defines when growth should cease.
* **Parameters:**
  * `last_stage` (`number`): The desired final growth stage value.

### `Grow()`
* **Description:** Performs a single growth step via `growable:DoGrowth()` if growth is possible, then schedules another growth step after a short random delay using a one-time task. If the current stage meets or exceeds `last_stage`, growth stops and the `"magicgrowth"` tag is removed.
* **Parameters:** None.

### `StartGrowing()`
* **Description:** Begins the magical growth process by adding the `"magicgrowth"` tag and invoking `Grow()` for the first time.
* **Parameters:** None.

## Events & Listeners
None.