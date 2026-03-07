---
id: pickable
title: Pickable
description: Manages the harvestable lifecycle of entities that regrow over time, including regen timers, fertility states, and loot dropping behavior.
tags: [harvest, regen, loot, growth]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 071825aa
system_scope: entity
---

# Pickable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Pickable` controls the core mechanics for entities that can be harvested (e.g., plants, trees, bushes), including regrowth timers, fertization, life-cycle states (empty/barren/full), and looting. It integrates with `lootdropper`, `witherable`, `burnable`, and `fertilizer` components to support dynamic regenerative behavior. Entities with this component typically emit the `pickable`, `barren`, `quickpick`, and `jostlepick` tags.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("pickable")
inst.components.pickable:SetUp("apple", 600, 3)  -- product, regen time, number per harvest
inst.components.pickable:MakeEmpty()              -- start regrowth cycle
inst.components.pickable:Pick(player)             -- harvest the item
```

## Dependencies & tags
**Components used:** `lootdropper`, `witherable`, `burnable`, `fertilizer`, `inventory`, `inventoryitem`, `stackable`  
**Tags:** Adds/removes `pickable`, `barren`, `quickpick`, `jostlepick`.  
**Tags checked:** `withered`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `canbepicked` | boolean | `nil` | Whether the entity is currently harvestable. |
| `caninteractwith` | boolean | `true` | Whether players can interact with this entity. |
| `regentime` | number | `nil` | Current regrowth duration in seconds (affected by mods). |
| `baseregentime` | number | `nil` | Base regrowth duration in seconds (unchanged by modifiers). |
| `product` | string | `nil` | Prefab name of the item dropped on harvest. |
| `cycles_left` | number | `nil` | Remaining growth cycles for transplanted entities (e.g., farms). |
| `max_cycles` | number | `nil` | Total growth cycles before permanent barren. |
| `transplanted` | boolean | `false` | Whether this entity has been transplanted (e.g., farm plot). |
| `numtoharvest` | number | `1` | Number of `product` items to drop per harvest. |
| `quickpick` | boolean | `false` | If true, adds `quickpick` tag for faster interaction. |
| `jostlepick` | boolean | `false` | If true, adds `jostlepick` tag for automatic harvest on contact. |
| `wildfirestarter` | boolean | `false` | If true, entity can start wildfires (also `true` when `withered`). |
| `droppicked` | boolean | `nil` | If true, uses `lootdropper` to drop product on pick. |
| `dropheight` | number | `nil` | Vertical offset applied to dropped loot. |
| `paused` | boolean | `false` | If true, regrowth timer is paused. |
| `pause_time` | number | `0` | Remaining time when paused. |
| `targettime` | number | `nil` | World time at which regrowth finishes (non-external timers). |
| `protected_cycles` | number | `nil` | Cycles during which withering is blocked (if `witherable` is present). |
| `task` | DTask | `nil` | Scheduled regrowth task (non-external timer mode). |
| `useexternaltimer` | boolean | `false` | If true, regrowth timer is managed by external functions (e.g., `getregentimefn`, `setregentimertime`). |

## Main functions
### `SetUp(product, regen, number)`
* **Description:** Initializes harvest configuration. Enables picking, sets product prefab, base regrowth time, and number of items per harvest.
* **Parameters:**  
  `product` (string) — Prefab name for the harvested item.  
  `regen` (number) — Base regrowth time in seconds.  
  `number` (number) — Items dropped per harvest; defaults to `1`.
* **Returns:** Nothing.
* **Error states:** No effect if called multiple times without clearing (idempotent-safe).

### `CanBePicked()`
* **Description:** Returns whether the entity is currently harvestable.
* **Parameters:** None.
* **Returns:** `true` if `canbepicked` is `true`; `false` otherwise.

### `Pick(picker)`
* **Description:** Attempts to harvest the entity. Handles product dropping, cycle decrement (if transplanted), regrowth rescheduling, and event firing.
* **Parameters:**  
  `picker` (Entity or `nil`) — The entity doing the harvesting. If `nil`, no items are produced. If it lacks an inventory, items are dropped at the entity's position.
* **Returns:**  
  `true` (boolean) — Harvest succeeded.  
  `loot` (Entity or table) — Either the spawned loot entity, or a table of entities when `use_lootdropper_for_product` is set.
* **Error states:** Returns `false, nil` if `canbepicked` or `caninteractwith` is `false`, or if `stuck` is `true`.

### `MakeEmpty()`
* **Description:** Marks the entity as empty and starts regrowth timer if not paused.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if `baseregentime` is `nil`.

### `MakeBarren()`
* **Description:** Permanently disables picking and stops all regrowth tasks. Sets `cycles_left` to `0`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Regen()`
* **Description:** Restores full harvestability. Called automatically when the regrowth timer expires.
* **Parameters:** None.
* **Returns:** Nothing.

### `Fertilize(fertilizer, doer)`
* **Description:** Applies fertilizer to the entity, potentially restoring cycles, ending wither state, and playing a sound.
* **Parameters:**  
  `fertilizer` (Entity) — The fertilizer item. Its `fertilizer` component provides `fertilize_sound` and `withered_cycles`.  
  `doer` (Entity or `nil`) — Entity performing the fertilization; used to play sound if applicable.
* **Returns:** `true`.
* **Error states:** If `witherable` is present, protected cycles are incremented and withering is disabled.

### `IsBarren()`
* **Description:** Checks if the entity is permanently barren (`cycles_left == 0`).
* **Parameters:** None.
* **Returns:** `true` if `cycles_left` is `0`; otherwise `false`.

### `ChangeProduct(newProduct)`
* **Description:** Updates the `product` prefab name (e.g., after transformation).
* **Parameters:**  
  `newProduct` (string) — New prefab name.
* **Returns:** Nothing.

### `Pause()` / `Resume()`
* **Description:** Pauses or resumes the regrowth timer. Supports both internal and external timers via `useexternaltimer`.
* **Parameters:** None.
* **Returns:** Nothing.

### `FinishGrowing()`
* **Description:** Immediately ends regrowth if in progress and regenerates the entity.
* **Parameters:** None.
* **Returns:** `true` if regrowth was interrupted and executed; otherwise `false`.

### `LongUpdate(dt)`
* **Description:** Called during world updates. Progresses regrowth timer for non-paused, non-withered entities.
* **Parameters:**  
  `dt` (number) — Delta time since last update.
* **Returns:** Nothing.

### `OnTransplant()`
* **Description:** Marks the entity as transplanted (e.g., moved to a farm plot) and triggers callback.
* **Parameters:** None.
* **Returns:** Nothing.

### `ConsumeCycles(cycles)`
* **Description:** Decrements `cycles_left` (if transplanted) and `protected_cycles`.
* **Parameters:**  
  `cycles` (number) — Number of cycles to remove.
* **Returns:** Nothing.

### `SpawnProductLoot(picker)`
* **Description:** Spawns and distributes the product item(s) upon harvest, using inventory or world drop logic.
* **Parameters:**  
  `picker` (Entity or `nil`) — The entity harvesting the item.
* **Returns:** `loot` (Entity or table) — Spawned loot entity(s).
* **Error states:** Returns `nil` if `picker` is `nil` and `use_lootdropper_for_product` is `false`.

### `GetDebugString()`
* **Description:** Returns a debug string summarizing key state (e.g., paused, cycles, regen time).
* **Parameters:** None.
* **Returns:** `string` — Human-readable debug info.

### `IsWildfireStarter()`
* **Description:** Indicates whether this entity can ignite wildfires.
* **Parameters:** None.
* **Returns:** `true` if `wildfirestarter` is `true` or entity is `withered`.

## Events & listeners
- **Listens to:** `saved`, `load` (via `OnSave`/`OnLoad` internal handlers).
- **Pushes:** `picked` — fired after harvest with payload `{ picker, loot, plant }`.  
  `pickedbyworld` — **deprecated**, no longer used.
