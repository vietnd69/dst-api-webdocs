---
id: scaler
title: Scaler
description: Manages and applies scaling transformations to an entity based on a numeric scale factor.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 6f1fef01
---

# Scaler

## Overview
The `Scaler` component maintains a scalar multiplier (default `1`) and applies it uniformly to the entity's visual transform, ensuring consistent resizing across all three dimensions (X, Y, Z). It also supports persistence via `OnSave`/`OnLoad`, allowing the scale value to be saved and restored across game sessions.

## Dependencies & Tags
**Dependencies:**  
- Requires the `Transform` component to be present on the same entity (used via `self.inst.Transform:SetScale(...)`).  
- The optional `OnApplyScale` callback may be assigned externally for custom behavior upon scale change.  

**Tags:**  
- None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in `_ctor`) | Reference to the owning entity instance. |
| `scale` | `number` | `1` | Uniform scale factor applied to the entity’s transform. |

## Main Functions

### `ApplyScale()`
* **Description:** Applies the current `scale` value to the entity's `Transform` component by setting uniform scale along all axes. If the `OnApplyScale` callback is defined, it is invoked with arguments `(inst, scale)`.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns a table containing the current `scale` value for serialization (e.g., saving to disk).  
* **Parameters:** None.  
* **Note:** Returns `{ scale = self.scale }`.

### `OnLoad(data)`
* **Description:** Restores the scale value from saved data. If valid scale data is present, it calls `SetScale()` to apply the restored value.  
* **Parameters:**  
  - `data` (`table?`): Saved component data; must contain a `scale` key to have effect.

### `SetScale(scale)`
* **Description:** Updates the scale value and immediately applies the change via `ApplyScale()`.  
* **Parameters:**  
  - `scale` (`number`): The new uniform scale factor (e.g., `0.5` for half-size, `2.0` for double-size).

## Events & Listeners
None.