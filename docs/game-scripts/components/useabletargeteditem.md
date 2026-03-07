---
id: useabletargeteditem
title: Useabletargeteditem
description: Manages the targeted use behavior and tags for items that can be actively used on specific targets.
tags: [inventory, interaction, tag, item]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 04989bbe
system_scope: inventory
---

# Useabletargeteditem

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Useabletargeteditem` is a component that tracks and manages the state of items which are used in a targeted manner — i.e., when an item is actively being used on a specific target entity. It maintains internal state flags (`inuse_targeted`, `inventory_disableable`, `useablemounted`) and automatically synchronizes them with entity tags for use by other systems (e.g., UI, AI, or gameplay logic). The component supports optional custom callback functions for the start and stop of item usage.

This component does not directly handle the item's effect logic, but provides hooks (`onusefn`, `onstopusefn`) and state management to enable modular, reusable targeted item behaviors.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("useabletargeteditem")

-- Configure target prefab (e.g., "tree") to attach a "tree_targeter" tag
inst.components.useabletargeteditem:SetTargetPrefab("tree")

-- Set custom usage logic: succeeds always for this example
inst.components.useabletargeteditem:SetOnUseFn(function(item, target, doer)
    -- ... perform effect ...
    return true
end)

-- Set stop-usage logic (e.g., cleanup)
inst.components.useabletargeteditem:SetOnStopUseFn(function(item)
    print("Item usage stopped")
end)

-- Start using the item on a target
local success, reason = inst.components.useabletargeteditem:StartUsingItem(target_entity, doer_entity)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:**  
- `inuse_targeted` — added/removed based on `inuse_targeted` state.  
- `useabletargeteditem_inventorydisable` — added/removed based on `inventory_disableable` state.  
- `<prefab_name>_targeter` — added/removed dynamically based on `useabletargetprefab`.  
- `useabletargeteditem_mounted` — added/removed based on `useablemounted` state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inuse_targeted` | boolean | `false` | Whether the item is currently in use on a target. Controlled via the `inuse_targeted` tag. |
| `inventory_disableable` | boolean | `false` | Whether the item should be disabled in inventory while in use. Controls the `useabletargeteditem_inventorydisable` tag. |
| `useabletargetprefab` | string or `nil` | `nil` | Prefab name of the valid target, used to attach a dynamic `_targeter` tag. |
| `useablemounted` | boolean or `nil` | `nil` | Whether the item is mounted (e.g., turret-like). Controls the `useabletargeteditem_mounted` tag. |
| `onusefn` | function or `nil` | `nil` | Optional callback: `fn(item, target, doer)` → `success: boolean, failReason: string?`. |
| `onstopusefn` | function or `nil` | `nil` | Optional callback: `fn(item)`. |

## Main functions
### `SetTargetPrefab(prefab_name)`
*   **Description:** Sets the expected target prefab name and updates the corresponding `_targeter` tag. Removes any old `_targeter` tag if a previous prefab was set.
*   **Parameters:** `prefab_name` (string) — the name of the prefab this item can target.
*   **Returns:** Nothing.

### `SetUseableMounted(enable)`
*   **Description:** Enables or disables the "mounted" state for this item, affecting the `useabletargeteditem_mounted` tag.
*   **Parameters:** `enable` (boolean) — whether the item is mounted.
*   **Returns:** Nothing.

### `SetOnUseFn(fn)`
*   **Description:** Sets the callback function invoked when item usage begins (via `StartUsingItem`). Used to define item-specific activation logic.
*   **Parameters:** `fn` (function) — a function with signature `fn(item, target, doer)` returning `success: boolean, failReason: string?`.
*   **Returns:** Nothing.

### `SetOnStopUseFn(fn)`
*   **Description:** Sets the callback function invoked when item usage ends (via `StopUsingItem`). Typically used for cleanup or state reset.
*   **Parameters:** `fn` (function) — a function with signature `fn(item)`.
*   **Returns:** Nothing.

### `SetInventoryDisable(value)`
*   **Description:** Enables or disables inventory restrictions (e.g., prevents equipping or using elsewhere) while this item is in use.
*   **Parameters:** `value` (boolean) — whether inventory usage should be disabled while active.
*   **Returns:** Nothing.

### `CanInteract()`
*   **Description:** Checks whether the item can be interacted with (i.e., started being used again). Returns `false` if currently in use on a target.
*   **Parameters:** None.
*   **Returns:** `true` if not currently in use; `false` otherwise.

### `StartUsingItem(target, doer)`
*   **Description:** Attempts to start using the item on the given target. Invokes `onusefn` if set; otherwise assumes success. If successful, sets `inuse_targeted = true` and adds the `inuse_targeted` tag.
*   **Parameters:**  
    - `target` (Entity or `nil`) — the target entity the item is being used on.  
    - `doer` (Entity or `nil`) — the entity performing the action (e.g., player or AI).
*   **Returns:**  
    - `usesuccess` (boolean) — `true` if usage succeeded, `false` otherwise.  
    - `usefailreason` (string or `nil`) — optional reason string if usage failed.  
*   **Error states:** Returns `false` and `nil` as `failreason` if `onusefn` explicitly returns `false`. Also returns early if `self.inst` becomes invalid mid-execution.

### `StopUsingItem()`
*   **Description:** Ends the current use session. Resets `inuse_targeted = false`, removes the `inuse_targeted` tag, and invokes `onstopusefn` if set.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    - `inuse_targeted` — sets the `inuse_targeted` tag.  
    - `inventory_disableable` — sets the `useabletargeteditem_inventorydisable` tag.  
    - `useabletargetprefab` — manages dynamic `_targeter` tag.  
    - `useablemounted` — sets/removes the `useabletargeteditem_mounted` tag.  
- **Pushes:** None identified.
