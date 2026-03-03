---
id: dryable
title: Dryable
description: Marks an entity as capable of being dried and stores associated drying data, such as product yield, drying time, and associated build files for raw and dried states.
tags: [drying, crafting, inventory, world, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ceb17ce1
system_scope: entity
---

# Dryable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Dryable` component enables an entity to participate in the game's drying mechanic (e.g., in a drying rack or under the sun). It is attached to prefabs that can transition from a raw state to a dried variant, storing metadata required to define the dried output, the time required for drying, and the Prefab/BuildFile references for both raw and dried states. It automatically adds the `dryable` tag to its host entity upon initialization and removes it when removed.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("dryable")
inst.components.dryable:SetProduct("dried_meat")
inst.components.dryable:SetDryTime(300)  -- 5 minutes
inst.components.dryable:SetBuildFile("builds/meat.fbx")
inst.components.dryable:SetDriedBuildFile("builds/meat_dried.fbx")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `dryable`; removes `dryable` on entity removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `product` | string or nil | `nil` | The name of the prefab that replaces this entity after drying completes. |
| `drytime` | number or nil | `nil` | Duration in seconds required to dry this entity. |
| `buildfile` | string or nil | `nil` | File path to the 3D model (`.fbx`) used for the raw state of the entity. |
| `dried_buildfile` | string or nil | `nil` | File path to the 3D model for the dried state; if not set, falls back to `buildfile`. |

## Main functions
### `SetProduct(product)`
*   **Description:** Sets the prefab name of the item that results from drying this entity.
*   **Parameters:** `product` (string) — the name of the dried product prefab.
*   **Returns:** Nothing.

### `GetProduct()`
*   **Description:** Returns the currently set dried product prefab name.
*   **Parameters:** None.
*   **Returns:** (string or nil) — the product prefab name, or `nil` if unset.

### `SetDryTime(time)`
*   **Description:** Sets the drying duration for this entity.
*   **Parameters:** `time` (number) — drying time in seconds.
*   **Returns:** Nothing.

### `GetDryTime()`
*   **Description:** Returns the currently set drying duration.
*   **Parameters:** None.
*   **Returns:** (number or nil) — drying time in seconds, or `nil` if unset.

### `SetBuildFile(buildfile)`
*   **Description:** Sets the asset file path for the raw (undried) model.
*   **Parameters:** `buildfile` (string) — path to the `.fbx` file (e.g., `"builds/meat.fbx"`).
*   **Returns:** Nothing.

### `GetBuildFile()`
*   **Description:** Returns the raw model file path.
*   **Parameters:** None.
*   **Returns:** (string or nil) — the build file path, or `nil` if unset.

### `SetDriedBuildFile(dried_buildfile)`
*   **Description:** Sets the asset file path for the dried model.
*   **Parameters:** `dried_buildfile` (string) — path to the `.fbx` file for the dried state.
*   **Returns:** Nothing.

### `GetDriedBuildFile()`
*   **Description:** Returns the dried model file path; if none was explicitly set, returns the raw `buildfile` as fallback.
*   **Parameters:** None.
*   **Returns:** (string) — the dried build file path, or the raw build file if `dried_buildfile` is `nil`.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
