---
id: harvestable
title: Harvestable
description: Manages the growth, harvesting state, and interactability of an entity that can be harvested for produce over time.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 316960f3
---

# Harvestable

## Overview
The `Harvestable` component controls the lifecycle of an entity that produces resources through a timed growth process. It handles growth scheduling, produce accumulation up to a maximum, and the logic for harvesting produce by players or other actors. It dynamically manages the `"harvestable"` tag on its entity based on current produce and enabled state.

## Dependencies & Tags
**Dependencies:**
- `health` (not directly required by this component, but harvestable entities often use it)
- `inventory` (on the harvester for item distribution)
- `inventoryitem` (on dropped loot for wetness inheritance)

**Tags:**
- Adds `"harvestable"` when `enabled == true` and `produce > 0`
- Removes `"harvestable"` otherwise (including on removal from entity)

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `produce` | `number` | `0` | Current amount of produce (0 to `maxproduce`). |
| `maxproduce` | `number` | `1` | Maximum produce count before growth stops. |
| `growtime` | `number` (seconds) | `nil` | Duration (in seconds) between growth steps. |
| `product` | `string` (prefab name) | `nil` | Prefab name of item produced per growth step. |
| `enabled` | `boolean` | `true` | If `false`, growth is paused and entity is not harvestable. |
| `task` | `Task` | `nil` | Internal scheduled task for growth progression. |
| `targettime` | `number` (Unix time) | `nil` | Wall-clock time when next growth step is scheduled. |
| `pausetime` | `number` (seconds) | `nil` | Remaining grow time when growth was paused. |
| `ongrowfn` | `function?` | `nil` | Callback invoked on each growth step. |
| `onharvestfn` | `function?` | `nil` | Callback invoked upon harvesting. |
| `can_harvest_fn` | `function?` | `nil` | Custom check function to override harvest eligibility. |
| `domagicgrowthfn` | `function?` | `nil` | Custom magic growth function (e.g., for instant growth). |

## Main Functions

### `Harvestable:SetUp(product, max, time, onharvest, ongrow)`
* **Description:** Initializes the harvestable with all core settings in one call. Sets product prefab, max produce, grow time, and both callback functions.
* **Parameters:**
  - `product`: `string` — Prefab name of the item spawned per produce unit.
  - `max`: `number` (optional, default `1`) — Max number of produce units.
  - `time`: `number` — Grow time per unit (seconds).
  - `onharvest`: `function?` — Callback `(inst, picker, produce)` triggered on harvest.
  - `ongrow`: `function?` — Callback `(inst, current_produce)` triggered after each growth step.

### `Harvestable:SetProduct(product, max)`
* **Description:** Sets the product prefab and maximum produce amount, and resets current produce to `0`.
* **Parameters:**
  - `product`: `string` — Prefab name.
  - `max`: `number` (optional) — Max produce. Defaults to `1`.

### `Harvestable:SetGrowTime(time)`
* **Description:** Sets the duration (seconds) required for one growth step.
* **Parameters:**
  - `time`: `number` — Grow time per unit.

### `Harvestable:CanBeHarvested()`
* **Description:** Returns `true` if the entity can currently be harvested (i.e., `enabled == true` and `produce > 0`).
* **Returns:** `boolean`

### `Harvestable:Harvest(picker)`
* **Description:** Harvests all current produce, spawns the configured product prefabs, distributes them to the harvester (if inventory exists), and resets produce to `0`. Then restarts the growth cycle. Respects `can_harvest_fn` if defined.
* **Parameters:**
  - `picker`: `Entity?` — The entity performing the harvest. May be `nil` (e.g., natural decay or other system).
* **Returns:**
  - `true` if successfully harvested.
  - `false, fail_reason` if `can_harvest_fn` rejected the harvest.

### `Harvestable:StartGrowing(time)`
* **Description:** Begins or resumes the growth cycle. If `time` is provided, uses it; otherwise uses `pausetime` (if set) or `growtime`. Cancels any pending task and schedules the next `Grow()` call.
* **Parameters:**
  - `time`: `number?` (seconds) — Optional override grow time.

### `Harvestable:PauseGrowing()`
* **Description:** Pauses growth by cancelling the scheduled task and storing remaining time in `pausetime`. Does *not* reset `produce`.
* **Parameters:** None.

### `Harvestable:StopGrowing()`
* **Description:** Stops growth by cancelling the scheduled task and clearing `targettime` and `pausetime`.
* **Parameters:** None.

### `Harvestable:Grow()`
* **Description:** Attempts to increase `produce` by 1. Calls `ongrowfn` if defined. Schedules the next growth step if not at `maxproduce`.
* **Returns:** `true` if produce increased; `false` if already at max.

### `Harvestable:Enable()` / `Harvestable:Disable()`
* **Description:** Enables/disables harvesting and resumes/pauses growth respectively. `Enable()` calls `StartGrowing()`, `Disable()` calls `PauseGrowing()`.
* **Parameters:** None.

### `Harvestable:SetDoMagicGrowthFn(fn)` & `Harvestable:DoMagicGrowth(doer)`
* **Description:** Allows defining and executing custom instant-growth logic (e.g., fertilizer use). `DoMagicGrowth` invokes the stored function.
* **Parameters:**
  - `fn`: `function?` — Signature: `(inst, doer)`.
  - `doer`: `Entity` — The entity triggering magic growth.

### `Harvestable:IsMagicGrowable()`
* **Description:** Returns `true` if `domagicgrowthfn` is set.
* **Returns:** `boolean`

### `Harvestable:OnSave()` / `Harvestable:OnLoad(data)`
* **Description:** Serialize/deserialize growth state (remaining time, produce, pause info) for network save/load.
* **Parameters:**
  - `data`: `table` — Data from `OnSave()` for loading.

### `Harvestable:GetDebugString()`
* **Description:** Returns a human-readable debug string (e.g., `"2 apple grown (5.2)"`).
* **Returns:** `string`

## Events & Listeners
- Listens to `"produce"` property changes → invokes `onproduce()` to update `"harvestable"` tag.
- Listens to `"enabled"` property changes → invokes `onenabled()` to update `"harvestable"` tag.
- On component removal (`OnRemoveFromEntity`) → removes `"harvestable"` tag.
- Triggers `"harvestsomething"` event on harvester (via `PushEvent`) upon successful harvest.