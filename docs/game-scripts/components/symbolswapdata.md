---
id: symbolswapdata
title: Symbolswapdata
description: Stores and manages metadata about a symbol-swapped item, including its build ID, original symbol, and skin status.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 93902c00
---

# Symbolswapdata

## Overview
This component stores persistent metadata for items that have undergone symbol swapping (e.g., recipe substitutions via the "Symbol Swap" mechanic). It records the original build ID, the assigned symbol, and whether the item is skinned—enabling accurate replication and validation during network sync or item reconstruction.

## Dependencies & Tags
None identified

## Properties

| Property   | Type    | Default Value | Description                                                                 |
|------------|---------|---------------|-----------------------------------------------------------------------------|
| `inst`     | `Entity`| `nil`         | Reference to the entity the component is attached to (set in constructor). |
| `build`    | `string`| `nil`         | Unique build identifier of the item before symbol swapping.               |
| `symbol`   | `string`| `nil`         | Symbol string used in the swap (e.g., `"gears"`, `"rope"`).                |
| `is_skinned`| `boolean`| `nil`       | Whether the item is currently skinned (i.e., uses a custom texture variant). |

## Main Functions

### `SetData(build, symbol, is_skinned)`
* **Description:** Updates the component's stored metadata with new values.  
* **Parameters:**  
  - `build` (`string`): The build ID associated with the item.  
  - `symbol` (`string`): The symbol used in the swap operation.  
  - `is_skinned` (`boolean`): Indicates if the item uses a skin variant.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging, displaying all stored fields.  
* **Parameters:** None  

## Events & Listeners
None