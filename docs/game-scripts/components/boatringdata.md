---
id: boatringdata
title: Boatringdata
description: Stores and synchronizes visual ring configuration data for boat-related effects, including radius, segment count, and rotation state.
tags: [boat, visual, network, data]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 640c668a
system_scope: network
---

# Boatringdata

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatRingData` is a data component responsible for storing configuration parameters for a visual ring effect associated with boats—specifically radius, number of segments, and rotation state. It also handles network synchronization of the rotation state using the `net_bool` type, ensuring the value is consistent across the server and clients. This component is typically attached to entities that manage boat-related particle or visual effects.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("boatringdata")
inst.components.boatringdata:SetRadius(6)
inst.components.boatringdata:SetNumSegments(12)
inst.components.boatringdata:SetIsRotating(true)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `radius` | number | `4` | Radius of the visual ring effect. |
| `segments` | number | `8` | Number of segments used to approximate the ring geometry. |
| `_isrotating` | `net_bool` | `net_bool(GUID, "boatringdata._isrotating")` | Networked boolean indicating whether the ring is currently rotating. |

## Main functions
### `GetRadius()`
* **Description:** Returns the current radius of the ring effect.
* **Parameters:** None.
* **Returns:** `number` — the ring radius.

### `SetRadius(radius)`
* **Description:** Sets the radius of the ring effect. This change is local and not automatically synced over the network.
* **Parameters:** `radius` (number) — the new radius value.
* **Returns:** Nothing.

### `GetNumSegments()`
* **Description:** Returns the current number of segments used to render the ring.
* **Parameters:** None.
* **Returns:** `number` — the number of segments.

### `SetNumSegments(segments)`
* **Description:** Sets the number of segments used to render the ring. This change is local and not automatically synced over the network.
* **Parameters:** `segments` (number) — the new segment count.
* **Returns:** Nothing.

### `IsRotating()`
* **Description:** Returns whether the ring is currently marked as rotating. This value is synchronized across the network.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if rotating, `false` otherwise.

### `SetIsRotating(isrotating)`
* **Description:** Sets the rotation state of the ring on the master simulation. This is the authoritative method for updating the state and automatically syncs to clients.
* **Parameters:** `isrotating` (boolean) — whether the ring should be rotating.
* **Returns:** Nothing.
* **Error states:** Raises an `assert` failure if called outside the master simulation (`TheWorld.ismastersim` is `false`).

## Events & listeners
None identified
