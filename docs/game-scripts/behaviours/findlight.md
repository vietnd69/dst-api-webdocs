---
id: findlight
title: Findlight
description: A behaviour node that guides an entity toward the nearest valid light source within range, maintaining a safe distance once reached.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: da09eb43
---

# Findlight

## Overview
The `FindLight` component is a behaviour node used within DST's AI behaviour tree system. Its primary responsibility is to direct an entity (e.g., a mob or creature) to locate and approach the nearest light source (a GameObject with the `"lightsource"` tag) within a specified radius (`see_dist`), and then move to a safe distance (defined by `safe_dist`) from that source. It periodically re-evaluates the target and adjusts locomotion using the `locomotor` component. This behaviour is commonly used by light-averse or light-seeking entities in the game.

## Dependencies & Tags
- **Components used:**  
  - `locomotor`: Calls `GoToPoint()` and `Stop()` to control entity movement.
- **Tags:**  
  - `"lightsource"`: Checked on candidate targets and the active target to confirm validity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this behaviour belongs to. |
| `targ` | `Entity?` | `nil` | The currently selected light source target. |
| `see_dist` | `number` | — | Maximum radius to search for light sources. |
| `safe_dist` | `number | function` | — | Desired minimum distance from the light source (resolved via `FunctionOrValue`). |
| `lastchecktime` | `number` | `0` | Timestamp of the last target re-evaluation. |
| `lastfollowchecktime` | `number` | `0` | Timestamp of the last follow/adjustment check. |

## Main Functions

### `FindLight:DBString()`
* **Description:** Returns a human-readable string for debugging purposes, indicating the current light source target.
* **Parameters:** None.
* **Returns:**  
  `string` – e.g., `"Stay near light abigail"` or `"Stay near light nil"`.

### `FindLight:Visit()`
* **Description:** The core tick method of the behaviour node. Called each frame by the behaviour tree scheduler. Handles target selection (initial and periodic), movement execution, and status updates (`READY`, `RUNNING`, `SUCCESS`, `FAILED`).
* **Parameters:** None.
* **Returns:** `nil`.

### `FindLight:PickTarget()`
* **Description:** Locates the nearest entity within `see_dist` that has the `"lightsource"` tag and stores it as the current target. Updates `lastchecktime`.
* **Parameters:** None.
* **Returns:** `nil`.

## Events & Listeners
None.

---