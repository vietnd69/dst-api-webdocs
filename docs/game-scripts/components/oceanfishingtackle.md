---
id: oceanfishingtackle
title: Oceanfishingtackle
description: Stores and manages configurable casting parameters and lure setup data for ocean fishing tackle in DST.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: e48bcd05
---

# Oceanfishingtackle

## Overview
This component holds configuration data related to ocean fishing tackle, including casting behavior parameters and lure-specific setup. It acts as a data container for transient or per-item fishing settings, primarily used during the casting and lure application phases of ocean fishing mechanics. It does not perform active logic itself but provides data to other fishing-related systems.

## Dependencies & Tags
None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | Reference to the entity the component is attached to. |
| `projectile_prefab` | `string?` | `nil` | Prefab name for the projectile used when casting this tackle. |
| `casting_data` | `table` | `{ dist_max = 5, max_dist_offset = 1, max_angle_offset = 20 }` | Table defining casting geometry limits: max cast distance, positional deviation, and angular deviation (in degrees). |
| `lure_data` | `table?` | `nil` | Reference to the lure's raw data table (set via `SetSetupLure`). |
| `lure_setup` | `table?` | `nil` | Full setup data passed to `SetSetupLure`, used to determine item properties like `single_use`. |

> **Note**: Properties are initialized via constructor and subsequent method calls; no `_fn()` lifecycle hooks are present.

## Main Functions

### `SetCastingData(data, projectile_prefab)`
* **Description:** Updates the casting configuration and projectile prefab reference for this tackle.
* **Parameters:**
  * `data` (`table`): A table containing casting parameters (e.g., `dist_max`, `max_dist_offset`, `max_angle_offset`). Expected structure matches the default value.
  * `projectile_prefab` (`string?`): The name of the prefab to use as the projectile when this tackle is cast.

### `SetupLure(data)`
* **Description:** Assigns lure-specific data and full setup context to the component, typically called when a lure is applied to a tackle item.
* **Parameters:**
  * `data` (`table`): A table containing at least a `lure_data` key (the lure's data) and potentially other metadata.

### `IsSingleUse()`
* **Description:** Returns whether the current lure/tackle combination is single-use.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `lure_setup.single_use` is truthy, otherwise `false`.

## Events & Listeners
None.