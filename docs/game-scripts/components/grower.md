---
id: grower
title: Grower
description: Manages planting, growth, and fertility state for soil-based farming structures by tracking crop cycles and maintaining planted crops.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: f5b49a1c
---

# Grower

## Overview
The `Grower` component manages soil fertility, crop planting, growth, and removal for structures that serve as planting beds (e.g., Farmland, Greenhouse). It tracks the number of remaining soil fertility cycles, maintains a list of planted crops, updates tags like `"fertile"`/`"fullfertile"`/`"infertile"` based on fertility state, and handles save/load, fertilization, and planting logic.

## Dependencies & Tags
- **Tags added:** `"grower"` (on construction), `"NOCLICK"` (when crops are present or planting is active)
- **Tags removed:** `"infertile"`, `"fertile"`, `"fullfertile"` (on construction and removal from entity), `"NOCLICK"` (when no crops remain and not planting)
- **Component reliance:** Uses `SpawnSaveRecord`, `SpawnPrefab`, `TheWorld:PushEvent("itemplanted", ...)`, and assumes referenced entities have components like `fertilizer`, `plantable`, `crop`, `cookable`, `soundemitter`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity this component is attached to. |
| `crops` | `table` | `{}` | Dictionary of planted crop entities (keyed by entity, value = `true`). |
| `level` | `number` | `1` | Unused in current code (present for future extensibility). |
| `croppoints` | `table` | `{}` | Table of relative offsets where crops can be planted. |
| `growrate` | `number` | `1` | Multiplier applied to plant growth time. |
| `cycles_left` | `number` | `1` | Remaining soil fertility cycles. |
| `max_cycles_left` | `number` | `6` | Maximum soil fertility cycles. |
| `isempty` | `boolean` | `true` | Whether any crops are currently planted. |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Cleans up fertility-related tags before the component is removed from its entity.
* **Parameters:** None.

### `IsEmpty() → boolean`
* **Description:** Returns whether the grower currently has no crops planted.
* **Parameters:** None.

### `IsFullFertile() → boolean`
* **Description:** Returns whether the grower is at maximum fertility (i.e., `cycles_left >= max_cycles_left`).
* **Parameters:** None.

### `GetFertilePercent() → number`
* **Description:** Returns the ratio of remaining fertility cycles to maximum cycles (a value between `0.0` and `1.0`).
* **Parameters:** None.

### `IsFertile() → boolean`
* **Description:** Returns whether the grower has any remaining fertility cycles (`cycles_left > 0`).
* **Parameters:** None.

### `OnSave() → table`
* **Description:** Returns a serializable data table containing all planted crops and current soil fertility state.
* **Parameters:** None.

### `Fertilize(obj, doer) → boolean`
* **Description:** Adds soil fertility cycles from the provided fertilizer item (`obj`) and updates fertility UI (if `setfertility` callback is defined).
* **Parameters:**
  * `obj` (`Entity`): The fertilizer item being applied.
  * `doer` (`Entity`): The entity applying the fertilizer (used to play sound effects).
* **Returns:** `true` (always succeeds if a fertilizer component is present).

### `OnLoad(data, newents)`
* **Description:** Restores soil fertility and planted crops from a saved data table. Spawns saved crops and sets them to non-persistent.
* **Parameters:**
  * `data` (`table`): Save data containing `crops` (array of save records) and `cycles_left`.
  * `newents` (`table`): Map of entity IDs to newly spawned entities for linking references.

### `PlantItem(item, doer) → boolean`
* **Description:** Plants crops from a `plantable` item, consuming the item and spawning new crop entities at configured offsets. Updates `"NOCLICK"` tag and fertility UI.
* **Parameters:**
  * `item` (`Entity`): The seed/plantable item to plant.
  * `doer` (`Entity`): The entity performing the planting (used for events).
* **Returns:** `true` on success, `false` if the item lacks a `plantable` component.

### `RemoveCrop(crop)`
* **Description:** Removes a specific crop from the grower, decrements soil fertility cycles, updates `"NOCLICK"` tag, and resets `"isempty"` if no crops remain.
* **Parameters:**
  * `crop` (`Entity`): The crop entity to remove.

### `GetDebugString() → string`
* **Description:** Returns a debug-friendly string showing current fertility cycles.
* **Parameters:** None.

### `Reset(reason)`
* **Description:** Clears all crops. If `reason == "fire"`, spawns burnt product (or ash) instead. Also handles cleanup of `"NOCLICK"` tag.
* **Parameters:**
  * `reason` (`string?`): Optional reason for reset (currently only `"fire"` handled specially).

## Events & Listeners
- **Listens for `onpickup`** on burnt product entity (during fire reset), to remove `"NOCLICK"` tag.
- **Listens for `onremove`** on burnt product entity (during fire reset), to remove `"NOCLICK"` tag.
- **Pushes `"itemplanted"`** event with `{ doer = ..., pos = ... }` after planting.
- **Tag update events:** `onfertile` callback is invoked whenever `isempty`, `cycles_left`, or `max_cycles_left` changes, updating `"infertile"`, `"fertile"`, or `"fullfertile"` tags on the entity.