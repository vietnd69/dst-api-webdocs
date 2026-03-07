---
id: teleportedoverride
title: Teleportedoverride
description: Stores custom destination functions for teleportation overrides on an entity.
tags: [teleport, override, utility]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e01f5772
system_scope: utility
---
# Teleportedoverride

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`TeleportedOverride` is a lightweight component that allows an entity to define custom destination logic for teleportation. It provides two pairs of functions: one for specifying a destination entity (`target_fn`) and another for specifying an exact position (`pos_fn`). These functions are evaluated at teleport time, enabling dynamic teleport targets or locations based on the entity's current state.

This component does not perform teleportation itself; it serves as a configuration container for external systems (e.g., teleport actions or stategraph transitions) that read these functions when deciding where to move the entity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("teleportedoverride")

-- Override destination to always be the player
inst.components.teleportedoverride:SetDestTargetFn(function(self_inst)
    return ThePlayer
end)

-- Override destination to a fixed world position
inst.components.teleportedoverride:SetDestPositionFn(function(self_inst)
    return Vector3(100, 0, -200)
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target_fn` | function or `nil` | `nil` | Callback returning the destination entity for teleportation. |
| `pos_fn` | function or `nil` | `nil` | Callback returning the destination `Vector3` position for teleportation. |

## Main functions
### `GetDestTarget()`
*   **Description:** Returns the destination entity if a target function has been set; otherwise returns `nil`.
*   **Parameters:** None.
*   **Returns:** The entity returned by `target_fn(self.inst)`, or `nil` if no function is set.
*   **Error states:** Returns `nil` if `target_fn` is `nil`.

### `SetDestTargetFn(fn)`
*   **Description:** Sets the callback function used to determine the teleport destination entity.
*   **Parameters:** `fn` (function or `nil`) — a function that takes `self.inst` as argument and returns an entity or `nil`.
*   **Returns:** Nothing.

### `GetDestPosition()`
*   **Description:** Returns the destination position if a position function has been set; otherwise returns `nil`.
*   **Parameters:** None.
*   **Returns:** The `Vector3` returned by `pos_fn(self.inst)`, or `nil` if no function is set.
*   **Error states:** Returns `nil` if `pos_fn` is `nil`.

### `SetDestPositionFn(fn)`
*   **Description:** Sets the callback function used to determine the teleport destination position.
*   **Parameters:** `fn` (function or `nil`) — a function that takes `self.inst` as argument and returns a `Vector3` or `nil`.
*   **Returns:** Nothing.

## Events & listeners
None identified
