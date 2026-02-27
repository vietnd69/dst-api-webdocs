---
id: boatringdata
title: Boatringdata
description: Manages the visual properties of a circular boat-related effect, such as its radius, segment count, and rotation state.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 640c668a
---

# Boatringdata

## Overview
This component stores data defining the appearance of a ring-like visual effect, commonly associated with boats. It holds properties for the ring's radius, the number of segments it is composed of, and a networked boolean to track whether the ring is currently rotating.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `radius` | `number` | `4` | The radius of the ring effect. |
| `segments` | `number` | `8` | The number of segments used to draw the ring. |
| `_isrotating` | `net_bool` | `false` | A networked variable that tracks if the ring is in a rotating state. |

## Main Functions
### `SetRadius(radius)`
* **Description:** Sets the radius of the ring.
* **Parameters:**
    * `radius` (`number`): The new radius value.

### `SetNumSegments(segments)`
* **Description:** Sets the number of segments that compose the ring.
* **Parameters:**
    * `segments` (`number`): The new number of segments.

### `IsRotating()`
* **Description:** Returns the current rotation state of the ring. This value is synchronized between the server and clients.
* **Returns:** (`boolean`) `true` if the ring is rotating, otherwise `false`.

### `SetIsRotating(isrotating)`
* **Description:** Sets the rotation state of the ring. This function can only be called on the master simulation (server). The state change is automatically synchronized to all clients.
* **Parameters:**
    * `isrotating` (`boolean`): The new rotation state. Set to `true` to enable rotation, `false` to disable it.