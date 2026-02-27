---
id: follower_replica
title: Follower Replica
description: A networked component that tracks and synchronizes a follower's current leader and item owner, returning the leader when queried (preferring item owner if set).
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 00bdfa10
---

# Follower Replica

## Overview
This component acts as a lightweight network replica for followers (e.g., pets or summons), managing two synchronized networked references—`_leader` and `_itemowner`—and providing a unified getter that prioritizes `_itemowner` as the effective leader when present.

## Dependencies & Tags
- Relies on the `net_entity` helper (internal to DST) to manage synchronized entity references across clients and server.
- Does not add or remove any standard component tags.
- Requires the `inst.GUID` to be valid for `net_entity` to function.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | The entity instance this component is attached to. |
| `_leader` | `net_entity` | `nil` (initialized lazily) | Networked reference to the entity’s primary leader. |
| `_itemowner` | `net_entity` | `nil` (initialized lazily) | Networked reference to the entity’s item owner (e.g., a player holding its item form). |

## Main Functions

### `SetLeader(leader)`
* **Description:** Sets the primary leader entity reference (`_leader`) to the provided entity.  
* **Parameters:**  
  - `leader`: An `Entity` instance (or `nil`), passed to `self._leader:set()`.

### `SetItemOwner(owner)`
* **Description:** Sets the item owner entity reference (`_itemowner`) to the provided entity. This typically reflects ownership when the follower is in item form (e.g., held by a player).  
* **Parameters:**  
  - `owner`: An `Entity` instance (or `nil`), passed to `self._itemowner:set()`.

### `GetLeader()`
* **Description:** Returns the effective leader. If `_itemowner` is set (non-nil), it takes precedence; otherwise, `_leader` is returned.  
* **Parameters:** None.  
* **Returns:** `Entity?` — Either the item owner or leader entity, or `nil` if neither is set.

## Events & Listeners
None.