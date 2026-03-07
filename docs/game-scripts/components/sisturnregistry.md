---
id: sisturnregistry
title: Sisturnregistry
description: Tracks the presence and activation state of sisturns attached to an entity and broadcasts state changes when sisturn status changes.
tags: [world, event, state]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 2881f568
system_scope: world
---
# Sisturnregistry

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Sisturnregistry` is a server-side-only component that maintains a registry of active sisturns associated with an entity (typically the `wendy` character or world entities like the abigail doll). It tracks which sisturns are present and whether they are active, and periodically computes aggregate state flags such as `is_active` and `is_blossom`. When any of these flags change, it fires the `onsisturnstatechanged` event, primarily used by Wendy’s gameplay logic. The component is restricted to the master simulation only and asserts on client instantiation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sisturnregistry")

-- Register a sisturn prefab instance
inst.components.sisturnregistry:Register(some_sisturn_inst)

-- Query aggregate state
local is_active = inst.components.sisturnregistry:IsActive()
local is_blossom = inst.components.sisturnregistry:IsBlossom()

-- Debug output
print(inst.components.sisturnregistry:GetDebugString())
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance that owns this component. |
| `_sisturns` | `table` | `{}` | Internal map of sisturn entity instances to boolean activity status. |
| `_is_active` | `boolean` | `false` | Whether at least one registered sisturn is active. |
| `_is_blossom` | `boolean` | `false` | Whether any active sisturn is in `BLOSSOM` feel mode. |

## Main functions
### `Register(sisturn)`
*   **Description:** Registers a sisturn entity with this registry. Does nothing if the sisturn is already registered. Attaches event listeners to the sisturn for automatic removal when the sisturn is destroyed (`onremove`) or burnt (`onburnt`).
*   **Parameters:** `sisturn` (`Entity?`) — the sisturn entity to register. May be `nil`, in which case registration is skipped.
*   **Returns:** Nothing.
*   **Error states:** Silently returns early if `sisturn` is `nil` or already registered.

### `IsActive()`
*   **Description:** Returns whether at least one registered sisturn is currently marked as active.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if any sisturn in the registry is active, otherwise `false`.

### `IsBlossom()`
*   **Description:** Returns whether at least one active sisturn has feel state `"BLOSSOM"`.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if a `BLOSSOM` sisturn is active, otherwise `false`.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string summarizing current registry contents and state flags.
*   **Parameters:** None.
*   **Returns:** `string` — formatted string: `"Num: X, is_active:Y, is_blossom:Z"`.

## Events & listeners
- **Listens to:**  
  `ms_updatesisturnstate` — triggered server-side when sisturn activity state changes. Calls `OnUpdateSisturnState` to update internal tracking and recompute aggregate state.  
- **Pushes:**  
  `onsisturnstatechanged` — fired when the aggregate `is_active` or `is_blossom` flags change. Payload: `{is_active = boolean, is_blossom = boolean}`.
