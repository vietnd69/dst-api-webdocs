---
id: selfstacker
title: Selfstacker
description: Enables an item to automatically find and merge with another identical item within range when it is stationary, not held, not burning, not in a trap, and not fully stacked.
tags: [inventory, stacking, automation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8eb1f79c
system_scope: inventory
---

# Selfstacker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SelfStacker` allows an item to autonomously detect and merge with a nearby identical item that also supports self-stacking. It is used primarily for non-player entities (e.g., the item-stacking gnome) that act as catalysts for automatic item consolidation. The component performs periodic checks while the entity is awake, and only stacks if the item meets several conditions: it must not be held, not be burning, not be in a trap, not be fully stacked, and not be moving quickly.

The component interacts with the `bait`, `burnable`, `inventoryitem`, `stackable`, and physical motion systems to validate stacking eligibility and then executes stacking logic by calling methods on `stackable`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("selfstacker")
inst.components.selfstacker:SetIgnoreMovingFast(true)
inst.components.selfstacker:OnEntityWake()
```

## Dependencies & tags
**Components used:** `bait`, `burnable`, `inventoryitem`, `stackable`, `Physics`  
**Tags:** Adds `selfstacker`; checks for `outofreach` and `selfstacker` on candidates.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `searchradius` | number | `20` | Maximum distance (in world units) to scan for stacking partners. |
| `stackpartner` | `TheGong` or `nil` | `nil` | Reference to the item selected for stacking. Set during `FindItemToStackWith()`. |
| `ignoremovingfast` | boolean or `nil` | `nil` | If `true`, the speed check is bypassed; if `nil`, speed must be low (`LengthSq < 1`). |
| `stacktask` | `Task` or `nil` | `nil` | Timer task used to delay stacking execution. Cancelled on entity removal or reactivation. |
| `isvalidpartnerfn` | function | — | Predicate used by `FindEntity()` to validate candidate items. |

## Main functions
### `SetIgnoreMovingFast(ignorespeedcheck)`
* **Description:** Configures whether the velocity check should be skipped during stacking eligibility evaluation.
* **Parameters:** `ignorespeedcheck` (boolean) — if `true`, ignores movement speed when determining if stacking is allowed.
* **Returns:** Nothing.

### `CanSelfStack()`
* **Description:** Determines whether the owned item is currently eligible to be stacked *into* another item. It checks that the item is not in a trap, not burning, not fully stacked, not held, and (if `ignoremovingfast` is `nil`) not moving significantly.
* **Parameters:** None.
* **Returns:** `true` if the item can be stacked, otherwise `false`.
* **Error states:** Returns `false` if any required component is missing or violates stacking conditions.

### `OnRemoveEntity()`
* **Description:** Cleans up when the entity is removed from the world. Cancels any pending stacking task and removes the `selfstacker` tag.
* **Parameters:** None.
* **Returns:** Nothing.

### `FindItemToStackWith()`
* **Description:** Scans for a valid stacking partner within `searchradius` using `FindEntity`. A valid partner must have the `selfstacker` tag, not have the `outofreach` tag, and return `true` for `CanSelfStack()`.
* **Parameters:** None.
* **Returns:** `TheGong` or `nil` — the found item, or `nil` if no valid partner exists. If successful, sets `stackpartner` and updates the partner’s `stackpartner` field to point back to `self.inst`.
* **Error states:** Returns `nil` if no suitable entity is found or if `FindEntity` fails.

### `DoStack()`
* **Description:** Attempts to fully stack the owned item with the currently selected `stackpartner`. It computes how much space remains in the current stack, retrieves that many items from the partner, and then combines them via `stackable:Put()`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `stackpartner` is `nil`, or if `stackable:Put()` fails (e.g., due to mismatched prefabs, though `FindItemToStackWith` filters for prefab/skinname matches).

### `OnEntityWake()`
* **Description:** Called when the entity wakes up (e.g., is spawned or reactivated). Clears any stale `stackpartner` reference, checks if stacking is possible, and schedules a delayed stacking attempt (with random jitter ≤ 0.1 seconds) via `DoStack`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `CanSelfStack()` returns `false`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
