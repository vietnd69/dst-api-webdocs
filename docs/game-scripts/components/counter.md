---
id: counter
title: Counter
description: Manages named numeric counters with support for increment/decrement, per-counter save filtering, and save/load persistence.
tags: [storage, savegame, utilities]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b04ab796
system_scope: entity
---

# Counter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Counter` is a lightweight utility component that manages a collection of named numeric counters attached to an entity. It provides straightforward arithmetic operations (`Increment`, `Decrement`, `DoDelta`), conditional counter adjustments (`IncrementToZero`, `DecrementToZero`), and integration with DST’s save/load system via `OnSave`/`OnLoad`. Counters can be marked as non-persistent (excluded from save files) using `DoNotSave`. It does not interact with other components directly.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("counter")

inst.components.counter:Set("souls_collected", 5)
inst.components.counter:Increment("souls_collected", 2)   -- → 7
inst.components.counter:Decrement("souls_collected")      -- → 6
inst.components.counter:IncrementToZero("souls_collected")-- moves toward zero

-- Mark a temporary counter as non-persistent
inst.components.counter:DoNotSave("temp_charge")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `counters` | table | `{}` | Internal map of counter names (string) → numeric values (number). |
| `donotsave` | table | `{}` | Internal set of counter names (string) → `true` that should be excluded from save data. |

## Main functions
### `GetCount(countername)`
* **Description:** Returns the current value of the named counter, or `0` if the counter does not exist.
* **Parameters:** `countername` (string) — the identifier for the counter.
* **Returns:** number — current counter value (always `>= 0`, unless intentionally set to negative).

### `Set(countername, value)`
* **Description:** Sets the named counter to a specific value. Overwrites any existing value.
* **Parameters:** 
  * `countername` (string) — the identifier for the counter.
  * `value` (number) — the new numeric value.
* **Returns:** Nothing.

### `Clear(countername)`
* **Description:** Removes the named counter entirely from the collection (as if it were never set).
* **Parameters:** `countername` (string) — the identifier for the counter.
* **Returns:** Nothing.

### `DoDelta(countername, delta)`
* **Description:** Applies a signed numeric delta to the named counter, removing the counter if its value becomes `0`.
* **Parameters:** 
  * `countername` (string) — the identifier for the counter.
  * `delta` (number) — the amount to add (can be negative).
* **Returns:** Nothing.

### `Increment(countername, magnitude)`
* **Description:** Increases the named counter by `magnitude` (default `1`).
* **Parameters:** 
  * `countername` (string) — the identifier for the counter.
  * `magnitude` (number, optional) — amount to increment by (default `1`).
* **Returns:** Nothing.

### `Decrement(countername, magnitude)`
* **Description:** Decreases the named counter by `magnitude` (default `1`).
* **Parameters:** 
  * `countername` (string) — the identifier for the counter.
  * `magnitude` (number, optional) — amount to decrement by (default `1`).
* **Returns:** Nothing.

### `IncrementToZero(countername, magnitude)`
* **Description:** Increases the counter toward zero only if it is currently negative. Does nothing if the counter is already `>= 0`.
* **Parameters:** 
  * `countername` (string) — the identifier for the counter.
  * `magnitude` (number, optional) — maximum step size per call (default `1`).
* **Returns:** Nothing.
* **Error states:** No-op if `GetCount(countername) >= 0`.

### `DecrementToZero(countername, magnitude)`
* **Description:** Decreases the counter toward zero only if it is currently positive. Does nothing if the counter is `<= 0`.
* **Parameters:** 
  * `countername` (string) — the identifier for the counter.
  * `magnitude` (number, optional) — maximum step size per call (default `1`).
* **Returns:** Nothing.
* **Error states:** No-op if `GetCount(countername) <= 0`.

### `DoNotSave(countername)`
* **Description:** Marks a counter as non-persistent. Must be called before save operations to take effect.
* **Parameters:** `countername` (string) — the identifier for the counter.
* **Returns:** Nothing.
* **Notes:** Intended to be a one-way operation; resetting this flag is not supported.

### `OnSave()`
* **Description:** Invoked during save serialization. Returns a table containing only counters not marked as `donotsave`.
* **Parameters:** None.
* **Returns:** table? — `nil` if no counters exist; otherwise `{ counters = { ... } }` with filtered key-value pairs.

### `OnLoad(data)`
* **Description:** Invoked during load to restore counter values from saved data.
* **Parameters:** `data` (table?) — save data payload, typically `{ counters = { ... } }`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted multi-line debug string listing all counter names and values, sorted alphabetically. Useful for console/inspect output.
* **Parameters:** None.
* **Returns:** string? — `nil` if no counters; otherwise a string like `"2 total\n  alpha : 3\n  beta : 5"`.

## Events & listeners
None identified
