---
id: riftthralltype
title: RiftThrallType
description: Stores and manages the type classification for a rift thrall entity.
tags: [ rift, entity, classification ]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 80502ca2
system_scope: entity
---
# RiftThrallType

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`RiftThrallType` is a simple component that stores and exposes the type classification of a rift thrall entity. It provides basic getter, setter, and equality-check functionality for the `thrall_type` value, and supports serialization via `OnSave`/`OnLoad` for network and savegame persistence. This component is intended for entities representing thralls spawned from rifts in the game.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("riftthralltype")

inst.components.riftthralltype:SetThrallType("warrior")
assert(inst.components.riftthralltype:GetThrallType() == "warrior")
assert(inst.components.riftthralltype:IsThrallType("warrior") == true)
assert(inst.components.riftthralltype:IsThrallType("scout") == false)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `thrall_type` | string? | `nil` | The classification string assigned to the thrall (e.g., `"warrior"`, `"scout"`). |

## Main functions
### `SetThrallType(new_type)`
*   **Description:** Assigns a new type string to the thrall.
*   **Parameters:** `new_type` (string?) — the type identifier to store. May be `nil`.
*   **Returns:** Nothing.

### `GetThrallType()`
*   **Description:** Returns the currently stored thrall type.
*   **Parameters:** None.
*   **Returns:** `string?` — the stored type, or `nil` if unset.

### `IsThrallType(check_type)`
*   **Description:** Compares the stored type to the given type.
*   **Parameters:** `check_type` (string?) — the type to compare against.
*   **Returns:** `boolean` — `true` if equal, `false` otherwise (including when either value is `nil`).
*   **Error states:** Returns `false` when `thrall_type` is `nil`, unless `check_type` is also `nil`.

### `OnSave()`
*   **Description:** Prepares the component's state for serialization.
*   **Parameters:** None.
*   **Returns:** `{ thrall_type: string }?` — a table containing `thrall_type` if set; otherwise `nil`.

### `OnLoad(data)`
*   **Description:** Restores component state from serialized data.
*   **Parameters:** `data` (`{ thrall_type: string }?`) — the saved data table.
*   **Returns:** Nothing.
*   **Error states:** Silently ignores missing or invalid `data`.

### `GetDebugString()`
*   **Description:** Returns a human-readable representation of the thrall type for debugging.
*   **Parameters:** None.
*   **Returns:** `string` — the stored type or `"NONE"` if `nil`.

## Events & listeners
None identified
