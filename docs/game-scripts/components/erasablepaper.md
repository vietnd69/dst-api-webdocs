---
id: erasablepaper
title: Erasablepaper
description: This component enables an item to be erased into a specified number of new items (e.g., parchment into papyrus sheets) using an eraser.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 9e3c10de
---

# Erasablepaper

## Overview
The `ErasablePaper` component provides erase functionality for an item: when triggered (typically by an eraser tool), it destroys the current item and spawns a new item (or stack thereof), such as converting a parchment into multiple papyrus sheets. It handles stack management, item spawning, and proper item delivery (to inventory or world drop).

## Dependencies & Tags
- Requires `inst` to be an entity (typically an item) with optional `stackable` component.
- Does not add or remove tags.
- Relies on external components: `inventory`, `inventoryitem`, and `stackable` (if present on source or spawned item).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `erased_prefab` | `string` | `"papyrus"` | The prefab name of the item to spawn upon erasure. |
| `stacksize` | `number` | `1` | The total number of erased items to produce (including the first). |

## Main Functions

### `SetErasedPrefab(prefab)`
* **Description:** Sets the prefab name of the item that will be spawned when erasure occurs. Validates the prefab exists.
* **Parameters:**  
  `prefab` (string) – A valid prefab name. Throws an assertion error if the prefab is not found.

### `SetStackSize(size)`
* **Description:** Sets the total number of items to spawn during erasure (i.e., the stack size of the result).
* **Parameters:**  
  `size` (number) – An integer ≥ 1. Throws an assertion error if invalid.

### `DoErase(eraser, doer)`
* **Description:** Performs the erasure: removes the current item and spawns `stacksize` copies of the `erased_prefab`. Handles both stackable and non-stackable results via `SpawnPrefab` and `GiveOrDropItem`. Returns the first spawned item or `nil` on failure.
* **Parameters:**  
  `eraser` (entity) – The tool/entity performing the erase (used for position and logic context).  
  `doer` (entity) – The entity attempting the erase (typically a player); used to determine item delivery.  
  *Returns:* First spawned item (if successful), or `nil` if spawning fails.

## Events & Listeners
None. This component does not register event listeners or emit events.