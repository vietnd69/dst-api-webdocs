---
id: heavyobstacleusetarget
title: Heavyobstacleusetarget
description: This component manages whether an entity can be used as a target for heavy obstacle interactions by dynamically adding or removing the `can_use_heavy` tag based on internal state.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f14b4be8
---

# Heavyobstacleusetarget

## Overview
This component controls whether an entity can be used as a valid target for heavy obstacle actions in the game. It exposes a `can_use_heavy` boolean property whose state directly controls the presence of the `"can_use_heavy"` tag on the associated entity. When enabled, the tag is added; when disabled, it is removed. It also provides a hook (`on_use_fn`) for defining custom behavior when the entity is used with a heavy obstacle.

## Dependencies & Tags
- **Tag Managed:** `"can_use_heavy"` — added or removed dynamically on `inst` depending on `self.can_use_heavy`.
- **No external component dependencies** are declared or used in this script.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `can_use_heavy` | `boolean` | `true` | Controls whether the `"can_use_heavy"` tag should be present on the entity. Changing this property triggers the `oncan_use_heavy` callback to update the entity's tags. |

Note: `on_use_fn` is referenced in `UseHeavyObstacle` but is commented out in the constructor and never initialized. It is not a functional property in current code.

## Main Functions
### `UseHeavyObstacle(doer, heavy_obstacle)`
* **Description:** Invokes the optional callback function `on_use_fn` (if set) to handle custom logic when this entity is used with a heavy obstacle. Returns the result of `on_use_fn`, or `false` if `on_use_fn` is `nil`.
* **Parameters:**
  - `doer`: The entity performing the use action (typically a player or AI).
  - `heavy_obstacle`: The heavy obstacle entity being used.

## Events & Listeners
None.