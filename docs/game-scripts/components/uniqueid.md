---
id: uniqueid
title: Uniqueid
description: Assigns and manages a unique numeric identifier for an entity, incrementing per prefab type via the UniquePrefabIDs system.
tags: [network, serialization, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 68ff97bd
system_scope: entity
---

# Uniqueid

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `uniqueid` component assigns a stable, incrementing numeric ID to each entity instance upon spawn or load. This ID is unique within the context of its prefab (e.g., all `log` prefabs share ID sequences, but `log_1` ≠ `log_2`). The component integrates with `uniqueprefabids` to fetch the next available ID via `GetNextID`, and ensures persistence across saves/load cycles. It is primarily used for debug output and internal tracking where precise entity identity matters.

## Usage example
```lua
local inst = Prefab("mysticstone", "mysticstone")
inst:AddComponent("uniqueid")
-- After spawn/load, the ID is assigned:
print(inst.components.uniqueid:GetDebugString()) -- e.g., "1", "2", etc.
```

## Dependencies & tags
**Components used:** `uniqueprefabids`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `id` | number \| nil | `nil` | The unique numeric ID assigned to this entity instance; set on first use or load. |
| `task` | Task | `nil` | Delayed task used to request a new ID from `uniqueprefabids`. |

## Main functions
### `OnSave()`
*   **Description:** Serializes the component’s state for world save. Returns a table containing the assigned ID.
*   **Parameters:** None.
*   **Returns:** `{ id = number \| nil }` — a table with the `id` field set to the current ID value (or `nil` if not yet assigned).
*   **Error states:** None. Safe to call before ID assignment (returns `{ id = nil }`).

### `OnLoad(data)`
*   **Description:** Restores the component’s state from a previous save. If an ID was previously assigned (`data.id ~= nil`), it cancels the deferred ID-generation task to preserve the saved ID.
*   **Parameters:** `data` (table) — must contain an `id` field (number or nil).
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable string representation of the assigned ID, used for debugging or debug UI overlays.
*   **Parameters:** None.
*   **Returns:** `string` — the ID converted to string (e.g., `"1"`), or `"nil"` if no ID has been assigned yet.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
