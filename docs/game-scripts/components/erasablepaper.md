---
id: erasablepaper
title: Erasablepaper
description: Manages the conversion of a paper item into a configurable number of erasure产物 (e.g., papyrus), handling stack splitting and item distribution.
tags: [inventory, utility, conversion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9e3c10de
system_scope: inventory
---

# Erasablepaper

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ErasablePaper` enables certain paper-based items to be "erased" into a specified number of new items (e.g., turning a `paper` into `papyrus`). It integrates with `inventory`, `inventoryitem`, and `stackable` components to ensure proper item spawning, stacking, and delivery to the doer (actor performing the erasure). This component is typically attached to paper-like prefabs that serve as inputs in crafting or erasure mechanics.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("erasablepaper")
inst.components.erasablepaper:SetErasedPrefab("papyrus")
inst.components.erasablepaper:SetStackSize(3)
-- Later, when erasing is triggered:
inst.components.erasablepaper:DoErase(eraser_entity, doer_entity)
```

## Dependencies & tags
**Components used:** `inventory`, `inventoryitem`, `stackable`, `transform`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `erased_prefab` | string | `"papyrus"` | The prefab name of the item produced upon erasure. Must correspond to an entry in `Prefabs`. |
| `stacksize` | number | `1` | The number of `erased_prefab` items to produce. Must be ≥ 1. |

## Main functions
### `SetErasedPrefab(prefab)`
*   **Description:** Sets the prefab name that will be spawned as the erasure product.
*   **Parameters:** `prefab` (string) – the name of the prefab to produce.
*   **Returns:** Nothing.
*   **Error states:** Throws an assertion error if `prefab` is not present in the global `Prefabs` table.

### `SetStackSize(size)`
*   **Description:** Configures how many copies of the erased item to produce.
*   **Parameters:** `size` (number) – the number of items to produce (minimum `1`).
*   **Returns:** Nothing.
*   **Error states:** Throws an assertion error if `size` is less than `1`.

### `DoErase(eraser, doer)`
*   **Description:** Performs the erasure: consumes the current item and spawns and delivers the configured number of new items. Handles both stackable and non-stackable products.
*   **Parameters:**  
  `eraser` (Entity or `nil`) – the entity performing the erasure (used for position and ownership).  
  `doer` (Entity or `nil`) – the entity receiving the resulting items (typically the player). If `nil`, items are dropped at position.
*   **Returns:** The first spawned product entity (or `nil` if erasure fails).
*   **Error states:**  
  - Returns `nil` immediately if spawning the `erased_prefab` fails or if the spawned item lacks `inventoryitem`.  
  - The original item (`self.inst`) is always removed before returning, even on partial failure (though full failure is prevented by the early `nil` return).

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.

(No events are emitted directly by this component.)
