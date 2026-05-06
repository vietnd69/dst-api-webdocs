---
id: useabletargeteditem
title: Useabletargeteditem
description: Manages targeted item usage states and tag synchronization for entities that can be used on specific targets.
tags: [item, targeting, interaction]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 01d6263e
system_scope: entity
---

# Useabletargeteditem

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Useabletargeteditem` manages the state of items that require a target entity to be used. It tracks whether the item is currently in use, controls inventory disable behavior, and synchronizes entity tags based on property changes. This component is commonly used for weapons, tools, or consumables that must be directed at a specific target prefab or entity. Property changes automatically update entity tags to affect targeting and interaction systems.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("useabletargeteditem")

inst.components.useabletargeteditem:SetTargetPrefab("beefalo")
inst.components.useabletargeteditem:SetInventoryDisable(true)
inst.components.useabletargeteditem:SetCanSelfTarget(false)

inst.components.useabletargeteditem:SetOnUseFn(function(inst, target, doer)
    return true
end)

inst.components.useabletargeteditem:StartUsingItem(target, doer)
inst.components.useabletargeteditem:StopUsingItem()
```

## Dependencies & tags
**Components used:**
None identified.

**Tags:**
- `inuse_targeted` -- added when `inuse_targeted` is true, removed when false
- `useabletargeteditem_inventorydisable` -- added when `inventory_disableable` is true
- `useabletargateditem_canselftarget` -- added/removed based on `canselftarget` value (note: typo in source)
- `{prefab}_targeter` -- dynamic tag based on `useabletargetprefab` value
- `useabletargeteditem_mounted` -- added when `useablemounted` is true

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inuse_targeted` | boolean | `false` | Whether the item is currently being used on a target. |
| `inventory_disableable` | boolean | `false` | Whether inventory actions should be disabled while active. |
| `canselftarget` | boolean | `false` | Whether the item can target the user itself. |
| `useabletargetprefab` | string | `nil` | The prefab name that this item can target. |
| `useablemounted` | boolean | `nil` | Whether the item is usable while mounted. |
| `onusefn` | function | `nil` | Callback function called when starting item use. |
| `onstopusefn` | function | `nil` | Callback function called when stopping item use. |
| `usingdoesnottoggleuseability` | boolean | `nil` | Whether using the item toggles the useability state. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when the component is removed from an entity. Removes all tags that were added by this component.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetTargetPrefab(prefab_name)`
* **Description:** Sets the target prefab name and updates the entity's targeter tag accordingly. Removes old prefab tag if one existed.
* **Parameters:** `prefab_name` -- string prefab name to target, or nil to clear
* **Returns:** None
* **Error states:** None

### `SetUseableMounted(enable)`
* **Description:** Sets whether the item can be used while mounted. Updates the `useabletargeteditem_mounted` tag.
* **Parameters:** `enable` -- boolean to enable or disable mounted usage
* **Returns:** None
* **Error states:** None

### `SetOnUseFn(fn)`
* **Description:** Sets the callback function that is called when starting to use the item.
* **Parameters:** `fn` -- function(inst, target, doer) returning success boolean and optional fail reason
* **Returns:** None
* **Error states:** None

### `SetOnStopUseFn(fn)`
* **Description:** Sets the callback function that is called when stopping item use.
* **Parameters:** `fn` -- function(inst) called on stop
* **Returns:** None
* **Error states:** None

### `SetInventoryDisable(value)`
* **Description:** Sets whether inventory actions should be disabled. Updates the `useabletargeteditem_inventorydisable` tag.
* **Parameters:** `value` -- boolean to enable or disable inventory actions
* **Returns:** None
* **Error states:** None

### `SetCanSelfTarget(value)`
* **Description:** Sets whether the item can target the user itself. Updates the `useabletargateditem_canselftarget` tag.
* **Parameters:** `value` -- boolean to allow or disallow self-targeting
* **Returns:** None
* **Error states:** None

### `SetUsingItemDoesNotToggleUseability(value)`
* **Description:** Sets whether using the item toggles the useability state. If true, `inuse_targeted` will not be set to true on use.
* **Parameters:** `value` -- boolean to toggle or maintain useability state
* **Returns:** None
* **Error states:** None

### `CanInteract()`
* **Description:** Checks if the item can currently be interacted with. Returns false if already in use on a target.
* **Parameters:** None
* **Returns:** boolean -- true if not currently in use, false if `inuse_targeted` is true
* **Error states:** None

### `StartUsingItem(target, doer)`
* **Description:** Initiates item use on a target. Calls the `onusefn` callback if set. Sets `inuse_targeted` to true unless `usingdoesnottoggleuseability` is true.
* **Parameters:**
  - `target` -- entity instance being targeted
  - `doer` -- entity instance performing the action
* **Returns:** `success` (boolean), `failreason` (any) -- success status and optional failure reason from callback
* **Error states:** None

### `StopUsingItem()`
* **Description:** Stops using the item. Sets `inuse_targeted` to false and calls the `onstopusefn` callback if set.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

## Events & listeners
**Listens to:** None identified.

**Pushes:** None identified.