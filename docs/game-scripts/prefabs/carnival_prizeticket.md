---
id: carnival_prizeticket
title: Carnival Prizeticket
description: Defines the carnival prize ticket prefab, a stackable inventory item that can be used as fuel and merges with nearby landed tickets.
tags: [inventory, item, carnival, stackable]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: b207f1d0
system_scope: inventory
---

# Carnival Prizeticket

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`carnival_prizeticket` is a stackable inventory item prefab used during carnival events. It supports stacking up to `TUNING.STACK_SIZE_TINYITEM`, can be burned as fuel with `TUNING.TINY_FUEL` value, and automatically merges with nearby landed tickets of the same type. The prefab updates its animation and inventory image based on current stack size, displaying different visuals for single items, small stacks, and large stacks.

## Usage example
```lua
-- Spawn a carnival prize ticket
local ticket = SpawnPrefab("carnival_prizeticket")

-- Access component properties
local stacksize = ticket.components.stackable:StackSize()
local fuelvalue = ticket.components.fuel.fuelvalue
local maxstack = ticket.components.stackable.maxsize

-- Check inspection status (GetStatus expects entity instance, not called as method)
local status = ticket.components.inspectable.getstatus(ticket)
```

## Dependencies & tags
**Components used:**
- `inventoryitem` -- handles inventory storage and image name changes based on stack size
- `inspectable` -- provides inspection status via GetStatus function
- `stackable` -- enables item stacking with maxsize set to TUNING.STACK_SIZE_TINYITEM
- `fuel` -- allows item to be burned with fuelvalue set to TUNING.TINY_FUEL

**Tags:**
- `cattoy` -- added to entity for categorization

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_TINYITEM` | Maximum stack size for prize tickets. |
| `fuel.fuelvalue` | number | `TUNING.TINY_FUEL` | Fuel value when burned in fire. |

## Main functions
### `GetStatus(inst)`
* **Description:** Returns the inspection status string for the prize ticket, incorporating the current stack size animation state.
* **Parameters:** `inst` -- entity instance with inspectable component.
* **Returns:** String in format `"GENERIC"` plus animation state suffix (empty, `"_smallstack"`, or `"_largestack"`).
* **Error states:** Errors if `inst.replica.stackable` is nil (no stackable component or not networked properly).

### `OnStackSizeChanged(inst, data)`
* **Description:** Handles stack size change events, updating animation and inventory image based on new stack size. Plays jostle animation for stacks greater than 1 when not populating.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table containing `stacksize`, `oldstacksize`, and `src_pos` fields
* **Returns:** None
* **Error states:** None

### `MergeStacks(inst)`
* **Description:** Finds nearby landed prize tickets within 1 unit distance and merges the current stack into them if space is available.
* **Parameters:** `inst` -- entity instance to merge from.
* **Returns:** None
* **Error states:** Errors if `inst.components.stackable` is nil (no guard present before accessing in CanMergeTestFn).

### `TryMergeStacks(inst)`
* **Description:** Schedules MergeStacks to execute after 0.1 seconds, allowing time for physics to settle before merging.
* **Parameters:** `inst` -- entity instance.
* **Returns:** None
* **Error states:** None

### `GetAnimStateForStackSize(inst, stacksize)`
* **Description:** Returns the animation state suffix based on stack size for selecting appropriate animations and images.
* **Parameters:**
  - `inst` -- entity instance (unused in function body)
  - `stacksize` -- current number of items in stack
* **Returns:** String suffix: `""` for stacksize `== 1`, `"_largestack"` for stacksize `> 5`, `"_smallstack"` otherwise.
* **Error states:** None

### `fn()`
* **Description:** Prefab constructor function that creates the carnival prize ticket entity, adds required components, and sets up event listeners. Returns early on clients before component setup.
* **Parameters:** None
* **Returns:** Entity instance
* **Error states:** None

## Events & listeners
- **Listens to:** `on_landed` -- triggers TryMergeStacks to attempt merging with nearby tickets after landing.
- **Listens to:** `stacksizechange` -- triggers OnStackSizeChanged to update animations and images when stack size changes.