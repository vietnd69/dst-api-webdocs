---
id: weighable
title: Weighable
description: Manages weight-related data and tags for entities that can be weighed (e.g., trophies, items used in weighing mechanics), including owner information and weight percentage calculation.
tags: [weight, inventory, data, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7f86a988
system_scope: entity
---

# Weighable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Weighable` is an entity component that tracks weight data, calculates a normalized weight percentage (`0` to `1`) based on configurable min/max weight bounds, and manages associated tags and ownership metadata (e.g., for trophies or captured items). It integrates with the tag system to dynamically update entity tags based on weight *type* (e.g., `"weighable_light"`, `"weighable_heavy"`), and supports persistence via `OnSave`/`OnLoad` methods. Typically used on prefabs representing weighable items or trophies in gameplay mechanics such as merm fishing or weighing stations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("weighable")

-- Initialize weight range and set initial weight
inst.components.weighable:Initialize(10, 100)
inst.components.weighable:SetWeight(45)

-- Assign ownership (e.g., to a player)
inst.components.weighable:SetPlayerAsOwner(some_player)

-- Retrieve normalized weight and type tag
local pct = inst.components.weighable:GetWeightPercent()
-- "weighable_medium" tag may be present depending on type assignment
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `"weighable_"..type` when `type` is set (via the `type` setter); removes the same tag on removal or type change.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `type` | string \| nil | `nil` | Weight classification used to derive tags (e.g., `"light"`, `"medium"`, `"heavy"`). |
| `weight` | number \| nil | `nil` | Raw weight value (e.g., in grams or abstract units). |
| `weight_percent` | number \| nil | `nil` | Normalized weight (`0.0`–`1.0`) based on `min_weight`/`max_weight`. |
| `owner_userid` | string \| nil | `nil` | User ID of the player who owns this item (e.g., trophy owner). |
| `owner_name` | string \| nil | `nil` | Player name associated with `owner_userid`. |
| `prefab_override_owner` | string \| nil | `nil` | Optional override for the owner label (e.g., `"merm"` for a merm-caught item). |
| `min_weight` | number \| nil | `nil` | Minimum weight for normalization calculation. |
| `max_weight` | number \| nil | `nil` | Maximum weight for normalization calculation. |

## Main functions
### `Initialize(min_weight, max_weight)`
* **Description:** Sets the minimum and maximum weight bounds used to compute `weight_percent`.
* **Parameters:**  
  `min_weight` (number) — lower bound for weight scaling; must be `< max_weight` for meaningful normalization.  
  `max_weight` (number) — upper bound for weight scaling.
* **Returns:** Nothing.

### `SetWeight(weight)`
* **Description:** Sets the raw `weight` value and triggers recalculation of `weight_percent`.
* **Parameters:**  
  `weight` (number) — raw weight to assign (rounded to two decimal places).
* **Returns:** Nothing.

### `GetWeight()`
* **Description:** Returns the currently stored raw weight.
* **Parameters:** None.
* **Returns:** `number` \| `nil` — the stored `weight` value.

### `GetWeightPercent()`
* **Description:** Returns the normalized weight percentage based on `min_weight`, `max_weight`, and `weight`.
* **Parameters:** None.
* **Returns:** `number` \| `nil` — a value between `0` and `1`; defaults to `0.5` if min/max are `nil`.

### `SetPlayerAsOwner(owner)`
* **Description:** Records ownership by a player (or clears it if `nil` is passed). Resets any `prefab_override_owner`.
* **Parameters:**  
  `owner` (table \| nil) — an entity or table with `userid` and `name` fields; pass `nil` to clear ownership.
* **Returns:** Nothing.

### `CopyWeighable(src_weighable)`
* **Description:** Copies weight-related data from another `Weighable` component (by invoking `OnSave` on `src_weighable` and `OnLoad` on this one).
* **Parameters:**  
  `src_weighable` (Weighable \| nil) — the source component to copy from.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes key internal fields for persistence.
* **Parameters:** None.
* **Returns:** `table` — a table containing: `weight`, `owner_userid`, `owner_name`, and `prefab_override_owner`.

### `OnLoad(data)`
* **Description:** Restores state from persisted data (typically via save/load).
* **Parameters:**  
  `data` (table \| nil) — a serialized data table produced by `OnSave`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted string suitable for debugging output (e.g., in logs or UI debug panels).
* **Parameters:** None.
* **Returns:** `string` — e.g., `"weight 45.00000 (45.00%), owner_userid 12345, override owner: nil"`.

### `OnRemoveFromEntity()`
* **Description:** Removes the `"weighable_"..type` tag when the component is removed from an entity.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `type` and `weight` setters — invokes the corresponding `ontype` and `onweight` callback functions when `type` or `weight` is updated via the metatable.  
- **Pushes:** None identified.
