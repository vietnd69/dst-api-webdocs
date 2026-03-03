---
id: dryingracksaltcollector
title: Dryingracksaltcollector
description: Tracks salt slots in a drying rack and manages salt count changes with optional callback notification.
tags: [world, crafting, inventory]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6a23ea9a
system_scope: world
---

# Dryingracksaltcollector

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DryingRackSaltCollector` is a lightweight component that manages the collection and tracking of salt slots in drying racks. It maintains a set of active salt slots, tracks the total number of salts, and supports an optional callback (`onsaltchangedfn`) that fires whenever the salt count changes. This component is typically attached to drying rack prefabs to handle gameplay logic related to salt-based drying operations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("dryingracksaltcollector")

-- Set a callback to respond to salt changes
inst.components.dryingracksaltcollector:SetOnSaltChangedFn(function(inst, numsalts)
    print("Current salt count:", numsalts)
end)

-- Add and remove salts
inst.components.dryingracksaltcollector:AddSalt("slot_1")
inst.components.dryingracksaltcollector:RemoveSalt("slot_1")

-- Check salt status
if inst.components.dryingracksaltcollector:HasSalt("slot_1") then
    print("Salt found in slot_1")
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `slots` | table | `{}` | A dictionary mapping slot identifiers to `true` indicating presence of salt. |
| `numsalts` | number | `0` | Total count of salt slots currently occupied. |
| `onsaltchangedfn` | function or `nil` | `nil` | Optional callback invoked when salt count changes; signature: `fn(inst, numsalts)`. |

## Main functions
### `SetOnSaltChangedFn(fn)`
* **Description:** Sets or clears the callback function executed when salt count changes.
* **Parameters:** `fn` (function or `nil`) — the callback to invoke on salt changes, or `nil` to remove.
* **Returns:** Nothing.

### `AddSalt(slot)`
* **Description:** Attempts to register a salt in the given slot. Returns `true` only if the slot was newly added.
* **Parameters:** `slot` (any hashable type, typically string or number) — the identifier for the salt slot.
* **Returns:** `true` if the salt was added (slot was previously empty); `false` if already occupied.
* **Error states:** No effect if slot is already occupied.

### `RemoveSalt(slot)`
* **Description:** Attempts to remove a salt from the given slot. Returns `true` only if the slot was successfully cleared.
* **Parameters:** `slot` (any hashable type, typically string or number) — the identifier for the salt slot.
* **Returns:** `true` if the salt was removed (slot existed); `false` if no salt was present.
* **Error states:** No effect if slot was not occupied.

### `HasSalt(slot)`
* **Description:** Checks if a specific slot contains salt, or if *any* salt is present (if `slot` is `nil`).
* **Parameters:** `slot` (any, optional) — if provided, checks the specific slot; if `nil`, checks whether any salt exists.
* **Returns:** `true` if the specified slot has salt, or if `slot` is `nil` and `numsalts > 0`; otherwise `false`.

### `GetNumSalts()`
* **Description:** Returns the total number of occupied salt slots.
* **Parameters:** None.
* **Returns:** `number` — current count of salt slots.

### `OnSave()`
* **Description:** Serializes current salt state for saving to disk. Returns `nil` if no salts are present.
* **Parameters:** None.
* **Returns:** `{ slots = array_of_slot_identifiers }` if `numsalts > 0`; otherwise `nil`.

### `OnLoad(data)`
* **Description:** Loads salt state from saved data. Resets internal slot tracking and `numsalts` before populating from `data.slots`.
* **Parameters:** `data` (table or `nil`) — expected to contain `{ slots = array }` if non-`nil`.
* **Returns:** Nothing.
* **Error states:** Safely ignores missing or malformed `data`; only processes valid slot identifiers.

## Events & listeners
None identified
