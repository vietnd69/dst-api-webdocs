---
id: findlight
title: Findlight
description: A behavior tree node that moves an entity toward the nearest valid light source and maintains a safe distance within it.
tags: [ai, behavior, light, navigation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviours
source_hash: da09eb43
system_scope: locomotion
---

# Findlight

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Findlight` is a behavior tree node responsible for directing an entity toward the nearest valid light source (an entity with the `"lightsource"` tag) and guiding it to move within a safe distance of that light. It periodically scans for nearby lights, selects the closest one within range, and uses the `locomotor` component to move toward and maintain proximity to the target. This node is typically used for entities that require illumination—for example, to avoid darkness-related mechanics or penalties.

## Usage example
```lua
-- Typical usage inside a behavior tree for an AI
local findlight = FindLight(entity, 20, 5)
entity.brain:AppendNode(findlight)
```

## Dependencies & tags
**Components used:** `locomotor`
**Tags:** Checks for `"lightsource"` tag on potential targets. No tags are added/removed on `self.inst`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this behavior operates on. |
| `targ` | `Entity?` | `nil` | The current target light source (or `nil` if none found). |
| `see_dist` | number | — | Maximum search radius (distance) for finding light sources. |
| `safe_dist` | number or function | — | Target safe distance from light source. May be a static number or a function `(inst, light) => number`. |
| `lastchecktime` | number | `0` | Timestamp (via `GetTime()`) of the last full target scan. |
| `lastfollowchecktime` | number | `0` | Timestamp of the last proximity/follow check. |

## Main functions
### `FindLight:Visit()`
* **Description:** Executes the behavior logic. On `READY`, picks a target light. On `RUNNING`, periodically re-scans for targets and continuously checks whether the entity is near enough to the light. Stops locomotion if successfully near the light; otherwise commands movement toward it. Fails or succeeds based on light validity and proximity.
* **Parameters:** None.
* **Returns:** Nothing (sets `self.status` to `SUCCESS`, `FAILED`, or leaves as `RUNNING` internally).
* **Error states:** May fail if no valid light source is found within `see_dist`, or if the current light becomes invalid/non-lightsource before succeeding.

### `FindLight:PickTarget()`
* **Description:** Scans for the closest entity with the `"lightsource"` tag within `see_dist` and updates `self.targ`. Resets `lastchecktime` to current time.
* **Parameters:** None.
* **Returns:** Nothing.

### `FindLight:DBString()`
* **Description:** Returns a debug-friendly string describing the current target.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"Stay near light abigail"`.

## Events & listeners
None identified.
