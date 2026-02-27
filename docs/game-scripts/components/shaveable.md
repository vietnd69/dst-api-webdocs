---
id: shaveable
title: Shaveable
description: Manages beard-related state and shaving mechanics for an entity, including prize drops and conditional shaving validation.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 6909c405
---

# Shaveable

## Overview
The `Shaveable` component enables an entity to be shaved, tracking whether it has a beard via the `bearded` tag and handling the procedural generation of prize items upon shaving. It integrates with the Entity Component System to support conditional logic for shaving (via `can_shave_test`), reward distribution (via `prize_prefab` and `prize_count`), and state persistence.

## Dependencies & Tags
- Adds/removes the `"bearded"` tag on the entity based on `prize_count`.
- Relies on the `SpawnPrefab` global function to generate prize items.
- Requires that prize prefabs have an `inventoryitem` component if wetness inheritance is needed.
- Assumes entities involved may have `inventory`, `position`, or `wetness` components for item transfer and environment handling.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prize_prefab` | `string?` | `nil` | Prefab name of the item(s) dropped when the entity is shaved. |
| `prize_count` | `number?` | `nil` | Number of `prize_prefab` items to drop on shaving. Also controls whether the `"bearded"` tag is present. |
| `can_shave_test` | `function?` | `nil` | Optional callback `(inst, shaver, implement) → (boolean, reason?)` that determines if shaving is allowed. Returns `true, nil` if no test is set. |
| `on_shaved` | `function?` | `nil` | Optional callback `(inst, shaver, implement)` invoked after successful shaving, before returning. |

## Main Functions

### `SetPrize(prize_prefab, prize_count)`
* **Description:** Configures the prefab and quantity of items dropped upon shaving. Also triggers evaluation of the `"bearded"` tag via `on_prize_count`.
* **Parameters:**
  - `prize_prefab` (`string?`): Prefab name of items to drop. Use `nil` to disable prize drops.
  - `prize_count` (`number?`): Number of items to drop. Non-positive values remove the `"bearded"` tag.

### `CanShave(shaver, shaving_implement)`
* **Description:** Validates whether the entity can be shaved by the given actor using the specified tool. Delegates to `can_shave_test` if defined.
* **Parameters:**
  - `shaver` (`Entity?`): The entity performing the shave.
  - `shaving_implement` (`Entity?`): The tool used (e.g., razor, scissors).
* **Returns:** `(boolean, reason?)` — `true` if allowed; otherwise `false` and an optional reason.

### `Shave(shaver, shaving_implement)`
* **Description:** Executes the shaving action: validates permission, spawns prize items, optionally drops them into the shaver’s inventory or world, and invokes `on_shaved`.
* **Parameters:**
  - `shaver` (`Entity?`): The entity performing the shave.
  - `shaving_implement` (`Entity?`): The tool used.
* **Returns:** `true` on success; otherwise `(false, reason)` from `CanShave`.

### `OnSave()`
* **Description:** Serializes component state for save/load persistence.
* **Returns:** `{ prize_count = number? }`

### `OnLoad(data)`
* **Description:** Restores component state from saved data.
* **Parameters:**
  - `data` (`table`): Contains `prize_count` as restored state.

### `GetDebugString()`
* **Description:** Returns a debug-friendly string representation (e.g., `"2 beard_fluff"`).
* **Returns:** `string`

## Events & Listeners
- Listens to `"prize_count"` event via the `prize_count` property: `self.prize_count = on_prize_count` assigns a handler that adds/removes the `"bearded"` tag when `prize_count` is modified externally (e.g., via property sync).  
- On removal from entity (`OnRemoveFromEntity`), it unconditionally removes the `"bearded"` tag.