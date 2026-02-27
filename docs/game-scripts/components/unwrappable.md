---
id: unwrappable
title: Unwrappable
description: Manages the ability for an entity to wrap items into storage and unwrap them later, including peeking, delay support, and saving/loading state.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 6ac13198
---

# Unwrappable

## Overview
The `Unwrappable` component enables an entity (e.g., a gift box or crate) to store ("wrap") one or more items as serialized data and later release ("unwrap") them at a computed position. It supports optional callbacks for wrapping/unwrapping events, configurable unwrapping delays, peeking into wrapped content via a preview container, and persistent saving/loading of wrapped item state.

## Dependencies & Tags
- Adds/Removes the `"unwrappable"` tag based on `canbeunwrapped` state.
- Adds/Removes the `"canpeek"` tag when `SetPeekContainer` is called with a non-nil container prefab.
- Relies on components potentially present on the owner entity: `inventoryitem`, `inventory`, `container`, `Transform`, `Physics`.
- Uses global systems: `TheWorld`, `SpawnPrefab`, `FindWalkableOffset`, `TheWorld.Map`.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the owning entity instance. |
| `itemdata` | `table` or `nil` | `nil` | Array of serialized item records (from `GetSaveRecord`) currently wrapped. |
| `canbeunwrapped` | `boolean` | `true` | Controls whether the `"unwrappable"` tag is present. |
| `onwrappedfn` | `function` or `nil` | `nil` | Callback called after wrapping: `(bundle_inst, num_items, doer)`. |
| `onunwrappedfn` | `function` or `nil` | `nil` | Callback called after unwrapping: `(bundle_inst, pos, doer)`. |
| `unwrapdelayfn` | `function` or `nil` | `nil` | Callback to compute unwrapping delay: `(bundle_inst, doer) → delay (seconds) or nil`. |
| `origin` | `string` or `nil` | `nil` | Session identifier of the world where items were originally spawned (used for cross-session item persistence). |
| `peekcontainer` | `string` or `nil` | `nil` | Prefab name of the container used when peeking inside (e.g., `"wrapped_present"`). |

## Main Functions

### `Unwrappable:SetOnWrappedFn(fn)`
* **Description:** Registers a callback function to be invoked after items are successfully wrapped into the entity.
* **Parameters:**  
  `fn` (`function`) — Callback with signature `(bundle_inst, num_items, doer)`.

### `Unwrappable:SetOnUnwrappedFn(fn)`
* **Description:** Registers a callback function to be invoked after items are successfully unwrapped from the entity.
* **Parameters:**  
  `fn` (`function`) — Callback with signature `(bundle_inst, pos, doer)`.

### `Unwrappable:SetUnwrapDelayFn(fn)`
* **Description:** Sets a function to determine a delay (in seconds) before unwrapping occurs. If the function returns `nil`, no delay is applied.
* **Parameters:**  
  `fn` (`function`) — Callback with signature `(bundle_inst, doer) → delay (number) or nil`.

### `Unwrappable:SetPeekContainer(preference)`
* **Description:** Configures the prefab name of a temporary container used for peeking at wrapped items. Adds/removes the `"canpeek"` tag accordingly.
* **Parameters:**  
  `preference` (`string` or `nil`) — Prefab name (e.g., `"wrapped_present"`) or `nil` to disable peeking.

### `Unwrappable:WrapItems(items, doer)`
* **Description:** Converts a list of items (or prefab names) into serialized data and stores it internally. Marks the wrapped items with `"wrappeditem"` event and triggers the `onwrappedfn` callback.
* **Parameters:**  
  `items` (`table`) — Array of item instances or prefab names to wrap.  
  `doer` (`Entity` or `nil`) — The actor performing the wrap action.

### `Unwrappable:Unwrap(doer, nodelay)`
* **Description:** Spawns and positions all wrapped items in the world, optionally after a delay (if `unwrapdelayfn` returns > 0). Emits `"unwrapped"` and `"unwrappeditem"` events, and triggers `onunwrappedfn`.
* **Parameters:**  
  `doer` (`Entity` or `nil`) — The actor performing the unwrap. Used for positioning and ownership logic.  
  `nodelay` (`boolean`) — If `true`, skips any configured delay.

### `Unwrappable:PeekInContainer(doer)`
* **Description:** Spawns a temporary peek container, populates it with preview copies of wrapped items (read-only), opens it for the `doer`, and transitions the `doer` into a `"bundling"` state. Returns `true` on success.
* **Parameters:**  
  `doer` (`Entity`) — The player who will view the peek container.

### `Unwrappable:OnSave()`
* **Description:** Returns a table containing saved state (`itemdata`, `origin`) if items are currently wrapped.
* **Returns:**  
  `table` or `nil` — Save record, e.g., `{ items = {...}, origin = "session_id" }`.

### `Unwrappable:OnLoad(data)`
* **Description:** Restores wrapped item state from a save record and triggers `onwrappedfn` if defined.
* **Parameters:**  
  `data` (`table`) — Save data with `items` and `origin` fields.

## Events & Listeners

- Listens for property change on `canbeunwrapped` via dynamic setter `oncanbeunwrapped` to add/remove `"unwrappable"` tag.
- Listens for property change on `peekcontainer` via dynamic setter in `SetPeekContainer` to add/remove `"canpeek"` tag.
- Pushes `"wrappeditem"` event on each wrapped item instance.
- Pushes `"unwrappeditem"` event on each spawned unwrapped item instance.
- Pushes `"unwrapped"` event on the owner entity after unwrapping completes.