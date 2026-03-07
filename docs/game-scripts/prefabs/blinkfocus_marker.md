---
id: blinkfocus_marker
title: Blinkfocus Marker
description: A temporary, non-persistent marker entity used to visualize the maximum range of a blink-based ability (e.g., Wigfrid's Battle Truce).
tags: [combat, visual, utility, network]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ceeb7ad3
system_scope: entity
---

# Blinkfocus Marker

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`blinkfocus_marker` is a lightweight, temporary visual entity used to indicate the maximum allowed range for blink-type abilities (such as those used in combat or movement). It is not persisted across sessions and exists only on the server (as indicated by early return on the client). The entity exposes helper methods to configure its visibility duration and range, and registers itself with the `blinkfocus` tag for filtering and selection.

## Usage example
```lua
local marker = SpawnPrefab("blinkfocus_marker")
marker.Transform:SetPosition(x, y, z)
marker:SetMaxRange(5)
marker:MakeTemporary(2.0) -- Disappears after 2 seconds
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network`
**Tags:** Adds `blinkfocus` on the instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `maxrange` | `net_float` | `0` | Networked float value representing the maximum blink range (in world units); used by clients for rendering. |
| `_blinkfocus_task` | `Task` or `nil` | `nil` | Internal timer task used to auto-remove the marker after a duration. |

## Main functions
### `MakeTemporary(duration)`
*   **Description:** Marks the entity as non-persistent and schedules it for automatic removal after the given duration.
*   **Parameters:** `duration` (number) - time in seconds before the entity is removed.
*   **Returns:** Nothing.

### `SetMaxRange(range)`
*   **Description:** Updates the networked `maxrange` value, which clients use to visually render the marker (e.g., as a circular arc or ring).
*   **Parameters:** `range` (number) - the new maximum range value.
*   **Returns:** Nothing.

## Events & listeners
None identified.