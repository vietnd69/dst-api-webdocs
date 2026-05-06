---
id: upgrademodule
title: Upgrademodule
description: Manages upgrade module slot configuration and activation state for entities with modular upgrade systems.
tags: [upgrade, module, circuit]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 01ad1d55
system_scope: entity
---

# Upgrademodule

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Upgrademodule` manages the configuration and activation state of upgrade modules attached to entities. It tracks slot capacity, circuit type, and activation status, while providing callback hooks for external components to respond to state changes. This component is designed to work alongside `upgrademoduleowner` which controls activation calls.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("upgrademodule")

-- Configure the module
inst.components.upgrademodule:SetRequiredSlots(3)
inst.components.upgrademodule:SetType(CIRCUIT_BARS.BETA)

-- Set target owner and activate
inst.components.upgrademodule:SetTarget(owner_entity)
inst.components.upgrademodule:TryActivate()

-- Check current state
local slots = inst.components.upgrademodule:GetSlots()
local isActive = inst.components.upgrademodule.activated
```

## Dependencies & tags
**External dependencies:**
- `CIRCUIT_BARS` -- global constant table for circuit bar type identifiers

**Components used:**
- None identified

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The entity instance that owns this component. |
| `slots` | number | `1` | Number of upgrade slots this module provides. |
| `type` | constant | `CIRCUIT_BARS.ALPHA` | Circuit bar type identifier for this module. |
| `activated` | boolean | `false` | Whether the module is currently activated. |
| `target` | entity | `nil` | The owner entity this module is attached to. |
| `onactivatedfn` | function | `nil` | Callback fired on activation. Signature: `fn(inst, target, isloading)`. Set by external code. |
| `ondeactivatedfn` | function | `nil` | Callback fired on deactivation. Signature: `fn(inst, target)`. Set by external code. |
| `onaddedtoownerfn` | function | `nil` | Callback fired when target is set. Signature: `fn(inst, target, isloading)`. Set by external code. |
| `onremovedfromownerfn` | function | `nil` | Callback fired when removed from owner. Signature: `fn(inst, owner)`. Set by external code. |

## Main functions
### `SetRequiredSlots(slots)`
*   **Description:** Sets the number of upgrade slots this module provides.
*   **Parameters:** `slots` -- number of slots to allocate
*   **Returns:** nil
*   **Error states:** None

### `GetSlots()`
*   **Description:** Returns the current number of upgrade slots.
*   **Parameters:** None
*   **Returns:** number -- current slot count
*   **Error states:** None

### `SetTarget(target, isloading)`
*   **Description:** Assigns the owner entity for this module. Fires `onaddedtoownerfn` callback if target is provided and callback is set.
*   **Parameters:**
    - `target` -- entity instance or nil to clear
    - `isloading` -- boolean indicating if this is during load (passed to callback)
*   **Returns:** nil
*   **Error states:** None

### `SetType(bartype)`
*   **Description:** Sets the circuit bar type identifier for this module.
*   **Parameters:** `bartype` -- circuit type constant (e.g., `CIRCUIT_BARS.ALPHA`, `CIRCUIT_BARS.BETA`)
*   **Returns:** nil
*   **Error states:** None

### `GetType()`
*   **Description:** Returns the current circuit bar type identifier.
*   **Parameters:** None
*   **Returns:** constant -- current circuit type
*   **Error states:** None

### `TryActivate(isloading)`
*   **Description:** Activates the module if not already active. Fires `onactivatedfn` callback if set. Should only be called by the `upgrademoduleowner` component.
*   **Parameters:** `isloading` -- boolean indicating if this is during load (passed to callback)
*   **Returns:** nil
*   **Error states:** None

### `TryDeactivate()`
*   **Description:** Deactivates the module if currently active. Fires `ondeactivatedfn` callback if set. Should only be called by the `upgrademoduleowner` component.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `RemoveFromOwner()`
*   **Description:** Clears the target and fires `onremovedfromownerfn` callback if set. Called when the module is being detached from its owner.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

## Events & listeners
- **Listens to:** None identified
- **Pushes:** None identified
- **World state watchers:** None identified

> **Note:** This component uses callback hook properties (`onactivatedfn`, `ondeactivatedfn`, `onaddedtoownerfn`, `onremovedfromownerfn`) instead of the DST event system. These are set by external code and invoked directly during state changes.