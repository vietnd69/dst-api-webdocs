---
id: weighable
title: Weighable
description: Adds weight-based properties and ownership tracking to an entity, enabling dynamic tagging and percentage-based weight calculations.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 7f86a988
---

# Weighable

## Overview
The `Weighable` component provides entities with weight-related data (e.g., weight value, normalized percentage, and owner information) and automatically manages entity tags (`weighable_<type>`) when the weight `type` changes. It supports persistence via `OnSave`/`OnLoad`, initialization of weight bounds, and ownership attribution—particularly useful for items like trophies or loot that need to track origin and physical properties.

## Dependencies & Tags
- **Tags added/removed:** Dynamically manages `weighable_<type>` tags based on the `type` property (e.g., `weighable_medium`).
- **No internal component dependencies** are declared or inferred from the code. It relies solely on core entity APIs (`inst:AddTag`, `inst:RemoveTag`, `inst:PushEvent` is not used).
- Uses the utility functions `Remap` and `math.clamp`, which are assumed to be globally available in the game environment.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `type` | `string?` | `nil` | Optional category/tag for the entity (e.g., `"small"`, `"large"`). Triggers tag updates when changed. |
| `weight` | `number?` | `nil` | Raw weight value (e.g., in grams or arbitrary units). Store precision truncated to two decimal places when set via `SetWeight`. |
| `weight_percent` | `number?` | `nil` | Normalized weight as a float between `0.0` and `1.0`, derived from `min_weight`, `max_weight`, and `weight`. Defaults to `0.5` if min/max are missing. |
| `owner_userid` | `string?` | `nil` | User ID of the owner (set via `SetPlayerAsOwner`). |
| `owner_name` | `string?` | `nil` | Player name of the owner (set via `SetPlayerAsOwner`). |
| `prefab_override_owner` | `string?` | `nil` | Optional override for owner info; currently unused in core logic but reserved (e.g., for mobs that "catch" a trophy). |
| `min_weight` | `number?` | `nil` | Minimum weight for normalization; initialized via `Initialize`. Required for `weight_percent` calculation. |
| `max_weight` | `number?` | `nil` | Maximum weight for normalization; initialized via `Initialize`. Required for `weight_percent` calculation. |

## Main Functions

### `Initialize(min_weight, max_weight)`
* **Description:** Sets the weight range used to compute the normalized `weight_percent`. Must be called before `weight_percent` should be calculated meaningfully.
* **Parameters:**
  * `min_weight` (`number`): The lower bound of the weight range.
  * `max_weight` (`number`): The upper bound of the weight range.

### `SetWeight(weight)`
* **Description:** Sets the raw `weight` value, rounding it to two decimal places.
* **Parameters:**
  * `weight` (`number`): The new weight value.

### `SetPlayerAsOwner(owner)`
* **Description:** Assigns ownership of the entity to a specific player, storing both user ID and name. Clears any `prefab_override_owner` value.
* **Parameters:**
  * `owner` (`GamePlayer?`): A player object with `userid` and `name` properties, or `nil` to clear ownership.

### `GetWeight()`
* **Description:** Returns the current raw `weight` value.
* **Parameters:** None.

### `GetWeightPercent()`
* **Description:** Returns the normalized weight (`0.0` to `1.0`). If `min_weight`/`max_weight` are not set, returns `0.5` (the default).
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes the component’s persistent state (weight, owner, override owner) for save/load.
* **Parameters:** None.  
* **Returns:** `table`: A table containing `weight`, `owner_userid`, `owner_name`, and `prefab_override_owner`.

### `OnLoad(data)`
* **Description:** Restores the component’s state from serialized data.
* **Parameters:**
  * `data` (`table?`): Data previously returned by `OnSave`.

### `OnRemoveFromEntity()`
* **Description:** Cleans up the `weighable_<type>` tag when the component is removed from the entity.
* **Parameters:** None.

### `CopyWeighable(src_weighable)`
* **Description:** Copies weight, owner, and override data from another `Weighable` component instance by invoking its `OnSave` and loading via `OnLoad`.
* **Parameters:**
  * `src_weighable` (`Weighable?`): Source `Weighable` instance to copy from.

### `GetDebugString()`
* **Description:** Returns a formatted debug string including weight, percentage, owner ID, and override owner.
* **Parameters:** None.  
* **Returns:** `string`: Human-readable debug output.

## Events & Listeners
- Listens to property changes on `type` and `weight` via reactive setters registered in the metatable:
  - `type` → triggers `ontype(self, type, old_type)`
  - `weight` → triggers `onweight(self)`
- These are not traditional events but property change hooks. No explicit `ListenForEvent` or `PushEvent` calls are present.