---
id: trophyscale
title: Trophyscale
description: Manages trophy data for a weighable item, including comparison logic, storage, and spawner functionality for trophy instances.
tags: [inventory, weight, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4743737b
system_scope: entity
---

# Trophyscale

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`TrophyScale` is a component that stores metadata about the heaviest weighable item captured or observed by its owner entity (e.g., a trophy stand). It supports dynamic comparison of new items against stored trophy data, automatically replaces the previous trophy when a heavier item is captured, and provides utilities to re-spawn or transfer the trophy item. The component relies on `weighable`, `stackable`, and `inventory` components from other prefabs to extract and manage weight-based metadata.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("trophyscale")
inst.components.trophyscale:SetComparePostFn(function(item_data, item)
    -- Custom post-processing after trophy update
    item_data.note = "New high score"
end)

-- Compare a new candidate item
local success = inst.components.trophyscale:Compare(candidate_item, doer)

-- Later, spawn a new item from the stored trophy data
local item = inst.components.trophyscale:SpawnItemFromData()
```

## Dependencies & tags
**Components used:** `weighable`, `stackable`, `inventory`
**Tags:** Adds/removes `"trophyscale_<type>"` on type changes; adds/removes `"trophycanbetaken"` on `SetItemCanBeTaken`; checks `"trophycanbetaken"` implicitly for take logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `type` | string or `nil` | `nil` | Optional classification string used to prefix the `"trophyscale_"` tag. |
| `item_data` | table or `nil` | `nil` | Stores metadata of the currently held trophy item: `weight`, `is_heavy`, `prefab`, `build`, `owner_userid`, `owner_name`, `prefab_override_owner`. |
| `compare_postfn` | function or `nil` | `nil` | Optional callback after successful trophy comparison; receives `(item_data, item)` arguments. |
| `onspawnitemfromdatafn` | function or `nil` | `nil` | Optional callback when spawning item from stored data; receives `(item, data)` arguments. |
| `takeitemtestfn` | function or `nil` | `nil` | Reserved for future use. |
| `onitemtakenfn` | function or `nil` | `nil` | Optional callback when item is taken; receives `(trophy_inst, item_data)` arguments. |
| `accepts_items` | boolean | `true` | Controls whether the trophy entity accepts new items for comparison. |

## Main functions
### `GetDebugString()`
* **Description:** Returns a formatted string with current trophy metadata for debugging (e.g., weight, prefab, owner).
* **Parameters:** None.
* **Returns:** `string` — `"weight: X.XXX, prefab: Y, owner: Z, override owner: W"` or `"empty"` if `item_data` is `nil`.
* **Error states:** Does not fail; safe to call even when `item_data` is `nil`.

### `SetComparePostFn(fn)`
* **Description:** Assigns a callback to run after a successful trophy comparison (`Compare`), allowing customization of stored `item_data`.
* **Parameters:** `fn` (function) — signature `(item_data, item)`.
* **Returns:** Nothing.

### `SetOnSpawnItemFromDataFn(fn)`
* **Description:** Assigns a callback to run after spawning an item from stored data.
* **Parameters:** `fn` (function) — signature `(item, data)`.
* **Returns:** Nothing.

### `SetTakeItemTestFn(fn)`
* **Description:** Reserved for future use; no effect in current build.
* **Parameters:** `fn` (function) — signature not used.
* **Returns:** Nothing.

### `SetOnItemTakenFn(fn)`
* **Description:** Assigns a callback to run after an item is taken (via `TakeItem`).
* **Parameters:** `fn` (function) — signature `(trophy_inst, item_data)`.
* **Returns:** Nothing.

### `GetItemData()`
* **Description:** Returns the currently stored trophy metadata.
* **Parameters:** None.
* **Returns:** `table or nil` — the internal `item_data` table, or `nil` if no trophy is set.

### `Compare(inst_compare, doer)`
* **Description:** Compares the weight of `inst_compare` against the stored trophy. If the new item is heavier (or no trophy exists), it replaces the stored trophy and fires `onnewtrophy`. The source item is removed after being accepted.
* **Parameters:**
  * `inst_compare` (entity) — the candidate item to compare.
  * `doer` (entity) — the entity performing the comparison (passed to the `onnewtrophy` event).
* **Returns:**
  * `true` — if the trophy was updated.
  * `false, "TYPE_TOO_SMALL"` — if the candidate is lighter or equal weight.
* **Error states:** Assumes `inst_compare.components.weighable` exists; will error if missing.

### `ClearItemData()`
* **Description:** Resets the stored trophy metadata to `nil`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnItemFromData(override_data)`
* **Description:** Spawns a new instance of the trophy item using stored or provided `item_data`. Sets `weighable` fields and triggers `onspawnitemfromdatafn` if present.
* **Parameters:** `override_data` (table or `nil`) — optional replacement for `self.item_data`.
* **Returns:** `entity or nil` — the spawned item, or `nil` if `item_data.prefab` is invalid or `SpawnPrefab` fails.

### `SetItemCanBeTaken(can_be_taken)`
* **Description:** Sets or removes the `"trophycanbetaken"` tag on the trophy entity, controlling whether the item can be taken by a receiver.
* **Parameters:** `can_be_taken` (boolean).
* **Returns:** Nothing.

### `TakeItem(receiver)`
* **Description:** Spawns and gives the trophy item to `receiver`, then triggers `onitemtakenfn` and clears trophy data.
* **Parameters:** `receiver` (entity) — must have an `inventory` component and a valid position.
* **Returns:**
  * `true` — if item was successfully taken.
  * `false` — if either `item_data` or `receiver.inventory` is invalid, or spawning failed.

### `OnSave()`
* **Description:** Returns the current `item_data` table for serialization.
* **Parameters:** None.
* **Returns:** `table or nil` — the stored trophy metadata.

### `OnLoad(data)`
* **Description:** Restores `item_data` from serialized data.
* **Parameters:** `data` (table or `nil`) — previously saved `item_data`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly.
- **Pushes:** `"onnewtrophy"` — fired when `Compare` successfully replaces the trophy; payload `{ old = item_data, new = item_data, doer = entity }`.
