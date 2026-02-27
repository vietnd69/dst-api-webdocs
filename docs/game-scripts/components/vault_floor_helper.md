---
id: vault_floor_helper
title: Vault Floor Helper
description: Provides server-side logic to track and determine whether a given world position falls within the currently active vault floor area, using a marker entity to define the vault's center and dimensions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: cb3ba120
---

# Vault Floor Helper

## Overview
This component enables the game to dynamically track and query whether a point lies inside the currently active vault floor region. It stores networked state—such as whether the vault is active and its origin coordinates—via `vault_active`, `vault_origin_x`, and `vault_origin_z` network variables, and maintains a reference to a marker entity that defines the vault’s center. The core functionality is implemented in `IsPointInVaultRoom_Internal`, which performs an axis-aligned bounding box check against three overlapping rectangular/square zones (horizontal, vertical, and central square) based on predefined tile-scale dimensions.

## Dependencies & Tags
- Uses `net_bool`, `net_float` network variable constructors tied to `inst.GUID`.
- Does **not** add or remove any entity tags.
- Does **not** declare or require any other components on `self.inst`.
- Relies on external constants: `TILE_SCALE`, `TheWorld`, `TheWorld.Map`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component is attached to (typically a world or map entity). |
| `vault_active` | `net_bool` | `false` | Networked boolean indicating whether the vault floor is currently active. |
| `vault_origin_x` | `net_float` | `0.0` | Networked float storing the X world-coordinate of the vault’s origin (center point). |
| `vault_origin_z` | `net_float` | `0.0` | Networked float storing the Z world-coordinate of the vault’s origin. |
| `marker` | `Entity?` | `nil` | Optional reference to the marker entity currently defining the vault origin. |

## Main Functions

### `self:IsPointInVaultRoom_Internal(x, y, z)`
* **Description:** Determines whether the given world position `(x, y, z)` lies inside the vault’s active area. The Y coordinate is unused; only X and Z are considered. This method is intended to be called indirectly via `Map:IsPointInVaultRoom`, *not* directly.
* **Parameters:**  
  - `x` (`number`): World X coordinate of the point to test.  
  - `y` (`number`): World Y coordinate (ignored in current implementation).  
  - `z` (`number`): World Z coordinate of the point to test.  
  *Returns:* `true` if the point falls within any of the three defined vault regions (horizontal bar, vertical bar, or central square); otherwise `false`.

### `self:TryToSetMarker(inst)`
* **Description:** Assigns or replaces the vault marker entity. If a marker already exists, it removes the new one; if none exists, it sets the new marker as active, records its world position as the new origin, marks the vault as active, and attaches an `onremove` listener to reset state when the marker is removed.
* **Parameters:**  
  - `inst` (`Entity`): The candidate marker entity (usually a vault marker prefab instance).  

## Events & Listeners
- Listens for `"onremove"` event on the `marker` entity via `inst:ListenForEvent("onremove", self.OnRemove_Marker)`.
  - When triggered, invokes `self.OnRemove_Marker(ent, data)` to clear `self.marker` and deactivate the vault (resetting `vault_active`, `vault_origin_x`, and `vault_origin_z` to default values).