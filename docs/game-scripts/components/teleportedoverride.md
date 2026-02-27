---
id: teleportedoverride
title: Teleportedoverride
description: A lightweight utility component that allows an entity to override its teleport destination by specifying either a target entity or a position via callback functions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: e01f5772
---

# Teleportedoverride

## Overview  
This component enables an entity to customize its teleport destination by storing optional callback functions that determine either the target entity or the absolute position to which the entity should teleport. It does not perform teleportation itself, but serves as a data container for teleport override logic used elsewhere (e.g., by teleport logic in the `Teleporter` or `Wormhole` systems).

## Dependencies & Tags  
None identified.

## Properties  
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned via constructor) | Reference to the owner entity, passed during construction and stored as `self.inst`. |
| `target_fn` | `function?` | `nil` | Optional callback that returns the target entity for teleportation (takes `inst` as argument). |
| `pos_fn` | `function?` | `nil` | Optional callback that returns a `Vector3` position for teleportation (takes `inst` as argument). |

## Main Functions  
### `GetDestTarget()`
* **Description:** Returns the teleport target entity by invoking the stored `target_fn` (if present); otherwise returns `nil`.  
* **Parameters:** None.  

### `SetDestTargetFn(fn)`
* **Description:** Sets the callback function used to determine the teleport target entity. The function should accept the owner entity (`inst`) as its sole argument and return either an entity or `nil`.  
* **Parameters:**  
  * `fn` (`function?`) — Callback function for computing the teleport target.  

### `GetDestPosition()`
* **Description:** Returns the teleport position by invoking the stored `pos_fn` (if present); otherwise returns `nil`.  
* **Parameters:** None.  

### `SetDestPositionFn(fn)`
* **Description:** Sets the callback function used to determine the teleport position. The function should accept the owner entity (`inst`) as its sole argument and return a `Vector3` or `nil`.  
* **Parameters:**  
  * `fn` (`function?`) — Callback function for computing the teleport position.  

## Events & Listeners  
None.