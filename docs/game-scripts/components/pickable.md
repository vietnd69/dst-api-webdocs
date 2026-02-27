---
id: pickable
title: Pickable
description: Manages the lifecycle of harvestable objects—including growth, picking, regeneration, and fertility—by tracking state, timers, and interactability.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 071825aa
---

# Pickable

## Overview
The `Pickable` component governs harvestable entities in the game world, handling their growth cycles (including regrowth timers), interaction constraints, regeneration logic, fertilization, and product spawning upon harvesting. It dynamically manages entity tags (`pickable`, `barren`, `quickpick`, `jostlepick`) and integrates with world time and task scheduling to support dynamic regrowth behavior.

## Dependencies & Tags
- **Tags managed:** `pickable`, `barren`, `quickpick`, `jostlepick`
- **Tag removal on component removal:** All four tags (`pickable`, `barren`, `quickpick`, `jostlepick`) are removed when the component is removed from the entity.
- **Common external component interactions:**
  - `burnable` (used in `Fertilize` to stop smoldering)
  - `lootdropper` (used in `SpawnProductLoot`)
  - `witherable` (used in `Fertilize`, `OnSave`, `OnLoad`, and `MakeEmpty`)
- **No internal `inst:AddComponent(...)` calls**, but relies on presence of optional components during runtime.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `canbepicked` | `boolean?` | `nil` | Indicates if the object can currently be picked. Changed via `Regen()` and `MakeEmpty()`/`Pick()`. |
| `regentime` | `number?` | `nil` | Current regrowth duration (may be modified by `SpringGrowthMod`). |
| `baseregentime` | `number?` | `nil` | Base regrowth duration (original, unmodified). |
| `product` | `string?` | `nil` | Prefab name of the item dropped upon picking. |
| `onregenfn` | `function?` | `nil` | Callback invoked when regrowth completes (`Regen()`). |
| `onpickedfn` | `function?` | `nil` | Callback invoked after picking (`Pick()`). |
| `makeemptyfn` | `function?` | `nil` | Callback invoked when making empty (start of regrowth). |
| `makefullfn` | `function?` | `nil` | Callback invoked when regenerating ( Becomes `canbepicked`). |
| `cycles_left` | `number?` | `nil` | Remaining harvest cycles for transplanted plants. |
| `max_cycles` | `number?` | `nil` | Maximum harvest cycles for transplanted plants. |
| `transplanted` | `boolean` | `false` | True if the object has been transplanted (and consumes cycles on harvest). |
| `caninteractwith` | `boolean` | `true` | Controls whether the entity is currently interactable. |
| `numtoharvest` | `number` | `1` | Number of items produced per harvest. |
| `quickpick` | `boolean` | `false` | If true, adds `quickpick` tag to the entity. |
| `jostlepick` | `boolean` | `false` | If true, adds `jostlepick` tag to the entity. |
| `wildfirestarter` | `boolean` | `false` | Controls whether the object is a wildfire starter (also `true` if entity has `withered` tag). |
| `dropped` | `boolean?` | `nil` | Indicates if loot should be dropped via `lootdropper`. |
| `dropheight` | `number?` | `nil` | Vertical offset for looting drop position. |
| `paused` | `boolean` | `false` | Whether the regrowth timer is paused. |
| `pause_time` | `number?` | `nil` | Remaining time when paused (pre-calculation). |
| `targettime` | `number?` | `nil` | Absolute world time when regrowth should complete. |
| `protected_cycles` | `number?` | `nil` | Number of cycles preserved during withering (e.g., via fertilization). |
| `task` | `DoTaskInTime?` | `nil` | Scheduled regrowth task. |
| `useexternaltimer` | `boolean` | `false` | If true, uses external functions (`startregentimer`, `getregentimertime`, etc.) instead of internal tasks. |

## Main Functions

### `Pickable:SetUp(product, regen, number)`
* **Description:** Initializes core properties for a fully grown, immediately harvestable item. Sets `canbepicked` to `true`.
* **Parameters:**
  - `product` (`string`): Prefab name of the item produced on harvest.
  - `regen` (`number`): Base regrowth time (in seconds).
  - `number` (`number?`, optional): Number of items to produce per harvest. Defaults to `1`.

### `Pickable:CanBePicked()`
* **Description:** Returns whether the object can currently be picked.
* **Returns:** `boolean`: True if `canbepicked` is true.

### `Pickable:Pick(picker)`
* **Description:** Handles the harvesting of the item. Decrements cycles (if transplanted), spawns loot, triggers callbacks, and schedules regrowth. Fires `"picked"` event.
* **Parameters:**
  - `picker` (`Entity?`): The entity doing the harvesting (may be `nil` or `TheWorld`).

### `Pickable:Regen()`
* **Description:** Marks the object as ready to pick (`canbepicked = true`), cancels any pending regrowth task, and calls `makefullfn` and `onregenfn` callbacks.
* **No parameters.**

### `Pickable:MakeEmpty()`
* **Description:** Initiates regrowth by setting `canbepicked = false`, calling `makeemptyfn`, and scheduling a regrowth task (if `baseregentime` is set and not paused).
* **No parameters.**

### `Pickable:MakeBarren()`
* **Description:** Permanently disables regrowth by setting `cycles_left = 0` and `canbepicked = false`. Cancels any pending task. Calls `makebarrenfn` if present.
* **No parameters.**

### `Pickable:Fertilize(fertilizer, doer)`
* **Description:** Restores or extends harvest cycles (especially for withered plants), cancels withering, and calls `MakeEmpty()`.
* **Parameters:**
  - `fertilizer` (`Entity`): The fertilizer entity used (accessed for `fertilizer.components.fertilizer.withered_cycles`).
  - `doer` (`Entity?`): The entity applying fertilizer (used for sound playback).

### `Pickable:OnTransplant()`
* **Description:** Marks the object as transplanted and calls `ontransplantfn` if defined. Typically invoked on player transplant actions.
* **No parameters.**

### `Pickable:LongUpdate(dt)`
* **Description:** Updates regrowth progress using world time delta. Handles rescheduling and immediate regrowth if timer expires. Respects `useexternaltimer` mode.
* **Parameters:**
  - `dt` (`number`): Delta time (time since last update).

### `Pickable:FinishGrowing()`
* **Description:** Immediately finishes regrowth if the object is not yet ready (`canbepicked` is false). Cancels any pending task and calls `Regen()`.
* **Returns:** `boolean`: `true` if regrowth was completed during this call.

### `Pickable:Pause()` / `Pickable:Resume()`
* **Description:** Pauses or resumes regrowth timing logic. Respects both internal (`task`-based) and external timer modes.
* **Parameters:** None for either method.

### `Pickable:IsWildfireStarter()`
* **Description:** Returns whether the object is a wildfire starter.
* **Returns:** `boolean`: True if `wildfirestarter` is `true` or the entity has the `withered` tag.

### `Pickable:IsBarren()`
* **Description:** Checks if the object is barren (regrowth cycles exhausted).
* **Returns:** `boolean`: True if `cycles_left == 0`.

### `Pickable:SpawnProductLoot(picker)`
* **Description:** Spawns the product item(s) on the ground or into the picker’s inventory, respecting `numtoharvest`, `dropped`, and `use_lootdropper_for_product` flags.
* **Parameters:**
  - `picker` (`Entity?`): The entity harvesting (used for inventory placement or event firing).

### `Pickable:ConsumeCycles(cycles)`
* **Description:** Manually decrements `cycles_left` (if transplanted) and `protected_cycles`.
* **Parameters:**
  - `cycles` (`number`): Number of cycles to consume.

### `Pickable:SetStuck(stuck)`
* **Description:** Sets or clears the `stuck` state. Prevents picking if true.
* **Parameters:**
  - `stuck` (`boolean`): New stuck state.

### `Pickable:IsStuck()`
* **Description:** Returns whether the object is stuck and unpickable.
* **Returns:** `boolean`.

### `Pickable:GetDebugString()`
* **Description:** Returns a debug string summarizing internal state (e.g., paused, regen time remaining, cycles).
* **Returns:** `string`.

### `Pickable:OnSave()` / `Pickable:OnLoad(data)`
* **Description:** Serialize/deserialize full state for persistence. Supports saving/restoring `cycles`, regrowth timers, paused state, protection, and transplanted status.
* **Parameters:**
  - `data` (`table`): State data to load (for `OnLoad`).

## Events & Listeners
- **Events listened to (via `inst:ListenForEvent` implied by property setters in Class()):**
  - `canbepicked`
  - `caninteractwith`
  - `cycles_left`
  - `quickpick`
  - `jostlepick`
- **Events triggered (via `inst:PushEvent`):**
  - `"picked"` with payload `{ picker = ..., loot = ..., plant = ... }`
  - `"picksomething"` (in `SpawnProductLoot`) with payload `{ object = self.inst, loot = ... }` when inventory is involved.
- **Timer events (handled internally via `DoTaskInTime`):**
  - `OnRegen` — triggers `Regen()` when scheduled timer completes.