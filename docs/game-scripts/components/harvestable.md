---
id: harvestable
title: Harvestable
description: Manages plant-like entities that grow over time and can be harvested to yield items, handling growth progress, pausing, and item dropping.
tags: [growth, harvesting, production, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 316960f3
system_scope: environment
---

# Harvestable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Harvestable` component enables entities (typically plants or crops) to grow incrementally over time and be harvested for reward items. It tracks growth progress, manages timers, and coordinates item generation upon harvest. The component automatically maintains the `harvestable` tag on its host entity based on production state (`produce > 0` and `enabled`). It works closely with the `inventory` component to distribute harvested items to harvesters and uses `inventoryitem:InheritWorldWetnessAtTarget` to propagate world wetness to dropped items.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("harvestable")

inst.components.harvestable:SetUp(
    "cactusflower", -- product prefab name
    3,              -- max produce count
    120,            -- grow time in seconds
    function(inst, picker, amount) print("Harvested " .. amount .. " items") end,
    function(inst, current) print("Grew to " .. current) end
)
```

## Dependencies & tags
**Components used:** `inventory`, `inventoryitem` (via `InheritWorldWetnessAtTarget` and `GiveItem`)
**Tags:** Adds `harvestable` when `enabled` and `produce > 0`; removes it otherwise.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `produce` | number | `0` | Current number of items ready to harvest. |
| `maxproduce` | number | `1` | Maximum number of items this entity can produce. |
| `growtime` | number or `nil` | `nil` | Time in seconds required to produce one item. |
| `product` | string or `nil` | `nil` | Prefab name of the item to drop on harvest. |
| `enabled` | boolean | `true` | Whether growth is active. |
| `targettime` | number or `nil` | `nil` | Internal timestamp for scheduled growth tick. |
| `pausetime` | number or `nil` | `nil` | Remaining grow time when growth was paused. |
| `can_harvest_fn` | function or `nil` | `nil` | Optional custom predicate function to validate harvest eligibility. |
| `domagicgrowthfn` | function or `nil` | `nil` | Optional function for instant-growth via magic effects. |
| `ongrowfn` | function or `nil` | `nil` | Callback invoked when production increments. |
| `onharvestfn` | function or `nil` | `nil` | Callback invoked after harvest completes. |

## Main functions
### `SetUp(product, max, time, onharvest, ongrow)`
*   **Description:** Configures core harvest behavior: what item is produced, how many times, how long each step takes, and optional callbacks.
*   **Parameters:**
    *   `product` (string) – Name of the item prefab to produce on harvest.
    *   `max` (number) – Maximum number of items to produce before full growth (default `1`).
    *   `time` (number) – Duration in seconds for each growth step.
    *   `onharvest` (function) – Optional callback `(inst, picker, amount)` triggered after items are dropped.
    *   `ongrow` (function) – Optional callback `(inst, current_produce)` triggered when production increments.
*   **Returns:** Nothing.
*   **Error states:** None; invalid values result in no growth (e.g., `nil` or `0` grow time).

### `SetProduct(product, max)`
*   **Description:** Sets the product prefab and maximum production count; resets current produce to `0`.
*   **Parameters:**
    *   `product` (string) – Prefab name of harvestable item.
    *   `max` (number or `nil`) – Maximum produce count (defaults to `1`).
*   **Returns:** Nothing.

### `SetGrowTime(time)`
*   **Description:** Sets the duration (in seconds) required to produce one unit.
*   **Parameters:** `time` (number or `nil`) – Time per growth step.
*   **Returns:** Nothing.

### `CanBeHarvested()`
*   **Description:** Determines whether the entity is currently harvestable.
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if `enabled` and `produce > 0`.
*   **Error states:** None.

### `Harvest(picker)`
*   **Description:** Attempts to harvest the product. Drops `produce` copies of the `product` prefab to the harvester or world, resets produce count, and restarts growth.
*   **Parameters:** `picker` (entity or `nil`) – The entity performing the harvest.
*   **Returns:** `boolean` – `true` if harvest succeeded; otherwise `false`.
*   **Error states:**
    *   Returns `false` if `CanBeHarvested()` fails or `can_harvest_fn` (if set) returns `false`.
    *   Drops items to `picker` if possible; otherwise drops to world at entity position.

### `StartGrowing([time])`
*   **Description:** Schedules the next growth tick using `DoTaskInTime`, resuming from a pause or starting fresh.
*   **Parameters:** `time` (number or `nil`) – Optional override of grow time; uses `pausetime`, `growtime`, or `time` in that order.
*   **Returns:** Nothing.
*   **Error states:** None; does nothing if `time` is `nil`.

### `PauseGrowing()`
*   **Description:** Cancels the pending growth task and stores remaining time in `pausetime`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopGrowing()`
*   **Description:** Cancels the pending growth task and discards timing data (no resume).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Disable()`
*   **Description:** Pauses growth and sets `enabled` to `false`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Enable()`
*   **Description:** Resumes growth (restarts from current progress) and sets `enabled` to `true`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetCanHarvestFn(fn)`
*   **Description:** Assigns a custom predicate function called before harvesting.
*   **Parameters:** `fn` (function) – Signature `(inst, picker)` returning `can_harvest: boolean, fail_reason: string?`.
*   **Returns:** Nothing.

### `SetDoMagicGrowthFn(fn)`
*   **Description:** Assigns a function for instant-growth (e.g., via magic).
*   **Parameters:** `fn` (function) – Signature `(inst, doer)`.
*   **Returns:** Nothing.

### `IsMagicGrowable()`
*   **Description:** Checks if a magic-growth function is assigned.
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if `domagicgrowthfn` is set.
*   **Error states:** None.

### `DoMagicGrowth(doer)`
*   **Description:** Invokes the magic-growth function, if assigned.
*   **Parameters:** `doer` (entity) – The entity triggering magic growth.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes growth state for saving (time remaining, produce count, pause state).
*   **Parameters:** None.
*   **Returns:** `table` – `{ time = remaining_seconds?, pausetime = number?, produce = number }`.

### `OnLoad(data)`
*   **Description:** Restores growth state from saved data.
*   **Parameters:** `data` (table) – Data returned by `OnSave`.
*   **Returns:** Nothing.

### `Grow()`
*   **Description:** Increments production count, triggers `ongrowfn`, and schedules next growth step if not maxed.
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if growth occurred; `false` if at max production.

### `GetDebugString()`
*   **Description:** Returns a human-readable status string for debugging.
*   **Parameters:** None.
*   **Returns:** `string` – e.g., `"2 cactusflower grown (15)"` or `"1 cactusflower grown (paused: 30)"`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
- **Tag changes:** Adds/removes `"harvestable"` tag in response to `produce`/`enabled` state via `onproduce` and `onenabled` callbacks.
