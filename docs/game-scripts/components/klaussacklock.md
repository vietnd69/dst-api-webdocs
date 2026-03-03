---
id: klaussacklock
title: Klaussacklock
description: Manages keyed interaction logic for Klaus sack locks, allowing or denying access based on a callback function and key consumption behavior.
tags: [lock, key, interaction]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c6d9a545
system_scope: entity
---

# Klaussacklock

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`KlausSackLock` enables customizable key-based unlocking logic for entities (specifically designed for Klaus sack locks). It associates a callback function (`onusekeyfn`) with the lock and executes it when `UseKey` is called, handling key validation and optional consumption via the `stackable` component. The component automatically adds and removes the `klaussacklock` tag on the entity to identify its presence.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("klaussacklock")

inst.components.klaussacklock:SetOnUseKey(function(lock_inst, key, doer)
    if key.prefab == "klauskey" then
        return true, nil, true -- success, no error message, consume key
    end
    return false, "Does not fit", false -- failure, error message, do not consume
end)

-- Later, attempt to use a key:
local success, msg = inst.components.klaussacklock:UseKey(some_key, some_actor)
```

## Dependencies & tags
**Components used:** `stackable` (read via `key.components.stackable` for key removal)
**Tags:** Adds `klaussacklock`; removes `klaussacklock` on component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onusekeyfn` | function\|nil | `nil` | Callback function invoked by `UseKey`. Signature: `fn(lock_inst, key, doer) → (success: boolean, fail_msg: string\|nil, consumed: boolean)`. |
| `inst` | entity | `nil` | Reference to the entity this component is attached to (set in constructor). |

## Main functions
### `SetOnUseKey(onusekeyfn)`
* **Description:** Sets the callback function that defines unlock logic when a key is used.
* **Parameters:** `onusekeyfn` (function\|nil) — a function that accepts `lock_inst`, `key`, and `doer` and returns three values: `success` (boolean), optional `fail_msg` (string\|nil), and `consumed` (boolean).
* **Returns:** Nothing.

### `UseKey(key, doer)`
* **Description:** Attempts to unlock the lock using the provided key, invoking the configured `onusekeyfn`. Handles key validation and removal if `consumed` is true.
* **Parameters:** `key` (entity\|nil) — the key entity to attempt unlocking; `doer` (entity) — the actor attempting the unlock.
* **Returns:** `true` on success; `false, fail_msg` on failure (with optional message).
* **Error states:** Returns `false` immediately if `key` is `nil`, `key:IsValid()` is false, or `onusekeyfn` is `nil`.

## Events & listeners
None identified.

## Key behavior notes
- The component **does not** manage keys automatically beyond calling `UseKey`; it relies entirely on the `onusekeyfn` callback for business logic.
- Key removal is automatic if `onusekeyfn` returns `consumed = true`. For stackable keys, `stackable:Get():Remove()` is used to safely decrement and remove one unit.
- The `klaussacklock` tag is essential for identification (e.g., via `inst:HasTag("klaussacklock")`) and must not be manually removed by mods.
