---
id: scaler
title: Scaler
description: Manages the uniform scaling of an entity's visual representation by applying a scale factor to its transform.
tags: [visual, transform, scale]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 6f1fef01
system_scope: entity
---

# Scaler

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Scaler` is a lightweight component that controls the visual scale of an entity by adjusting its `Transform` component's scale values uniformly across all axes (X, Y, Z). It is typically attached to prefabs that require dynamic size changes, such as bosses or entities that grow/shrink during gameplay. The component also supports serialization via `OnSave`/`OnLoad` for save-game persistence.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("scaler")
inst.components.scaler:SetScale(1.5)
```

## Dependencies & tags
**Components used:** `Transform` (via `self.inst.Transform`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scale` | number | `1` | The uniform scale factor applied to the entity's transform. |

## Main functions
### `SetScale(scale)`
*   **Description:** Sets the uniform scale factor and immediately applies it to the entity’s transform.
*   **Parameters:** `scale` (number) - the scale factor to apply (e.g., `1` = original size, `2` = double size).
*   **Returns:** Nothing.

### `ApplyScale()`
*   **Description:** Applies the current `scale` value to the entity’s `Transform` component. Optionally calls the `OnApplyScale` callback if defined.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Returns a table containing the current scale value for save-game serialization.
*   **Parameters:** None.
*   **Returns:** `{ scale = number }` — a serializable data table.

### `OnLoad(data)`
*   **Description:** Restores the scale value from saved data. Triggers `SetScale` if valid scale data is provided.
*   **Parameters:** `data` (table?) — expected to contain a `scale` key with a numeric value.
*   **Returns:** Nothing.

## Events & listeners
None identified.
