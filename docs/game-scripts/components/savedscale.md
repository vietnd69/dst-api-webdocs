---
id: savedscale
title: Savedscale
description: Manages persistence of an entity's 3D scale values (x, y, z) across save/load cycles.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 987f94a1
---

# Savedscale

## Overview
This component ensures that an entity's transform scale is saved to and restored from the game save file. It records non-default scale components (i.e., values not equal to 1) in a compact format during `OnSave` and applies them during `OnLoad`, defaulting missing axes to the x-scale for symmetry.

## Dependencies & Tags
- Requires the `Transform` component to be present on the same entity (via `self.inst.Transform`).
- No component dependencies added (`AddComponent`).
- No tags are added or removed.

## Properties
No public properties are initialized in the constructor or elsewhere. The component relies solely on the `inst` reference passed at construction.

## Main Functions

### `OnSave()`
* **Description:** Captures the entity’s current transform scale (x, y, z) and returns a compact table containing only non-default (non-1) scale components. Specifically:
  - `x` is saved only if ≠ 1.
  - `y` is saved only if ≠ `x`.
  - `z` is saved only if ≠ `x`.
  Returns `nil` if all scales are 1 (no custom scaling).
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores the entity’s transform scale from saved `data`. Uses `data.x` as the base scale, defaulting to 1. Then sets:
  - x = `data.x` or 1
  - y = `data.y` or (x value)
  - z = `data.z` or (x value)
* **Parameters:**
  - `data` (table or nil): Optional saved scale data. If `nil` or empty, scales are reset to (1,1,1).

## Events & Listeners
None.