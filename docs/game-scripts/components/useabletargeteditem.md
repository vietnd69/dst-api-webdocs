---
id: useabletargeteditem
title: Useabletargeteditem
description: A component that enables an entity to be used as a targeted interactable object, managing interaction state, target prefabs, mounting, and custom use/stop callbacks via tag updates.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 04989bbe
---

# Useabletargeteditem

## Overview
This component allows an entity to function as a targetable interactable object in the game, primarily by tracking whether it is currently being used (`inuse_targeted`), supporting configurable target prefabs, inventory disablement, and mounted usage. It automatically updates entity tags based on internal state changes and provides hooks for defining custom use/stop behaviors.

## Dependencies & Tags
- **Tags added/removed internally:**  
  - `"inuse_targeted"` — added when `inuse_targeted` is true, removed otherwise.  
  - `"useabletargeteditem_inventorydisable"` — added when `inventory_disableable` is true.  
  - `"<prefabname>_targeter"` — added when `useabletargetprefab` is set, with tag name derived from the prefab name.  
  - `"useabletargeteditem_mounted"` — added when `useablemounted` is true.  
- **No explicit external components are added via `AddComponent`** in this file.  
- Clients may optionally configure `inst.UseableTargetedItem_ValidTarget` function (documented only as a comment).

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity instance. |
| `inuse_targeted` | `boolean` | `false` | Indicates whether the item is currently being used by a player. Controls the `"inuse_targeted"` tag. |
| `inventory_disableable` | `boolean` | `false` | When true, indicates this item should be disabled in inventory; controls the `"useabletargeteditem_inventorydisable"` tag. |
| `useabletargetprefab` | `string?` | `nil` | Prefab name this item can target; if set, adds a dynamic `"<prefab>_targeter"` tag. |
| `useablemounted` | `boolean?` | `nil` | Indicates whether the item is mounted; controls the `"useabletargeteditem_mounted"` tag. |
| `onusefn` | `function?` | `nil` | Custom callback invoked when use starts. Signature: `fn(inst, target, doer) → success, reason`. |
| `onstopusefn` | `function?` | `nil` | Custom callback invoked when use stops. Signature: `fn(inst)`. |

## Main Functions

### `SetTargetPrefab(prefab_name)`
* **Description:** Sets the targetable prefab this item can interact with. Automatically manages the corresponding `"<prefab>_targeter"` tag.  
* **Parameters:**  
  - `prefab_name` (`string`): The name of the prefab this item is designated to target.

### `SetUseableMounted(enable)`
* **Description:** Configures whether this item is mounted. Updates the `"useabletargeteditem_mounted"` tag accordingly.  
* **Parameters:**  
  - `enable` (`boolean`): If true, marks the item as mounted.

### `SetInventoryDisable(value)`
* **Description:** Enables/disables inventory interaction for this item. Controls the `"useabletargeteditem_inventorydisable"` tag.  
* **Parameters:**  
  - `value` (`boolean`): If true, disables inventory use.

### `CanInteract()`
* **Description:** Determines whether a new interaction can begin. Returns `true` only if the item is not currently in use (`inuse_targeted` is false).  
* **Parameters:** None.  
* **Returns:** `boolean`

### `StartUsingItem(target, doer)`
* **Description:** Initiates use of the item. If a custom `onusefn` is defined, it is called to determine success. On success and if the item remains valid, `inuse_targeted` is set to true.  
* **Parameters:**  
  - `target` (`Entity`): The target entity being interacted with.  
  - `doer` (`Entity`): The entity performing the use (typically a player).  
* **Returns:**  
  - `usesuccess` (`boolean`): Whether use succeeded.  
  - `usefailreason` (`string?`): Optional reason for failure (returned only if `onusefn` provides it).

### `StopUsingItem()`
* **Description:** Ends the current use of the item. Sets `inuse_targeted` to false and invokes `onstopusefn` if defined.  
* **Parameters:** None.

## Events & Listeners
This component uses direct function callbacks via public setters (`SetOnUseFn`, `SetOnStopUseFn`) rather than DST event listeners. No `inst:ListenForEvent` or `inst:PushEvent` calls are present in this component.