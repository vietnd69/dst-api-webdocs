---
id: fishingrod_replica
title: Fishingrod Replica
description: This component provides a replica of a fishing rod's state on a remote client by syncing target entity, hooked fish, and caught fish status via networked properties.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: bd246c96
---

# Fishingrod Replica

## Overview
This component acts as a client-side replica that mirrors key state properties (`_target`, `_hashookedfish`, `_hascaughtfish`) of a remote fishing rod entity. It does not modify local game state directly but exposes and manages synchronized networked values for display, logic, or UI purposes on non-authoritative instances.

## Dependencies & Tags
- Uses `net_entity()` and `net_bool()` for networked property management.
- No explicit component additions or tag modifications observed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_target` | `net_entity` | `nil` | Networked reference to the target entity (e.g., fish or object being fished). |
| `_hashookedfish` | `net_bool` | `false` | Networked flag indicating whether the rod is currently hooked on a fish. |
| `_hascaughtfish` | `net_bool` | `false` | Networked flag indicating whether a fish has been successfully caught. |

## Main Functions

### `SetTarget(target)`
* **Description:** Sets the networked target entity for this replica.  
* **Parameters:**  
  - `target` (`entity` or `nil`): The entity to set as the fishing target.

### `GetTarget()`
* **Description:** Returns the current value of the networked target entity.  
* **Parameters:** None.

### `SetHookedFish(hookedfish)`
* **Description:** Sets the `_hashookedfish` flag to `true` if `hookedfish` is non-nil, otherwise `false`. Updates the networked boolean.  
* **Parameters:**  
  - `hookedfish` (`entity` or `nil`): Indicates whether a fish is currently hooked.

### `HasHookedFish()`
* **Description:** Returns `true` only if `_hashookedfish` is true *and* `_target` is not `nil`. Ensures consistency with actual target presence.  
* **Parameters:** None.

### `SetCaughtFish(caughtfish)`
* **Description:** Sets the `_hascaughtfish` flag to `true` if `caughtfish` is non-nil, otherwise `false`. Updates the networked boolean.  
* **Parameters:**  
  - `caughtfish` (`entity` or `nil`): Indicates whether a fish has been caught.

### `HasCaughtFish()`
* **Description:** Returns `true` if `_hascaughtfish` is true, indicating a fish is currently held.  
* **Parameters:** None.

## Events & Listeners
None.