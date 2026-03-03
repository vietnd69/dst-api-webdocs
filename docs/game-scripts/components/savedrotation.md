---
id: savedrotation
title: SavedRotation
description: Persists and restores an entity's rotation during save/load operations, primarily for entities that must maintain orientation relative to moving platforms like boats.
tags: [save, rotation, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4b9842e9
system_scope: network
---

# SavedRotation

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SavedRotation` ensures an entity's rotation is correctly serialized during game saves and deserialized during loads. It specifically supports entities (e.g., followers on boats) that need to retain their angular orientation relative to a moving platform. The component stores non-zero rotations in the save data and applies them during load via `Transform:LoadRotation`, with optional deferred adjustment via `ApplyPostPassRotation` when precise post-placement orientation is required.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("savedrotation")

-- During load, rotation data is applied automatically by the engine via LoadPostPass.
-- If deferred application is needed (e.g., after placement on a boat), set:
inst.components.savedrotation.dodelayedpostpassapply = true
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `dodelayedpostpassapply` | boolean | `false` | When `true`, `ApplyPostPassRotation` is invoked in `LoadPostPass` to reapply rotation after initial placement. |

## Main functions
### `OnSave()`
*   **Description:** Captures the entity’s current rotation and returns it for serialization if non-zero; returns `nil` if rotation is zero (to avoid storing redundant data).
*   **Parameters:** None.
*   **Returns:** `{ rotation = rotation_value }` (table) if rotation ≠ 0, otherwise `nil`.

### `LoadPostPass(newents, data)`
*   **Description:** Restores the saved rotation during level load using `Transform:LoadRotation`. Optionally triggers `ApplyPostPassRotation` if `dodelayedpostpassapply` is set.
*   **Parameters:**  
    - `newents` (table) — mapping of entity IDs to entity instances (unused but part of DST’s load contract).  
    - `data` (table) — saved rotation data, e.g., `{ rotation = 45 }`.
*   **Returns:** Nothing.

### `ApplyPostPassRotation(angle)`
*   **Description:** Schedules an immediate one-frame task to explicitly set the rotation via `Transform:SetRotation`, typically to correct orientation after platform movement or placement. Used when `LoadRotation` alone is insufficient.
*   **Parameters:** `angle` (number) — rotation angle in degrees.
*   **Returns:** Nothing.
*   **Error states:** No failure modes; always schedules the task.

## Events & listeners
None identified
