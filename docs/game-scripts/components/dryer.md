---
id: dryer
title: Dryer
description: Manages the drying process of ingredients into preserved food products, handling timers, rain exposure, and state transitions.
tags: [crafting, inventory, preservation, weather, food]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 280954f0
system_scope: entity
---

# Dryer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Dryer` manages the transformation of a "dryable" ingredient into a preserved product (e.g., jerky from meat), simulating drying time and environmental sensitivity to rain. It interacts with `dryable`, `perishable`, `edible`, `inventory`, `inventoryitem`, and `rainimmunity` components to control drying progression, spoilage upon interruption, and item inheritance of moisture. The component is typically attached to entities like the Drying Rack or dehydrator devices that serve as drying stations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("dryer")

-- Attach to an entity that holds dryable ingredients (e.g., a rack)
local dryable_item = GetDryableIngredient() -- Assume this returns an entity with dryable component
inst.components.dryer:SetStartDryingFn(function(entity) print("Drying started!") end)
inst.components.dryer:SetDoneDryingFn(function(entity, product) print("Drying finished!") end)
inst.components.dryer:StartDrying(dryable_item)
```

## Dependencies & tags
**Components used:** `dryable`, `perishable`, `edible`, `inventory`, `inventoryitem`, `rainimmunity`  
**Tags:** Adds/Removes `dried`, `drying`, `candry` based on state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ingredient` | string or nil | `nil` | Prefab name of the current drying ingredient. |
| `product` | string or nil | `nil` | Prefab name of the resulting dried product. |
| `buildfile` | string or nil | `nil` | Networked build filename of the ingredient. |
| `dried_buildfile` | string or nil | `nil` | Networked build filename of the product. |
| `foodtype` | `FOODTYPE` enum or nil | `nil` | Food type of the product, inherited from the ingredient. |
| `remainingtime` | number or nil | `nil` | Time remaining for current phase (drying or spoilage). |
| `tasktotime` | number or nil | `nil` | Absolute world time when the current phase ends. |
| `task` | Task or nil | `nil` | Task handle for timer events. |
| `onstartdrying` | function or nil | `nil` | Callback invoked when drying starts. |
| `ondonedrying` | function or nil | `nil` | Callback invoked when drying completes. |
| `onharvest` | function or nil | `nil` | Callback invoked when item is harvested. |
| `protectedfromrain` | boolean or nil | `nil` | If `true`, disables rain sensitivity. |
| `watchingrain` | boolean or nil | `nil` | Whether the component listens to rain state. |
| `ingredientperish` | number | `100` (default override) | Perish percentage of ingredient at start. |

## Main functions
### `CanDry(dryable)`
* **Description:** Checks whether this dryer can accept a dryable item for processing. Requires no active product and a valid dryable component.
* **Parameters:** `dryable` (Entity or nil) – Entity to be dried.
* **Returns:** `true` if drying can begin, otherwise `false`.

### `StartDrying(dryable)`
* **Description:** Begins the drying process for a valid dryable item. Removes the ingredient from the world, initializes state, and starts the drying timer. Handles rain exposure.
* **Parameters:** `dryable` (Entity) – Entity with a `dryable` component to process.
* **Returns:** `true` if drying started successfully, otherwise `false`.
* **Error states:** Returns `false` and clears state if ingredient/product/remaining time is `nil` after read.

### `StopDrying(reason)`
* **Description:** Interrupts drying and spawns a result based on `reason`. If `"fire"`, spawns the product. Otherwise, either finalizes drying (if `ingredient` still present) or triggers spoilage.
* **Parameters:** `reason` (string) – One of `"fire"` or other (e.g., `"manual"`).
* **Returns:** Nothing.

### `Harvest(harvester)`
* **Description:** Transfers the dried product into the harvester’s inventory and finalizes the drying cycle.
* **Parameters:** `harvester` (Entity or nil) – Entity with `inventory` component to receive item.
* **Returns:** `true` if harvest succeeded, otherwise `false`.
* **Error states:** Returns `false` if not `IsDone()`, or harvester is `nil` / lacks inventory.

### `DropItem()`
* **Description:** Spawns a loose item (ingredient or product, depending on state) into the world at the dryer’s position, preserving partial progress (perish percentage).
* **Parameters:** None.
* **Returns:** `true`.

### `Pause()`
* **Description:** Pauses the current phase (drying or spoilage) by canceling active tasks and saving remaining time as `remainingtime`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Resume()`
* **Description:** Restarts a paused phase by rescheduling a task to complete in `remainingtime` seconds.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetTimeToDry()`
* **Description:** Returns time remaining until drying completes (only meaningful while drying).
* **Parameters:** None.
* **Returns:** number – Time in seconds; `0` if not drying.

### `GetTimeToSpoil()`
* **Description:** Returns time remaining until spoilage (only meaningful when dried/paused).
* **Parameters:** None.
* **Returns:** number – Time in seconds; `0` if no spoilage pending.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string describing current state and timing.
* **Parameters:** None.
* **Returns:** string – e.g., `"DRYING beef_jerky generic PAUSED drytime: 10.50 spoiltime: 0.00"`.

### `OnSave()`
* **Description:** Returns a serializable table of persistent state for saving. Only includes data if drying or product exists.
* **Parameters:** None.
* **Returns:** table or `nil`.

### `OnLoad(data)`
* **Description:** Restores state from save data, resumes timer, and invokes appropriate callbacks.
* **Parameters:** `data` (table) – Save data payload.
* **Returns:** Nothing.

### `LongUpdate(dt)`
* **Description:** Called during world updates; handles long-duration timers when paused (e.g., server-side updates). Not used for precise client timing.
* **Parameters:** `dt` (number) – Delta time in seconds.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"israining"` (world state) – triggers `Pause`/`Resume` based on rain state.  
  - `"gainrainimmunity"` – resumes drying if rain immunity is gained.  
  - `"loserainimmunity"` – pauses if vulnerable to rain *and* it is raining.
- **Pushes:** None directly (callbacks like `onstartdrying`, `ondonedrying`, `onharvest` are invoked inline, not as events).
