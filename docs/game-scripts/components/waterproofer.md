---
id: waterproofer
title: Waterproofer
description: This component grants an entity water resistance by preventing moisture accumulation and tagging it as waterproof, typically used on items equipped by the player.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 372be258
---

# Waterproofer

## Overview
The `WaterProofer` component enables an entity (typically an inventory item such as a Rain Coat or Umbrella) to provide water resistance. When attached to an item, it disables moisture detection for that item and adds the `"waterproofer"` tag. When removed, it restores moisture support and removes the tag. It also exposes getter/setter methods for an `effectiveness` multiplier, although current usage suggests a fixed value of `1`.

## Dependencies & Tags
- **Component Dependency:** `inventoryitem` — the component must be present on the entity for moisture handling to be modified.
- **Tag Added:** `"waterproofer"` — added in the constructor and removed upon entity detachment.
- **Tag Removed:** `"waterproofer"` — handled in `OnRemoveFromEntity`.

## Properties
| Property      | Type   | Default Value | Description                                                                 |
|---------------|--------|---------------|-----------------------------------------------------------------------------|
| `inst`        | `Entity` | —             | Reference to the entity the component is attached to (inherited from `Class`). |
| `effectiveness` | `number` | `1`           | Multiplier for water resistance effectiveness; currently unused beyond 1.    |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Clean-up callback invoked when the component is removed from its entity. It restores the item’s moisture sensitivity by re-enabling moisture detection and removes the `"waterproofer"` tag.
* **Parameters:** None (automatically called by the ECS).

### `GetEffectiveness()`
* **Description:** Returns the current water resistance effectiveness value.
* **Parameters:** None.

### `SetEffectiveness(val)`
* **Description:** Sets the water resistance effectiveness value.
* **Parameters:**  
  `val` (number) — The new effectiveness value to assign.

## Events & Listeners
None identified.