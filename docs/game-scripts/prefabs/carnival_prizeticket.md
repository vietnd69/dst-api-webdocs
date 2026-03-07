---
id: carnival_prizeticket
title: Carnival Prizeticket
description: A stackable, floatable inventory item that serves as a consumable fuel source and cat toy in DST, dynamically adjusting its animation and inventory image based on stack size.
tags: [inventory, fuel, stackable, toy]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9696062d
system_scope: inventory
---

# Carnival Prizeticket

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`carnival_prizeticket` is a lightweight, stackable inventory item Prefab used in DST as a small fuel source and cat toy. It supports automatic stacking via `stackable`, fuel burning via `fuel` and `burnable`, and floatable physics. It dynamically updates its animation state and inventory image (via `inventoryitem.imagename`) depending on whether it is alone (`_smallstack`) or fully stacked (`_largestack`), and triggers stack merging when landed. It also integrates with the Hauntable system for posthumous effects.

## Usage example
```lua
local ticket = SpawnPrefab("carnival_prizeticket")
ticket.Transform:SetPosition(x, y, z)
ticket.components.stackable:Put(another_ticket)
ticket.components.fuel:Burn() -- if added to a fire
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `stackable`, `fuel`, `burnable`, `propagator`, `hauntable`, `floatable`, `physics`
**Tags:** Adds `cattoy`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `imagename` | string | `"carnival_prizeticket"` (updated to `"carnival_prizeticket_smallstack"` or `"carnival_prizeticket_largestack"`) | Current image asset used in inventory; set by `ChangeImageName()` on stack change. |
| `fuelvalue` | number | `TUNING.TINY_FUEL` | Amount of fuel provided when burned. |
| `maxsize` | number | `TUNING.STACK_SIZE_TINYITEM` | Maximum items allowed in a stack. |

## Main functions
### `GetAnimStateForStackSize(inst, stacksize)`
*   **Description:** Returns the animation suffix (e.g., `""`, `"_smallstack"`, `"_largestack"`) based on `stacksize`.
*   **Parameters:**  
    `stacksize` (number) — current stack count.
*   **Returns:**  
    `""` if `stacksize == 1`, `"_largestack"` if `stacksize > 5`, otherwise `"_smallstack"`.

### `OnStackSizeChanged(inst, data)`
*   **Description:** Handles animation and inventory image updates when the stack size changes. Initiates a `jostle` animation followed by `idle` if it's a non-population change.
*   **Parameters:**  
    `data` (table, optional) — contains `stacksize` and `oldstacksize` keys.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `data` is `nil`.

### `GetStatus(inst)`
*   **Description:** Returns a status string used by `inspectable` to display the item’s category in UI tooltips.
*   **Parameters:** None.
*   **Returns:**  
    `"GENERIC"` concatenated with the animation suffix from `GetAnimStateForStackSize`, e.g., `"GENERIC_largestack"`.

### `MergeStacks(inst)`
*   **Description:** Finds a nearby landed stackable item of the same prefab/skin and attempts to merge them using `stackable:Put()`.
*   **Parameters:** None.
*   **Returns:** Nothing (side effect only).
*   **Error states:** No effect if no compatible stack is found or if item is in limbo (`INLIMBO` tag).

### `TryMergeStacks(inst)`
*   **Description:** Schedules `MergeStacks` to run after `0.1` seconds, typically invoked after landing.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `on_landed` — triggers stack merging after a short delay via `TryMergeStacks`.  
  `stacksizechange` — triggers `OnStackSizeChanged` to update animations and inventory image.  
- **Pushes:** None directly.