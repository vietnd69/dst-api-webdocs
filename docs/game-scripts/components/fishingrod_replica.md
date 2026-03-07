---
id: fishingrod_replica
title: Fishingrod Replica
description: Manages networked state for a fishing rod entity, tracking hooked and caught fish across the client-server boundary.
tags: [network, fishing, replica]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: bd246c96
system_scope: network
---

# Fishingrod Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FishingRod` is a networked replica component that synchronizes fishing rod state—specifically, the target entity, whether a fish is hooked, and whether a fish has been caught—between server and clients. It does not manage game logic (e.g., casting, reeling), but ensures consistent state propagation for related prefabs (e.g., `fishingrod` prefab). This component relies on DST’s `net_*` utilities to expose replicable properties.

## Usage example
```lua
-- Typical usage is internal; added automatically to `fishingrod` prefabs.
-- Example of external interaction (e.g., from server-side logic):
local inst = TheSim:FindEntity(function(e) return e:HasTag("fishingrod") end, 1)
if inst and inst.components.fishingrod_replica then
    inst.components.fishingrod_replica:SetTarget(some_fish)
    inst.components.fishingrod_replica:SetHookedFish(true)
end
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_target` | `net_entity` | `nil` | Networked reference to the target entity (e.g., a fish). |
| `_hashookedfish` | `net_bool` | `false` | Networked flag indicating whether a fish is currently hooked. |
| `_hascaughtfish` | `net_bool` | `false` | Networked flag indicating whether a fish has been successfully caught. |

## Main functions
### `SetTarget(target)`
*   **Description:** Sets the networked target entity for the fishing rod.
*   **Parameters:** `target` (`entity` or `nil`) — the entity being targeted (typically a fish).
*   **Returns:** Nothing.

### `GetTarget()`
*   **Description:** Returns the current networked target entity.
*   **Parameters:** None.
*   **Returns:** `entity` or `nil` — the entity currently targeted by the rod, or `nil` if none.

### `SetHookedFish(hookedfish)`
*   **Description:** Sets the hooked state. true is stored if `hookedfish` is non-nil; otherwise false.
*   **Parameters:** `hookedfish` (`entity` or `nil`) — entity representing the hooked fish, or `nil`.
*   **Returns:** Nothing.

### `HasHookedFish()`
*   **Description:** Determines if a fish is hooked by checking both the networked flag and that the target entity is non-nil.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if both `_hashookedfish` and `_target:value()` are set, otherwise `false`.

### `SetCaughtFish(caughtfish)`
*   **Description:** Sets the caught state. true is stored if `caughtfish` is non-nil; otherwise false.
*   **Parameters:** `caughtfish` (`entity` or `nil`) — entity representing the caught fish, or `nil`.
*   **Returns:** Nothing.

### `HasCaughtFish()`
*   **Description:** Determines if a fish has been caught, based solely on the networked caught flag.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if a fish has been caught, otherwise `false`.

## Events & listeners
None identified
